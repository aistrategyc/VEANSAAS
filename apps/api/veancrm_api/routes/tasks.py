# apps/api/liderix_api/routes/tasks.py
from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from uuid import UUID, uuid4
import logging

from fastapi import (
    APIRouter, Depends, HTTPException, status, Response, Request,
    Query, BackgroundTasks
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func, and_, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from enum import Enum

from liderix_api.db import get_async_session
from liderix_api.models.tasks import Task, TaskComment
from liderix_api.models.projects import Project
from liderix_api.models.project_members import ProjectMember
from liderix_api.models.memberships import Membership, MembershipStatus
from liderix_api.models.users import User
from liderix_api.schemas.tasks import (
    TaskRead, TaskCreate, TaskUpdate, TaskListResponse,
    TaskDetailResponse, TaskCommentCreate, TaskStatusUpdate,
    TaskAssignmentUpdate, TaskStatsResponse, TaskCommentResponse
)
from liderix_api.services.auth import get_current_user
from liderix_api.services.audit import AuditLogger
from liderix_api.services.notifications import send_task_notification
from liderix_api.services.permissions import check_task_permission

router = APIRouter(prefix="/tasks", tags=["Tasks"])
logger = logging.getLogger(__name__)


class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    IN_REVIEW = "in_review"
    DONE = "done"
    CANCELLED = "cancelled"


class TaskPriority(str, Enum):
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


async def _get_task_with_access(
    session: AsyncSession,
    task_id: UUID,
    current_user: User,
    required_permission: str = "read"
) -> Task:
    """Get task with access validation"""
    task = await session.scalar(
        select(Task)
        .options(
            selectinload(Task.creator),
            selectinload(Task.assignee),
            selectinload(Task.project),
        )
        .where(Task.id == task_id)
    )

    if not task:
        problem(404, "urn:problem:task-not-found", "Task Not Found",
                "Task does not exist")

    if task.deleted_at is not None:
        problem(404, "urn:problem:task-deleted", "Task Deleted",
                "Task has been deleted")

    # Check access permissions
    if not await check_task_permission(session, task, current_user, required_permission):
        problem(403, "urn:problem:access-denied", "Access Denied",
                f"You don't have {required_permission} permission for this task")

    return task


async def _validate_task_assignee(session: AsyncSession, assignee_id: Optional[UUID], project_id: Optional[UUID]) -> Optional[User]:
    """Validate task assignee"""
    if not assignee_id:
        return None

    user = await session.get(User, assignee_id)
    if not user or user.deleted_at or not user.is_active:
        problem(400, "urn:problem:invalid-assignee", "Invalid Assignee",
                "Assigned user does not exist or is not active")

    # If task belongs to a project, validate that assignee is project member
    if project_id:
        member = await session.scalar(
            select(ProjectMember).where(
                and_(
                    ProjectMember.project_id == project_id,
                    ProjectMember.user_id == assignee_id,
                    ProjectMember.deleted_at.is_(None),
                )
            )
        )
        if not member:
            problem(400, "urn:problem:assignee-not-member", "Assignee Not Project Member",
                    "Assigned user must be a member of the project")

    return user


async def _get_task_stats(session: AsyncSession, filters: Dict[str, Any]) -> Dict[str, Any]:
    """Get task statistics with filters"""
    base_query = select(Task).where(Task.deleted_at.is_(None))

    # Apply filters
    if filters.get("user_id"):
        base_query = base_query.where(
            or_(
                Task.creator_id == filters["user_id"],
                Task.assignee_id == filters["user_id"],
            )
        )

    if filters.get("project_id"):
        base_query = base_query.where(Task.project_id == filters["project_id"])

    # Status distribution
    status_stats = await session.execute(
        select(Task.status, func.count(Task.id))
        .where(base_query.whereclause)
        .group_by(Task.status)
    )
    status_distribution = {status: count for status, count in status_stats}

    # Priority distribution
    priority_stats = await session.execute(
        select(Task.priority, func.count(Task.id))
        .where(base_query.whereclause)
        .group_by(Task.priority)
    )
    priority_distribution = {priority: count for priority, count in priority_stats}

    # Overdue tasks
    overdue_count = await session.scalar(
        select(func.count(Task.id)).where(
            and_(
                base_query.whereclause,
                Task.due_date < now_utc(),
                Task.status.notin_(["done", "cancelled"]),
            )
        )
    ) or 0

    # Total tasks
    total_tasks = sum(status_distribution.values())

    # Completion rate
    completed_tasks = status_distribution.get("done", 0)
    completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0

    return {
        "total_tasks": total_tasks,
        "status_distribution": status_distribution,
        "priority_distribution": priority_distribution,
        "overdue_count": overdue_count,
        "completion_rate": round(completion_rate, 2),
    }


# ----------------- Task CRUD -----------------

@router.get("/", response_model=TaskListResponse)
async def list_tasks(
    request: Request,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=200, description="Items per page"),
    status: Optional[TaskStatus] = Query(None, description="Filter by status"),
    priority: Optional[TaskPriority] = Query(None, description="Filter by priority"),
    project_id: Optional[UUID] = Query(None, description="Filter by project"),
    assignee_id: Optional[UUID] = Query(None, description="Filter by assignee"),
    creator_id: Optional[UUID] = Query(None, description="Filter by creator"),
    search: Optional[str] = Query(None, description="Search by title or description"),
    assigned_to_me: bool = Query(False, description="Show only tasks assigned to current user"),
    created_by_me: bool = Query(False, description="Show only tasks created by current user"),
    overdue: bool = Query(False, description="Show only overdue tasks"),
    due_today: bool = Query(False, description="Show tasks due today"),
    sort_by: str = Query("updated_at", description="Sort field"),
    sort_order: str = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    """List tasks with advanced filtering"""

    # Build base query with access control
    query = select(Task).options(
        selectinload(Task.creator),
        selectinload(Task.assignee),
        selectinload(Task.project),
    )

    filters = [Task.deleted_at.is_(None)]

    # Access control - user can see:
    # 1. Tasks they created
    # 2. Tasks assigned to them
    # 3. Tasks in projects they have access to

    # Get user's accessible project IDs (membership)
    user_project_ids = await session.scalars(
        select(ProjectMember.project_id).where(
            and_(
                ProjectMember.user_id == current_user.id,
                ProjectMember.deleted_at.is_(None),
            )
        )
    )
    accessible_project_ids = list(user_project_ids)

    # Also allow tasks from public projects in orgs where the user is a member
    user_orgs = await session.scalars(
        select(Membership.org_id).where(
            and_(
                Membership.user_id == current_user.id,
                Membership.deleted_at.is_(None),
                Membership.status == MembershipStatus.ACTIVE,
            )
        )
    )
    user_org_ids = list(user_orgs)
    public_proj_subq = None
    if user_org_ids:
        public_proj_subq = (
            select(Project.id)
            .where(
                and_(
                    Project.org_id.in_(user_org_ids),
                    Project.is_public == True,
                    Project.deleted_at.is_(None),
                )
            )
        )

    # Build access filter
    access_filters = [
        Task.creator_id == current_user.id,
        Task.assignee_id == current_user.id,
    ]
    if accessible_project_ids:
        access_filters.append(Task.project_id.in_(accessible_project_ids))
    if public_proj_subq is not None:
        access_filters.append(Task.project_id.in_(public_proj_subq))

    filters.append(or_(*access_filters))

    # Apply additional filters
    if status:
        filters.append(Task.status == status)

    if priority:
        filters.append(Task.priority == priority)

    if project_id:
        proj = await session.get(Project, project_id)
        if not proj or proj.deleted_at:
            problem(404, "urn:problem:project-not-found", "Project Not Found",
                    "Project does not exist")
        from liderix_api.services.permissions import check_project_permission
        if not await check_project_permission(session, proj, current_user, "read"):
            problem(403, "urn:problem:project-access-denied", "Access Denied",
                    "You don't have access to this project")
        filters.append(Task.project_id == project_id)

    if assignee_id:
        filters.append(Task.assignee_id == assignee_id)

    if creator_id:
        filters.append(Task.creator_id == creator_id)

    if assigned_to_me:
        filters.append(Task.assignee_id == current_user.id)

    if created_by_me:
        filters.append(Task.creator_id == current_user.id)

    if overdue:
        filters.append(
            and_(
                Task.due_date < now_utc(),
                Task.status.notin_(["done", "cancelled"]),
            )
        )

    if due_today:
        today_start = now_utc().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timedelta(days=1)
        filters.append(
            and_(
                Task.due_date >= today_start,
                Task.due_date < today_end,
            )
        )

    if search and search.strip():
        search_term = f"%{search.strip()}%"
        filters.append(
            or_(
                Task.title.ilike(search_term),
                Task.description.ilike(search_term),
            )
        )

    # Get total count
    total = await session.scalar(
        select(func.count(Task.id)).where(*filters)
    ) or 0

    # Apply sorting
    sort_field = getattr(Task, sort_by, Task.updated_at)
    if sort_order == "desc":
        query = query.order_by(sort_field.desc())
    else:
        query = query.order_by(sort_field.asc())

    # Get paginated results
    tasks = await session.scalars(
        query.where(*filters)
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    items = list(tasks)

    await AuditLogger.log_event(
        session, current_user.id, "tasks.list", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "filters": {
                "status": status,
                "priority": priority,
                "project_id": str(project_id) if project_id else None,
                "search": search,
            }
        }
    )

    return TaskListResponse(
        items=items,
        page=page,
        page_size=page_size,
        total=total,
        has_next=page * page_size < total,
        has_prev=page > 1,
    )


@router.post("/", response_model=TaskDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    data: TaskCreate,
    request: Request,
    background: BackgroundTasks,
    response: Response,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    """Create a new task"""

    # Validate project access if specified
    project = None
    if data.project_id:
        project = await session.get(Project, data.project_id)
        if not project or project.deleted_at:
            problem(404, "urn:problem:project-not-found", "Project Not Found",
                    "Project does not exist")

        # Check if user has access to the project
        from liderix_api.services.permissions import check_project_permission
        if not await check_project_permission(session, project, current_user, "write"):
            problem(403, "urn:problem:project-access-denied", "Access Denied",
                    "You don't have permission to create tasks in this project")

    # Validate assignee
    assignee = await _validate_task_assignee(session, data.assignee_id, data.project_id)

    # Create task
    task = Task(
        id=uuid4(),
        title=data.title.strip(),
        description=data.description.strip() if data.description else None,
        creator_id=current_user.id,
        assignee_id=data.assignee_id,
        project_id=data.project_id,
        status=data.status or TaskStatus.TODO,
        priority=data.priority or TaskPriority.MEDIUM,
        due_date=data.due_date,
        estimated_hours=data.estimated_hours,
        tags=data.tags or [],
        created_at=now_utc(),
        updated_at=now_utc(),
    )

    session.add(task)

    try:
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        logger.error(f"Failed to create task: {e}")
        problem(409, "urn:problem:task-creation-failed", "Task Creation Failed",
                "Failed to create task due to data constraint violation")

    await session.refresh(task)

    # Set location header
    response.headers["Location"] = f"/api/tasks/{task.id}"

    # Send notification to assignee
    if assignee and assignee.id != current_user.id:
        background.add_task(
            send_task_notification,
            assignee.email,
            "task_assigned",
            task.title,
            current_user.username,
        )

    await AuditLogger.log_event(
    session, current_user.id, "task.create", True,
    request.client.host if request.client else "unknown",
    request.headers.get("user-agent", "unknown"),
    {
        "task_id": str(task.id),
        "task_title": task.title,
        "project_id": str(data.project_id) if data.project_id else None,
        "assignee_id": str(data.assignee_id) if data.assignee_id else None,
    }
)

    # Load with relationships for response
    task_with_details = await session.scalar(
        select(Task)
        .options(
            selectinload(Task.creator),
            selectinload(Task.assignee),
            selectinload(Task.project),
        )
        .where(Task.id == task.id)
    )

    return task_with_details


@router.get("/{task_id}", response_model=TaskDetailResponse)
async def get_task(
    task_id: UUID,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    """Get task by ID with full details"""
    task = await _get_task_with_access(session, task_id, current_user, "read")

    await AuditLogger.log_event(
        session, current_user.id, "task.view", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"task_id": str(task_id)},
    )

    return task


@router.patch("/{task_id}", response_model=TaskDetailResponse)
async def update_task(
    task_id: UUID,
    data: TaskUpdate,
    request: Request,
    background: BackgroundTasks,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    """Update task"""
    task = await _get_task_with_access(session, task_id, current_user, "write")

    changes = {}
    payload = data.model_dump(exclude_unset=True)

    # Validate assignee if changed
    if "assignee_id" in payload:
        old_assignee_id = task.assignee_id
        new_assignee_id = payload["assignee_id"]

        if old_assignee_id != new_assignee_id:
            assignee = await _validate_task_assignee(session, new_assignee_id, task.project_id)
            changes["assignee_id"] = {
                "old": str(old_assignee_id) if old_assignee_id else None,
                "new": str(new_assignee_id) if new_assignee_id else None,
            }

            # Send notification to new assignee
            if assignee and assignee.id != current_user.id:
                background.add_task(
                    send_task_notification,
                    assignee.email,
                    "task_assigned",
                    task.title,
                    current_user.username,
                )

    # Track other changes
    for field, new_value in payload.items():
        if field != "assignee_id":
            old_value = getattr(task, field)
            if old_value != new_value:
                changes[field] = {"old": old_value, "new": new_value}

    # Apply changes
    for field, value in payload.items():
        if field in ["title", "description"] and value:
            value = value.strip()
        setattr(task, field, value)

    task.updated_at = now_utc()

    # Set completion date if task is marked as done
    if payload.get("status") == TaskStatus.DONE and task.status != TaskStatus.DONE:
        task.completed_at = now_utc()
    elif payload.get("status") != TaskStatus.DONE and task.status == TaskStatus.DONE:
        task.completed_at = None

    try:
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        logger.error(f"Failed to update task {task_id}: {e}")
        problem(409, "urn:problem:update-failed", "Update Failed",
                "Failed to update task due to data constraint violation")

    await session.refresh(task)

    await AuditLogger.log_event(
        session, current_user.id, "task.update", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"task_id": str(task_id), "changes": changes},
    )

    return task


@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: UUID,
    request: Request,
    hard_delete: bool = Query(False, description="Permanently delete task"),
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    """Delete task"""
    task = await _get_task_with_access(session, task_id, current_user, "delete")

    if hard_delete:
        # Hard delete - remove all related data
        await session.execute(
            update(TaskComment)
            .where(TaskComment.task_id == task_id)
            .values(deleted_at=now_utc())
        )
        await session.delete(task)
        action = "task.hard_delete"
    else:
        # Soft delete
        task.deleted_at = now_utc()
        task.status = TaskStatus.CANCELLED
        action = "task.soft_delete"

    await session.commit()

    await AuditLogger.log_event(
        session, current_user.id, action, True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "task_id": str(task_id),
            "task_title": task.title,
            "hard_delete": hard_delete,
        },
    )


# ----------------- Task Status Management -----------------

@router.patch("/{task_id}/status", response_model=TaskDetailResponse)
async def update_task_status(
    task_id: UUID,
    data: TaskStatusUpdate,
    request: Request,
    background: BackgroundTasks,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    """Update task status with workflow validation"""
    task = await _get_task_with_access(session, task_id, current_user, "write")

    old_status = task.status
    new_status = data.status

    if old_status == new_status:
        return task

    # Validate status transition (implement your business rules)
    valid_transitions = {
        TaskStatus.TODO: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
        TaskStatus.IN_PROGRESS: [TaskStatus.IN_REVIEW, TaskStatus.DONE, TaskStatus.TODO, TaskStatus.CANCELLED],
        TaskStatus.IN_REVIEW: [TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.TODO],
        TaskStatus.DONE: [TaskStatus.IN_PROGRESS],  # Allow reopening
        TaskStatus.CANCELLED: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
    }

    if new_status not in valid_transitions.get(old_status, []):
        problem(400, "urn:problem:invalid-transition", "Invalid Status Transition",
                f"Cannot change status from {old_status} to {new_status}")

    task.status = new_status
    task.updated_at = now_utc()

    # Set completion date
    if new_status == TaskStatus.DONE:
        task.completed_at = now_utc()
    elif old_status == TaskStatus.DONE:
        task.completed_at = None

    await session.commit()
    await session.refresh(task)

    # Notify assignee if different from current user
    if task.assignee_id and task.assignee_id != current_user.id:
        assignee = await session.get(User, task.assignee_id)
        if assignee:
            background.add_task(
                send_task_notification,
                assignee.email,
                "status_changed",
                task.title,
                current_user.username,
                {"old_status": old_status, "new_status": new_status},
            )

    await AuditLogger.log_event(
        session, current_user.id, "task.status.update", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "task_id": str(task_id),
            "old_status": old_status,
            "new_status": new_status,
            "comment": data.comment,
        },
    )

    return task


@router.patch("/{task_id}/assignment", response_model=TaskDetailResponse)
async def update_task_assignment(
    task_id: UUID,
    data: TaskAssignmentUpdate,
    request: Request,
    background: BackgroundTasks,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    """Update task assignment"""
    task = await _get_task_with_access(session, task_id, current_user, "write")

    old_assignee_id = task.assignee_id
    new_assignee_id = data.assignee_id

    if old_assignee_id == new_assignee_id:
        return task

    # Validate new assignee
    new_assignee = await _validate_task_assignee(session, new_assignee_id, task.project_id)

    task.assignee_id = new_assignee_id
    task.updated_at = now_utc()

    await session.commit()
    await session.refresh(task)

    # Send notifications
    if new_assignee and new_assignee.id != current_user.id:
        background.add_task(
            send_task_notification,
            new_assignee.email,
            "task_assigned",
            task.title,
            current_user.username,
        )

    # Notify old assignee if different
    if old_assignee_id and old_assignee_id != current_user.id and old_assignee_id != new_assignee_id:
        old_assignee = await session.get(User, old_assignee_id)
        if old_assignee:
            background.add_task(
                send_task_notification,
                old_assignee.email,
                "task_unassigned",
                task.title,
                current_user.username,
            )

    await AuditLogger.log_event(
        session, current_user.id, "task.assignment.update", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "task_id": str(task_id),
            "old_assignee_id": str(old_assignee_id) if old_assignee_id else None,
            "new_assignee_id": str(new_assignee_id) if new_assignee_id else None,
        },
    )

    return task


# ----------------- Task Comments -----------------

@router.get("/{task_id}/comments", response_model=List[TaskCommentResponse])
async def get_task_comments(
    task_id: UUID,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    """Get task comments"""
    await _get_task_with_access(session, task_id, current_user, "read")

    comments = await session.scalars(
        select(TaskComment)
        .options(selectinload(TaskComment.author))
        .where(
            and_(
                TaskComment.task_id == task_id,
                TaskComment.deleted_at.is_(None),
            )
        )
        .order_by(TaskComment.created_at.asc())
    )

    return list(comments)


@router.post("/{task_id}/comments", response_model=TaskCommentResponse)
async def add_task_comment(
    task_id: UUID,
    data: TaskCommentCreate,
    request: Request,
    background: BackgroundTasks,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    """Add comment to task"""
    task = await _get_task_with_access(session, task_id, current_user, "read")

    comment = TaskComment(
        id=uuid4(),
        task_id=task_id,
        author_id=current_user.id,
        content=data.content.strip(),
        created_at=now_utc(),
    )

    session.add(comment)
    await session.commit()
    await session.refresh(comment)

    # Notify task assignee and creator
    notify_users = set()
    if task.assignee_id and task.assignee_id != current_user.id:
        notify_users.add(task.assignee_id)
    if task.creator_id and task.creator_id != current_user.id:
        notify_users.add(task.creator_id)

    for user_id in notify_users:
        user = await session.get(User, user_id)
        if user:
            background.add_task(
                send_task_notification,
                user.email,
                "task_commented",
                task.title,
                current_user.username,
                {"comment": data.content[:100]},
            )

    await AuditLogger.log_event(
        session, current_user.id, "task.comment.add", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"task_id": str(task_id), "comment_id": str(comment.id)},
    )

    # Load with author for response
    comment_with_author = await session.scalar(
        select(TaskComment)
        .options(selectinload(TaskComment.author))
        .where(TaskComment.id == comment.id)
    )

    return comment_with_author


# ----------------- Task Statistics -----------------

@router.get("/stats", response_model=TaskStatsResponse)
async def get_task_statistics(
    request: Request,
    project_id: Optional[UUID] = Query(None, description="Filter by project"),
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user),
):
    """Get task statistics for current user"""

    filters = {"user_id": current_user.id}
    if project_id:
        filters["project_id"] = project_id

    stats = await _get_task_stats(session, filters)

    # Get upcoming tasks (due in next 7 days)
    upcoming_deadline = now_utc() + timedelta(days=7)
    upcoming_count = await session.scalar(
        select(func.count(Task.id)).where(
            and_(
                Task.deleted_at.is_(None),
                or_(
                    Task.creator_id == current_user.id,
                    Task.assignee_id == current_user.id,
                ),
                Task.due_date.between(now_utc(), upcoming_deadline),
                Task.status.notin_(["done", "cancelled"]),
            )
        )
    ) or 0

    stats["upcoming_count"] = upcoming_count

    result = TaskStatsResponse(
        user_id=current_user.id,
        project_id=project_id,
        **stats,
    )

    await AuditLogger.log_event(
        session, current_user.id, "tasks.stats", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"project_id": str(project_id) if project_id else None},
    )

    return result