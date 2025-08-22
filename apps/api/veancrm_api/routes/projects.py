# apps/api/liderix_api/routes/projects.py
from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from uuid import UUID, uuid4
import logging

from fastapi import (
    APIRouter, Depends, HTTPException, status, Response, Request, 
    Query, BackgroundTasks
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func, and_, or_, delete
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from enum import Enum

from liderix_api.db import get_async_session
from liderix_api.models.projects import Project, ProjectTask
from liderix_api.models.project_members import ProjectMember
from liderix_api.models.users import User
from liderix_api.models.memberships import Membership, MembershipStatus
from liderix_api.config.settings import settings
from liderix_api.schemas.projects import (
    ProjectRead, ProjectCreate, ProjectUpdate, ProjectListResponse,
    ProjectDetailResponse, ProjectMemberAdd, ProjectStatsResponse,
    ProjectStatusUpdate, ProjectMemberResponse
)
from liderix_api.services.auth import get_current_user
from liderix_api.services.audit import AuditLogger
from liderix_api.services.notifications import send_project_notification
from liderix_api.services.permissions import check_project_permission

router = APIRouter(prefix="/projects", tags=["Projects"])
logger = logging.getLogger(__name__)

class ProjectStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class ProjectPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

# ----------------- helpers -----------------

def now_utc() -> datetime:
    return datetime.now(timezone.utc)

def problem(status_code: int, type_: str, title: str, detail: str):
    raise HTTPException(
        status_code=status_code,
        detail={"type": type_, "title": title, "detail": detail, "status": status_code},
    )

async def _get_project_with_access(
    session: AsyncSession, 
    project_id: UUID, 
    current_user: User,
    required_permission: str = "read"
) -> Project:
    """Get project with access validation"""
    project = await session.scalar(
        select(Project)
        .options(
            selectinload(Project.owner),
            selectinload(Project.members),
            selectinload(Project.organization)
        )
        .where(Project.id == project_id)
    )
    
    if not project:
        problem(404, "urn:problem:project-not-found", "Project Not Found", 
                "Project does not exist")
    
    if project.deleted_at is not None:
        problem(404, "urn:problem:project-deleted", "Project Deleted", 
                "Project has been deleted")
    
    # Check access permissions
    if not await check_project_permission(session, project, current_user, required_permission):
        problem(403, "urn:problem:access-denied", "Access Denied", 
                f"You don't have {required_permission} permission for this project")
    
    return project

async def _validate_project_members(session: AsyncSession, org_id: Optional[UUID], user_ids: List[UUID]) -> List[User]:
    """Validate that users can be added as project members"""
    if not user_ids:
        return []
    
    users = await session.scalars(
        select(User).where(
            and_(
                User.id.in_(user_ids),
                User.deleted_at.is_(None),
                User.is_active == True
            )
        )
    )
    
    valid_users = list(users)
    found_ids = {user.id for user in valid_users}
    missing_ids = set(user_ids) - found_ids
    
    if missing_ids:
        problem(400, "urn:problem:invalid-users", "Invalid Users", 
                f"Users not found or inactive: {missing_ids}")
    
    # If project belongs to organization, validate memberships
    if org_id:
        member_ids = await session.scalars(
            select(Membership.user_id).where(
                and_(
                    Membership.org_id == org_id,
                    Membership.user_id.in_(user_ids),
                    Membership.deleted_at.is_(None),
                    Membership.status == MembershipStatus.ACTIVE
                )
            )
        )
        
        valid_member_ids = set(member_ids)
        invalid_member_ids = set(user_ids) - valid_member_ids
        
        if invalid_member_ids:
            problem(400, "urn:problem:non-org-members", "Non-Organization Members", 
                    f"Users are not members of the organization: {invalid_member_ids}")
    
    return valid_users

async def _get_project_stats(session: AsyncSession, project_id: UUID) -> Dict[str, Any]:
    """Get project statistics"""
    # Task counts by status
    task_stats = await session.execute(
        select(ProjectTask.status, func.count(ProjectTask.id))
        .where(
            and_(
                ProjectTask.project_id == project_id,
                ProjectTask.deleted_at.is_(None)
            )
        )
        .group_by(ProjectTask.status)
    )
    
    task_distribution = {status: count for status, count in task_stats}
    
    # Member count
    member_count = await session.scalar(
        select(func.count(ProjectMember.id)).where(
            and_(
                ProjectMember.project_id == project_id,
                ProjectMember.deleted_at.is_(None)
            )
        )
    ) or 0
    
    # Completion percentage
    total_tasks = sum(task_distribution.values())
    completed_tasks = task_distribution.get("done", 0) + task_distribution.get("completed", 0)
    completion_percentage = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    
    return {
        "member_count": member_count,
        "task_distribution": task_distribution,
        "total_tasks": total_tasks,
        "completion_percentage": round(completion_percentage, 2)
    }

# ----------------- Project CRUD -----------------

@router.get("/", response_model=ProjectListResponse)
async def list_projects(
    request: Request,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=200, description="Items per page"),
    status: Optional[ProjectStatus] = Query(None, description="Filter by status"),
    priority: Optional[ProjectPriority] = Query(None, description="Filter by priority"),
    org_id: Optional[UUID] = Query(None, description="Filter by organization"),
    search: Optional[str] = Query(None, description="Search by name or description"),
    owned_by_me: bool = Query(False, description="Show only projects owned by current user"),
    member_of: bool = Query(False, description="Show only projects user is member of"),
    sort_by: str = Query("updated_at", description="Sort field"),
    sort_order: str = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """List projects with advanced filtering"""
    
    # Build base query
    query = select(Project).options(
        selectinload(Project.owner),
        selectinload(Project.organization)
    )
    
    filters = [Project.deleted_at.is_(None)]
    
    # Access control - user can see:
    # 1. Projects they own
    # 2. Projects they're members of
    # 3. Projects in organizations they belong to (if public)
    
    user_orgs = await session.scalars(
        select(Membership.org_id).where(
            and_(
                Membership.user_id == current_user.id,
                Membership.deleted_at.is_(None),
                Membership.status == MembershipStatus.ACTIVE
            )
        )
    )
    user_org_ids = list(user_orgs)
    
    access_filters = [
        Project.owner_id == current_user.id,  # Own projects
    ]
    
    # Projects in user's organizations
    if user_org_ids:
        access_filters.append(
            and_(
                Project.org_id.in_(user_org_ids),
                Project.is_public == True
            )
        )
    
    # Projects user is member of
    user_project_ids = await session.scalars(
        select(ProjectMember.project_id).where(
            and_(
                ProjectMember.user_id == current_user.id,
                ProjectMember.deleted_at.is_(None)
            )
        )
    )
    user_project_list = list(user_project_ids)
    if user_project_list:
        access_filters.append(Project.id.in_(user_project_list))
    
    filters.append(or_(*access_filters))
    
    # Apply additional filters
    if status:
        filters.append(Project.status == status)
    
    if priority:
        filters.append(Project.priority == priority)
    
    if org_id:
        if org_id not in user_org_ids:
            problem(403, "urn:problem:org-access-denied", "Access Denied", 
                    "You don't have access to this organization")
        filters.append(Project.org_id == org_id)
    
    if search and search.strip():
        search_term = f"%{search.strip()}%"
        filters.append(
            or_(
                Project.name.ilike(search_term),
                Project.description.ilike(search_term)
            )
        )
    
    if owned_by_me:
        filters.append(Project.owner_id == current_user.id)
    
    if member_of and user_project_list:
        filters.append(Project.id.in_(user_project_list))
    
    # Get total count
    total = await session.scalar(
        select(func.count(Project.id)).where(*filters)
    ) or 0
    
    # Apply sorting
    sort_field = getattr(Project, sort_by, Project.updated_at)
    if sort_order == "desc":
        query = query.order_by(sort_field.desc())
    else:
        query = query.order_by(sort_field.asc())
    
    # Get paginated results
    projects = await session.scalars(
        query.where(*filters)
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    
    items = list(projects)
    
    await AuditLogger.log_event(
        session, current_user.id, "projects.list", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "filters": {
                "status": status,
                "priority": priority,
                "org_id": str(org_id) if org_id else None,
                "search": search
            }
        }
    )
    
    return ProjectListResponse(
        items=items,
        page=page,
        page_size=page_size,
        total=total,
        has_next=page * page_size < total,
        has_prev=page > 1
    )

@router.post("/", response_model=ProjectDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreate,
    request: Request,
    background: BackgroundTasks,
    response: Response,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Create a new project"""
    
    # Validate organization membership if specified
    if data.org_id:
        membership = await session.scalar(
            select(Membership).where(
                and_(
                    Membership.org_id == data.org_id,
                    Membership.user_id == current_user.id,
                    Membership.deleted_at.is_(None),
                    Membership.status == MembershipStatus.ACTIVE
                )
            )
        )
        if not membership:
            problem(403, "urn:problem:org-not-member", "Not Organization Member", 
                    "You must be a member of the organization to create projects")
    
    # Validate project members
    member_users = []
    if data.member_ids:
        member_users = await _validate_project_members(session, data.org_id, data.member_ids)
    
    # Create project
    project = Project(
        id=uuid4(),
        name=data.name.strip(),
        description=data.description.strip() if data.description else None,
        owner_id=current_user.id,
        org_id=data.org_id,
        status=data.status or ProjectStatus.DRAFT,
        priority=data.priority or ProjectPriority.MEDIUM,
        start_date=data.start_date,
        end_date=data.end_date,
        budget=data.budget,
        is_public=data.is_public if data.is_public is not None else True,
        tags=data.tags or [],
        created_at=now_utc(),
        updated_at=now_utc()
    )
    
    session.add(project)
    
    try:
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        logger.error(f"Failed to create project: {e}")
        problem(409, "urn:problem:project-creation-failed", "Project Creation Failed", 
                "Failed to create project due to data constraint violation")
    
    await session.refresh(project)
    
    # Add project members
    if member_users:
        for user in member_users:
            member = ProjectMember(
                id=uuid4(),
                project_id=project.id,
                user_id=user.id,
                role="member",
                created_at=now_utc()
            )
            session.add(member)
        
        await session.commit()
        
        # Send notifications
        for user in member_users:
            background.add_task(
                send_project_notification,
                user.email,
                "added_to_project",
                project.name,
                current_user.username
            )
    
    # Set location header
    response.headers["Location"] = f"{settings.API_PREFIX}/projects/{project.id}"
    
    await AuditLogger.log_event(
        session, current_user.id, "project.create", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "project_id": str(project.id),
            "project_name": project.name,
            "org_id": str(data.org_id) if data.org_id else None,
            "member_count": len(member_users)
        }
    )
    
    # Load with relationships for response
    project_with_details = await session.scalar(
        select(Project)
        .options(
            selectinload(Project.owner),
            selectinload(Project.organization),
            selectinload(Project.members)
        )
        .where(Project.id == project.id)
    )
    
    return project_with_details

@router.get("/{project_id}", response_model=ProjectDetailResponse)
async def get_project(
    project_id: UUID,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Get project by ID with full details"""
    project = await _get_project_with_access(session, project_id, current_user, "read")
    
    await AuditLogger.log_event(
        session, current_user.id, "project.view", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"project_id": str(project_id)}
    )
    
    return project

@router.patch("/{project_id}", response_model=ProjectDetailResponse)
async def update_project(
    project_id: UUID,
    data: ProjectUpdate,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Update project"""
    project = await _get_project_with_access(session, project_id, current_user, "write")
    
    changes = {}
    payload = data.model_dump(exclude_unset=True)
    
    # Track changes
    for field, new_value in payload.items():
        old_value = getattr(project, field)
        if old_value != new_value:
            changes[field] = {"old": old_value, "new": new_value}
    
    # Apply changes
    for field, value in payload.items():
        if field in ["name", "description"] and value:
            value = value.strip()
        setattr(project, field, value)
    
    project.updated_at = now_utc()
    
    try:
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        logger.error(f"Failed to update project {project_id}: {e}")
        problem(409, "urn:problem:update-failed", "Update Failed", 
                "Failed to update project due to data constraint violation")
    
    await session.refresh(project)
    
    await AuditLogger.log_event(
        session, current_user.id, "project.update", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"project_id": str(project_id), "changes": changes}
    )
    
    return project

@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: UUID,
    request: Request,
    hard_delete: bool = Query(False, description="Permanently delete project"),
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Delete project (soft delete by default)"""
    project = await _get_project_with_access(session, project_id, current_user, "delete")
    
    if hard_delete:
        # Hard delete - remove all related data
        await session.execute(
            delete(ProjectMember).where(ProjectMember.project_id == project_id)
        )
        await session.execute(
            delete(ProjectTask).where(ProjectTask.project_id == project_id)
        )
        await session.delete(project)
        action = "project.hard_delete"
    else:
        # Soft delete
        project.deleted_at = now_utc()
        project.status = ProjectStatus.CANCELLED
        action = "project.soft_delete"
    
    await session.commit()
    
    await AuditLogger.log_event(
        session, current_user.id, action, True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "project_id": str(project_id),
            "project_name": project.name,
            "hard_delete": hard_delete
        }
    )

# ----------------- Project Members -----------------

@router.get("/{project_id}/members", response_model=List[ProjectMemberResponse])
async def get_project_members(
    project_id: UUID,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Get project members"""
    await _get_project_with_access(session, project_id, current_user, "read")
    
    members = await session.scalars(
        select(ProjectMember)
        .options(selectinload(ProjectMember.user))
        .where(
            and_(
                ProjectMember.project_id == project_id,
                ProjectMember.deleted_at.is_(None)
            )
        )
        .order_by(ProjectMember.created_at.asc())
    )
    
    return list(members)

@router.post("/{project_id}/members", response_model=Dict[str, Any])
async def add_project_members(
    project_id: UUID,
    data: ProjectMemberAdd,
    request: Request,
    background: BackgroundTasks,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Add members to project"""
    project = await _get_project_with_access(session, project_id, current_user, "write")
    
    # Validate users
    users = await _validate_project_members(session, project.org_id, data.user_ids)
    
    # Check for existing members
    existing_members = await session.scalars(
        select(ProjectMember.user_id).where(
            and_(
                ProjectMember.project_id == project_id,
                ProjectMember.user_id.in_(data.user_ids),
                ProjectMember.deleted_at.is_(None)
            )
        )
    )
    existing_user_ids = set(existing_members)
    
    results = {"added": [], "already_members": [], "errors": []}
    
    for user in users:
        if user.id in existing_user_ids:
            results["already_members"].append({
                "user_id": str(user.id),
                "username": user.username
            })
            continue
        
        try:
            member = ProjectMember(
                id=uuid4(),
                project_id=project_id,
                user_id=user.id,
                role=data.role or "member",
                created_at=now_utc()
            )
            session.add(member)
            
            results["added"].append({
                "user_id": str(user.id),
                "username": user.username,
                "role": member.role
            })
            
            # Send notification
            background.add_task(
                send_project_notification,
                user.email,
                "added_to_project",
                project.name,
                current_user.username
            )
            
        except Exception as e:
            results["errors"].append({
                "user_id": str(user.id),
                "error": str(e)
            })
    
    await session.commit()
    
    await AuditLogger.log_event(
        session, current_user.id, "project.members.add", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"project_id": str(project_id), "results": results}
    )
    
    return results

@router.delete("/{project_id}/members/{user_id}", status_code=204)
async def remove_project_member(
    project_id: UUID,
    user_id: UUID,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Remove member from project"""
    project = await _get_project_with_access(session, project_id, current_user, "write")
    
    # Cannot remove project owner
    if user_id == project.owner_id:
        problem(400, "urn:problem:cannot-remove-owner", "Cannot Remove Owner", 
                "Project owner cannot be removed from the project")
    
    member = await session.scalar(
        select(ProjectMember).where(
            and_(
                ProjectMember.project_id == project_id,
                ProjectMember.user_id == user_id,
                ProjectMember.deleted_at.is_(None)
            )
        )
    )
    
    if not member:
        problem(404, "urn:problem:member-not-found", "Member Not Found", 
                "User is not a member of this project")
    
    member.deleted_at = now_utc()
    await session.commit()
    
    await AuditLogger.log_event(
        session, current_user.id, "project.member.remove", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "project_id": str(project_id),
            "removed_user_id": str(user_id)
        }
    )

# ----------------- Project Statistics -----------------

@router.get("/{project_id}/stats", response_model=ProjectStatsResponse)
async def get_project_statistics(
    project_id: UUID,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Get detailed project statistics"""
    project = await _get_project_with_access(session, project_id, current_user, "read")
    
    stats = await _get_project_stats(session, project_id)
    
    # Calculate project duration
    duration_days = None
    if project.start_date and project.end_date:
        duration_days = (project.end_date - project.start_date).days
    
    result = ProjectStatsResponse(
        project_id=project_id,
        project_name=project.name,
        status=project.status,
        priority=project.priority,
        duration_days=duration_days,
        **stats
    )
    
    await AuditLogger.log_event(
        session, current_user.id, "project.stats", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"project_id": str(project_id)}
    )
    
    return result

@router.patch("/{project_id}/status", response_model=ProjectDetailResponse)
async def update_project_status(
    project_id: UUID,
    data: ProjectStatusUpdate,
    request: Request,
    background: BackgroundTasks,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Update project status with notifications"""
    project = await _get_project_with_access(session, project_id, current_user, "write")
    
    old_status = project.status
    new_status = data.status
    
    if old_status == new_status:
        return project
    
    project.status = new_status
    project.updated_at = now_utc()
    
    # Set completion date if project is completed
    if new_status == ProjectStatus.COMPLETED and not project.completed_at:
        project.completed_at = now_utc()
    
    await session.commit()
    await session.refresh(project)
    
    # Notify project members of status change
    members = await session.scalars(
        select(ProjectMember)
        .options(selectinload(ProjectMember.user))
        .where(
            and_(
                ProjectMember.project_id == project_id,
                ProjectMember.deleted_at.is_(None)
            )
        )
    )
    
    for member in members:
        if member.user_id != current_user.id:  # Don't notify the person making the change
            background.add_task(
                send_project_notification,
                member.user.email,
                "status_changed",
                project.name,
                current_user.username,
                {"old_status": old_status, "new_status": new_status}
            )
    
    await AuditLogger.log_event(
        session, current_user.id, "project.status.update", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "project_id": str(project_id),
            "old_status": old_status,
            "new_status": new_status,
            "reason": data.reason
        }
    )
    
    return project