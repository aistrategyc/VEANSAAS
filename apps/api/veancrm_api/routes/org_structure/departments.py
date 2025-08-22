from __future__ import annotations
import logging
from datetime import datetime, timezone
from typing import Optional, List
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, Query, HTTPException, status, Response, Request
from sqlalchemy import select, func, update, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from liderix_api.config.settings import settings
from liderix_api.db import get_async_session
from liderix_api.models import Department, Membership, Organization  # Изменено: Импорт из models (через __init__.py)
from liderix_api.models.memberships import MembershipStatus, MembershipRole
from liderix_api.models.users import User
from liderix_api.schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
    DepartmentRead,
    DepartmentListResponse,
    DepartmentTreeResponse,
    DepartmentStatsResponse,
)
from liderix_api.services.guards import tenant_guard, TenantContext, require_perm
from liderix_api.services.audit import AuditLogger
router = APIRouter(prefix="/orgs/{org_id}/departments", tags=["Departments"])
logger = logging.getLogger(__name__)
# ----------------- helpers -----------------
def now_utc() -> datetime:
    return datetime.now(timezone.utc)
def problem(status_code: int, type_: str, title: str, detail: str):
    raise HTTPException(
        status_code=status_code,
        detail={"type": type_, "title": title, "detail": detail, "status": status_code},
    )
async def _validate_org_exists(session: AsyncSession, org_id: UUID) -> Organization:
    org = await session.get(Organization, org_id)
    if not org or getattr(org, "deleted_at", None) is not None:
        problem(404, "urn:problem:org-not-found", "Organization Not Found", "Organization does not exist or has been deleted")
    if hasattr(org, "is_active") and not org.is_active:
        problem(403, "urn:problem:org-inactive", "Organization Inactive", "Organization is not active")
    return org
async def _ensure_manager_in_org(session: AsyncSession, org_id: UUID, manager_user_id: Optional[UUID]) -> Optional[User]:
    if not manager_user_id:
        return None
    user = await session.get(User, manager_user_id)
    if not user:
        problem(400, "urn:problem:user-not-found", "User Not Found", "Manager user does not exist")
    if hasattr(user, "is_active") and not user.is_active:
        problem(400, "urn:problem:user-inactive", "User Inactive", "Manager user is not active")
    membership = await session.scalar(
        select(Membership).where(
            and_(
                Membership.org_id == org_id,
                Membership.user_id == manager_user_id,
                Membership.deleted_at.is_(None),
                Membership.status == MembershipStatus.ACTIVE,
            )
        )
    )
    if not membership:
        problem(400, "urn:problem:invalid-manager", "Invalid Manager", "Manager must be an active member of this organization")
    return user
async def _load_department(session: AsyncSession, org_id: UUID, dept_id: UUID) -> Department:
    dept = await session.get(Department, dept_id)
    if not dept or dept.org_id != org_id or dept.deleted_at is not None:
        problem(404, "urn:problem:dept-not-found", "Department Not Found", "Department not found in this organization")
    return dept
async def _ensure_parent(session: AsyncSession, org_id: UUID, parent_id: Optional[UUID]) -> Optional[Department]:
    if not parent_id:
        return None
    parent = await session.get(Department, parent_id)
    if not parent or parent.org_id != org_id or parent.deleted_at is not None:
        problem(400, "urn:problem:invalid-parent", "Invalid Parent Department", "Parent department does not exist in this organization")
    return parent
async def _detect_hierarchy_cycle(session: AsyncSession, org_id: UUID, dept_id: UUID, new_parent_id: Optional[UUID]) -> None:
    if not new_parent_id:
        return
    visited: set[UUID] = set()
    current_id = new_parent_id
    max_depth = 100
    depth = 0
    while current_id and depth < max_depth:
        if current_id in visited:
            # цикл в существующей иерархии
            break
        visited.add(current_id)
        if current_id == dept_id:
            problem(409, "urn:problem:hierarchy-cycle", "Hierarchy Conflict", "Cannot create circular dependency in department hierarchy")
        parent_id = await session.scalar(
            select(Department.parent_id).where(
                and_(
                    Department.id == current_id,
                    Department.org_id == org_id,
                    Department.deleted_at.is_(None),
                )
            )
        )
        current_id = parent_id
        depth += 1
    if depth >= max_depth:
        problem(409, "urn:problem:hierarchy-too-deep", "Hierarchy Too Deep", "Department hierarchy exceeds maximum allowed depth")
async def _get_department_stats(session: AsyncSession, org_id: UUID, dept_id: UUID) -> dict:
    member_count = await session.scalar(
        select(func.count(Membership.id)).where(
            and_(
                Membership.org_id == org_id,
                Membership.department_id == dept_id,
                Membership.deleted_at.is_(None),
                Membership.status == MembershipStatus.ACTIVE,
            )
        )
    ) or 0
    child_count = await session.scalar(
        select(func.count(Department.id)).where(
            and_(
                Department.org_id == org_id,
                Department.parent_id == dept_id,
                Department.deleted_at.is_(None),
            )
        )
    ) or 0
    return {"member_count": member_count, "child_department_count": child_count}
# ----------------- list -----------------
@router.get("/", response_model=DepartmentListResponse)
async def list_departments(
    org_id: UUID,
    request: Request,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=200, description="Items per page"),
    q: Optional[str] = Query(None, description="Search departments by name"),
    parent_id: Optional[UUID] = Query(None, description="Filter by parent department"),
    manager_id: Optional[UUID] = Query(None, description="Filter by manager"),
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """List departments in organization with filtering and pagination."""
    require_perm(ctx, "org:read")
    await _validate_org_exists(session, org_id)
    filters = [Department.org_id == org_id, Department.deleted_at.is_(None)]
    if q and q.strip():
        filters.append(Department.name.ilike(f"%{q.strip()}%"))
    if parent_id is not None:
        filters.append(Department.parent_id == parent_id)
    if manager_id is not None:
        filters.append(Department.manager_id == manager_id)
    total = await session.scalar(select(func.count(Department.id)).where(*filters)) or 0
    stmt = (
        select(Department)
        .where(*filters)
        .order_by(Department.name.asc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    items = (await session.execute(stmt)).scalars().all()
    await AuditLogger.log_event(
        session,
        ctx.user_id,
        "dept.list",
        True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"org_id": str(org_id), "filters": {"q": q, "parent_id": str(parent_id) if parent_id else None}},
    )
    return DepartmentListResponse(items=items, page=page, page_size=page_size, total=total)
# ----------------- tree view -----------------
@router.get("/tree", response_model=List[DepartmentTreeResponse])
async def get_department_tree(
    org_id: UUID,
    request: Request,
    root_id: Optional[UUID] = Query(None, description="Root department ID (null for top-level)"),
    max_depth: int = Query(10, ge=1, le=20, description="Maximum tree depth"),
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """Get department hierarchy as a tree structure."""
    require_perm(ctx, "org:read")
    await _validate_org_exists(session, org_id)
    async def build_tree(parent_id: Optional[UUID], current_depth: int = 0) -> List[DepartmentTreeResponse]:
        if current_depth >= max_depth:
            return []
        rows = await session.execute(
            select(Department).where(
                and_(
                    Department.org_id == org_id,
                    Department.parent_id == parent_id,
                    Department.deleted_at.is_(None),
                )
            ).order_by(Department.name.asc())
        )
        tree: List[DepartmentTreeResponse] = []
        for dept in rows.scalars():
            stats = await _get_department_stats(session, org_id, dept.id)
            children = await build_tree(dept.id, current_depth + 1)
            tree.append(
                DepartmentTreeResponse(
                    id=dept.id,
                    name=dept.name,
                    description=dept.description,
                    manager_id=dept.manager_id,
                    member_count=stats["member_count"],
                    child_department_count=stats["child_department_count"],
                    children=children,
                    depth=current_depth,
                )
            )
        return tree
    tree = await build_tree(root_id)
    await AuditLogger.log_event(
        session,
        ctx.user_id,
        "dept.tree",
        True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"org_id": str(org_id), "root_id": str(root_id) if root_id else None},
    )
    return tree
# ----------------- create -----------------
@router.post("/", response_model=DepartmentRead, status_code=status.HTTP_201_CREATED)
async def create_department(
    org_id: UUID,
    data: DepartmentCreate,
    request: Request,
    response: Response,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """Create a new department in the organization."""
    require_perm(ctx, "dept:write")
    await _validate_org_exists(session, org_id)
    name = data.name.strip()
    if not name:
        problem(400, "urn:problem:invalid-name", "Invalid Name", "Department name cannot be empty")
    if len(name) > 200:
        problem(400, "urn:problem:name-too-long", "Name Too Long", "Department name cannot exceed 200 characters")
    await _ensure_manager_in_org(session, org_id, data.manager_id)
    parent = await _ensure_parent(session, org_id, data.parent_id)
    existing = await session.scalar(
        select(Department).where(
            and_(
                Department.org_id == org_id,
                func.lower(Department.name) == name.lower(),
                Department.deleted_at.is_(None),
            )
        )
    )
    if existing:
        problem(409, "urn:problem:duplicate-name", "Duplicate Name", "A department with this name already exists in the organization")
    dept = Department(
        id=uuid4(),
        org_id=org_id,
        name=name,
        description=(data.description or "").strip() or None,
        parent_id=parent.id if parent else None,
        manager_id=data.manager_id,
        created_at=now_utc(),
        updated_at=now_utc(),
    )
    session.add(dept)
    try:
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        logger.error(f"Failed to create department: {e}")
        problem(409, "urn:problem:integrity-error", "Data Integrity Error", "Failed to create department due to data constraint violation")
    await session.refresh(dept)
    response.headers["Location"] = f"{settings.API_PREFIX.rstrip('/')}/orgs/{org_id}/departments/{dept.id}"
    await AuditLogger.log_event(
        session,
        ctx.user_id,
        "dept.create",
        True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "org_id": str(org_id),
            "dept_id": str(dept.id),
            "name": dept.name,
            "manager_id": str(data.manager_id) if data.manager_id else None,
            "parent_id": str(data.parent_id) if data.parent_id else None,
        },
    )
    return dept
# ----------------- read -----------------
@router.get("/{dept_id}", response_model=DepartmentRead)
async def get_department(
    org_id: UUID,
    dept_id: UUID,
    request: Request,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """Get a specific department by ID."""
    require_perm(ctx, "org:read")
    dept = await _load_department(session, org_id, dept_id)
    await AuditLogger.log_event(
        session,
        ctx.user_id,
        "dept.read",
        True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"org_id": str(org_id), "dept_id": str(dept_id)},
    )
    return dept
# ----------------- update -----------------
@router.patch("/{dept_id}", response_model=DepartmentRead)
async def update_department(
    org_id: UUID,
    dept_id: UUID,
    data: DepartmentUpdate,
    request: Request,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """Update an existing department."""
    require_perm(ctx, "dept:write")
    dept = await _load_department(session, org_id, dept_id)
    changes: dict = {}
    payload = data.model_dump(exclude_unset=True)
    if "name" in payload:
        name = payload["name"].strip()
        if not name:
            problem(400, "urn:problem:invalid-name", "Invalid Name", "Department name cannot be empty")
        if len(name) > 200:
            problem(400, "urn:problem:name-too-long", "Name Too Long", "Department name cannot exceed 200 characters")
        if name.lower() != dept.name.lower():
            existing = await session.scalar(
                select(Department).where(
                    and_(
                        Department.org_id == org_id,
                        func.lower(Department.name) == name.lower(),
                        Department.deleted_at.is_(None),
                        Department.id != dept_id,
                    )
                )
            )
            if existing:
                problem(409, "urn:problem:duplicate-name", "Duplicate Name", "A department with this name already exists in the organization")
        changes["name"] = {"old": dept.name, "new": name}
        payload["name"] = name
    if "manager_id" in payload:
        old_manager_id = dept.manager_id
        new_manager_id = payload["manager_id"]
        if new_manager_id != old_manager_id:
            await _ensure_manager_in_org(session, org_id, new_manager_id)
        changes["manager_id"] = {
            "old": str(old_manager_id) if old_manager_id else None,
            "new": str(new_manager_id) if new_manager_id else None,
        }
    if "parent_id" in payload:
        new_parent_id = payload["parent_id"]
        old_parent_id = dept.parent_id
        if new_parent_id != old_parent_id:
            if new_parent_id == dept.id:
                problem(400, "urn:problem:self-parent", "Invalid Parent", "Department cannot be its own parent")
            parent = await _ensure_parent(session, org_id, new_parent_id)
            await _detect_hierarchy_cycle(session, org_id, dept.id, new_parent_id)
        changes["parent_id"] = {
            "old": str(old_parent_id) if old_parent_id else None,
            "new": str(new_parent_id) if new_parent_id else None,
        }
        payload["parent_id"] = parent.id if parent else None
    for field, value in payload.items():
        if field == "description" and isinstance(value, str):
            value = value.strip() or None
        setattr(dept, field, value)
    dept.updated_at = now_utc()
    try:
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        logger.error(f"Failed to update department {dept_id}: {e}")
        problem(409, "urn:problem:integrity-error", "Data Integrity Error", "Failed to update department due to data constraint violation")
    await session.refresh(dept)
    await AuditLogger.log_event(
        session,
        ctx.user_id,
        "dept.update",
        True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"org_id": str(org_id), "dept_id": str(dept_id), "changes": changes},
    )
    return dept
# ----------------- delete (soft) -----------------
@router.delete("/{dept_id}", status_code=204)
async def delete_department(
    org_id: UUID,
    dept_id: UUID,
    request: Request,
    force: bool = Query(False, description="Force delete even if department has children"),
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """Soft delete a department and handle child departments."""
    require_perm(ctx, "dept:write")
    dept = await _load_department(session, org_id, dept_id)
    child_count = await session.scalar(
        select(func.count(Department.id)).where(
            and_(
                Department.org_id == org_id,
                Department.parent_id == dept_id,
                Department.deleted_at.is_(None),
            )
        )
    ) or 0
    if child_count > 0 and not force:
        problem(
            409,
            "urn:problem:has-children",
            "Department Has Children",
            f"Cannot delete department with {child_count} child departments. Use force=true to move children to parent.",
        )
    member_count = await session.scalar(
        select(func.count(Membership.id)).where(
            and_(
                Membership.org_id == org_id,
                Membership.department_id == dept_id,
                Membership.deleted_at.is_(None),
            )
        )
    ) or 0
    dept.deleted_at = now_utc()
    if child_count > 0:
        await session.execute(
            update(Department)
            .where(
                and_(
                    Department.org_id == org_id,
                    Department.parent_id == dept_id,
                    Department.deleted_at.is_(None),
                )
            )
            .values(parent_id=dept.parent_id, updated_at=now_utc())
        )
    if member_count > 0:
        await session.execute(
            update(Membership)
            .where(
                and_(
                    Membership.org_id == org_id,
                    Membership.department_id == dept_id,
                    Membership.deleted_at.is_(None),
                )
            )
            .values(department_id=None)
        )
    await session.commit()
    await AuditLogger.log_event(
        session,
        ctx.user_id,
        "dept.delete",
        True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "org_id": str(org_id),
            "dept_id": str(dept_id),
            "name": dept.name,
            "child_count": child_count,
            "member_count": member_count,
            "force": force,
        },
    )
# ----------------- stats -----------------
@router.get("/{dept_id}/stats", response_model=DepartmentStatsResponse)
async def get_department_statistics(
    org_id: UUID,
    dept_id: UUID,
    request: Request,
    include_children: bool = Query(True, description="Include statistics for child departments"),
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """Get detailed statistics for a department."""
    require_perm(ctx, "org:read")
    dept = await _load_department(session, org_id, dept_id)
    stats = await _get_department_stats(session, org_id, dept_id)
    rows = await session.execute(
        select(Membership.role, func.count(Membership.id))
        .where(
            and_(
                Membership.org_id == org_id,
                Membership.department_id == dept_id,
                Membership.deleted_at.is_(None),
                Membership.status == MembershipStatus.ACTIVE,
            )
        )
        .group_by(Membership.role)
    )
    roles = { (role.value if isinstance(role, MembershipRole) else str(role)): cnt for role, cnt in rows.all() }
    result = DepartmentStatsResponse(
        department_id=dept_id,
        department_name=dept.name,
        member_count=stats["member_count"],
        child_department_count=stats["child_department_count"],
        role_distribution=roles,
    )
    if include_children and stats["child_department_count"] > 0:
        child_rows = await session.execute(
            select(Department).where(
                and_(
                    Department.org_id == org_id,
                    Department.parent_id == dept_id,
                    Department.deleted_at.is_(None),
                )
            )
        )
        child_stats = []
        for child in child_rows.scalars():
            c = await _get_department_stats(session, org_id, child.id)
            child_stats.append(
                {
                    "department_id": child.id,
                    "department_name": child.name,
                    "member_count": c["member_count"],
                    "child_department_count": c["child_department_count"],
                }
            )
        result.child_departments = child_stats
    await AuditLogger.log_event(
        session,
        ctx.user_id,
        "dept.stats",
        True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"org_id": str(org_id), "dept_id": str(dept_id)},
    )
    return result