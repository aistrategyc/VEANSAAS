from __future__ import annotations
import logging
import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, Query, HTTPException, status, Response, Request, BackgroundTasks
from sqlalchemy import select, func, update, and_, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from liderix_api.config.settings import settings
from liderix_api.db import get_async_session
from liderix_api.models import Membership, Department
from liderix_api.models.memberships import MembershipRole, MembershipStatus
from liderix_api.models.users import User
from liderix_api.schemas.membership import (
    MembershipCreate,
    MembershipUpdate,
    MembershipRead,
    MembershipListResponse,
    MembershipStatsResponse,
    MembershipBulkCreateRequest,
    MembershipBulkInviteRequest,
)
from liderix_api.services.guards import tenant_guard, TenantContext, require_perm
from liderix_api.services.audit import AuditLogger
router = APIRouter(prefix="/orgs/{org_id}/memberships", tags=["Memberships"])
# ----------------- helpers -----------------
logger = logging.getLogger(__name__)

# Role helpers (string values are stored in DB because native_enum=False)
ROLE_HIERARCHY = {"viewer": 1, "member": 2, "admin": 3, "owner": 4}
ROLE_TRANSITIONS = {
    # allowed target roles for a current role (business rules; adjust if needed)
    "viewer": ["member"],
    "member": ["viewer", "admin"],
    "admin": ["viewer", "member", "owner"],
    "owner": ["admin"],
}

# Lightweight invitation sender to avoid missing dependency errors
async def send_invitation_email(*, email: str, org_name: str, role: str, inviter_name: str) -> None:
    logger.info(
        "Sending membership invitation: email=%s org=%s role=%s inviter=%s",
        email, org_name, role, inviter_name
    )
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
    if not org or org.deleted_at is not None:
        problem(404, "urn:problem:org-not-found", "Organization Not Found", "Organization does not exist or has been deleted")
    return org
async def _validate_user_exists(session: AsyncSession, user_id: UUID) -> User:
    user = await session.get(User, user_id)
    if not user:
        problem(404, "urn:problem:user-not-found", "User Not Found", "User does not exist")
    if hasattr(user, "is_active") and not user.is_active:
        problem(400, "urn:problem:user-inactive", "User Inactive", "User account is not active")
    if hasattr(user, "is_verified") and not user.is_verified:
        problem(400, "urn:problem:user-unverified", "User Unverified", "User email is not verified")
    return user
async def _validate_department_exists(
    session: AsyncSession, org_id: UUID, dept_id: Optional[UUID]
) -> Optional[Department]:
    if not dept_id:
        return None
    dept = await session.scalar(
        select(Department).where(
            and_(
                Department.id == dept_id,
                Department.org_id == org_id,
                Department.deleted_at.is_(None),
            )
        )
    )
    if not dept:
        problem(400, "urn:problem:dept-not-found", "Department Not Found",
                "Department does not exist in this organization")
    return dept
async def _owner_count(session: AsyncSession, org_id: UUID) -> int:
    return await session.scalar(
        select(func.count(Membership.id)).where(
            and_(
                Membership.org_id == org_id,
                Membership.role == "owner",
                Membership.status == "active",
                Membership.deleted_at.is_(None),
            )
        )
    ) or 0
async def _get_membership(
    session: AsyncSession, org_id: UUID, membership_id: UUID
) -> Membership:
    m = await session.get(Membership, membership_id)
    if not m or m.org_id != org_id or m.deleted_at:
        problem(404, "urn:problem:membership-not-found", "Membership Not Found",
                "Membership not found in this organization")
    return m
def _can_modify_role(current_user_role: str, target_role: str, new_role: str) -> tuple[bool, str]:
    current_level = ROLE_HIERARCHY.get(current_user_role, 0)
    target_level = ROLE_HIERARCHY.get(target_role, 0)
    new_level = ROLE_HIERARCHY.get(new_role, 0)
    if target_level >= current_level:
        return False, "Cannot modify user with equal or higher role"
    if new_level >= current_level:
        return False, "Cannot assign role equal or higher than your own"
    valid_transitions = ROLE_TRANSITIONS.get(target_role, [])
    if new_role not in valid_transitions:
        return False, f"Cannot change role from {target_role} to {new_role}"
    return True, ""
async def _send_invitation_notification(
    background: BackgroundTasks, user_email: str, org_name: str, role: str, inviter_name: str
):
    background.add_task(
        send_invitation_email,
        email=user_email,
        org_name=org_name,
        role=role,
        inviter_name=inviter_name,
    )
# ----------------- list -----------------
@router.get("/", response_model=MembershipListResponse)
async def list_memberships(
    org_id: UUID,
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=200),
    q: Optional[str] = Query(None),
    dept_id: Optional[UUID] = Query(None),
    role: Optional[str] = Query(None),
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    require_perm(ctx, "member:read")
    await _validate_org_exists(session, org_id)
    filters = [Membership.org_id == org_id, Membership.deleted_at.is_(None)]

    base = select(Membership).options(
        selectinload(Membership.user),
        selectinload(Membership.department),
    )

    # join User only when searching on user fields
    if q and q.strip():
        term = f"%{q.strip()}%"
        base = base.join(User, User.id == Membership.user_id)
        filters.append(
            or_(
                User.username.ilike(term),
                User.email.ilike(term),
                func.concat(User.first_name, " ", User.last_name).ilike(term),
            )
        )

    if dept_id:
        filters.append(Membership.department_id == dept_id)
    if role:
        filters.append(Membership.role == role)

    total = await session.scalar(select(func.count(Membership.id)).select_from(Membership).where(*filters)) or 0

    stmt = base.where(*filters).order_by(Membership.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    items = (await session.execute(stmt)).scalars().all()
    await AuditLogger.log_event(session, ctx.user_id, "membership.list", True, request.client.host, request.headers.get("user-agent"), {"org_id": str(org_id)})
    return MembershipListResponse(items=items, page=page, page_size=page_size, total=total)
# ----------------- create -----------------
@router.post("/", response_model=MembershipRead, status_code=status.HTTP_201_CREATED)
async def create_membership(
    org_id: UUID,
    data: MembershipCreate,
    request: Request,
    background: BackgroundTasks,
    response: Response,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """Create a new membership with validation."""
    require_perm(ctx, "member:manage")
    org = await _validate_org_exists(session, org_id)
    user = await _validate_user_exists(session, data.user_id)
    await _validate_department_exists(session, org_id, data.department_id)
    target_role = data.role or "member"
    if target_role == "owner" and ctx.role != "owner":
        problem(403, "urn:problem:forbidden", "Forbidden", "Only organization owners can assign owner role")
    current_level = ROLE_HIERARCHY.get(ctx.role, 0)
    target_level = ROLE_HIERARCHY.get(target_role, 0)
    if target_level >= current_level:
        problem(403, "urn:problem:insufficient-permissions", "Insufficient Permissions",
                "Cannot assign role equal or higher than your own")
    # existing (включая soft-deleted)
    existing = await session.scalar(
        select(Membership).where(Membership.org_id == org_id, Membership.user_id == data.user_id)
    )
    if existing and existing.deleted_at is None:
        response.headers["Location"] = f"{settings.API_PREFIX.rstrip('/')}/orgs/{org_id}/memberships/{existing.id}"
        return existing
    if existing and existing.deleted_at is not None:
        existing.deleted_at = None
        existing.status = "active"
        existing.role = target_role
        existing.department_id = data.department_id
        existing.updated_at = now_utc()
        await session.commit()
        await session.refresh(existing)
        await AuditLogger.log_event(
            session, ctx.user_id, "membership.reactivate", True,
            request.client.host if request.client else "unknown",
            request.headers.get("user-agent", "unknown"),
            {"org_id": str(org_id), "membership_id": str(existing.id), "user_id": str(data.user_id), "role": target_role},
        )
        response.headers["Location"] = f"{settings.API_PREFIX.rstrip('/')}/orgs/{org_id}/memberships/{existing.id}"
        return existing
    membership = Membership(
        id=uuid4(),
        org_id=org_id,
        user_id=data.user_id,
        role=target_role,
        department_id=data.department_id,
        status="active",
        created_at=now_utc(),
        updated_at=now_utc(),
    )
    session.add(membership)
    try:
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        logger.error(f"Failed to create membership: {e}")
        problem(409, "urn:problem:integrity-error", "Data Integrity Error",
                "Failed to create membership due to data constraint violation")
    await session.refresh(membership)
    # имя пригласившего — по ctx.user_id
    inviter = await session.get(User, ctx.user_id)
    inviter_name = (f"{getattr(inviter, 'first_name', '')} {getattr(inviter, 'last_name', '')}").strip() if inviter else "System"
    await _send_invitation_notification(
        background, user.email, org.name, target_role, inviter_name or "System"
    )
    response.headers["Location"] = f"{settings.API_PREFIX.rstrip('/')}/orgs/{org_id}/memberships/{membership.id}"
    await AuditLogger.log_event(
        session, ctx.user_id, "membership.create", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"org_id": str(org_id), "membership_id": str(membership.id), "user_id": str(data.user_id),
         "role": target_role, "department_id": str(data.department_id) if data.department_id else None},
    )
    return membership
# ----------------- bulk create -----------------
@router.post("/bulk", response_model=dict[str, Any])
async def bulk_create_memberships(
    org_id: UUID,
    data: MembershipBulkCreateRequest,
    request: Request,
    background: BackgroundTasks,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """Create multiple memberships in bulk."""
    require_perm(ctx, "member:manage")
    await _validate_org_exists(session, org_id)
    if len(data.memberships) > 100:
        problem(400, "urn:problem:bulk-limit", "Bulk Limit Exceeded",
                "Cannot create more than 100 memberships at once")
    results: dict[str, Any] = {"created": [], "updated": [], "errors": [], "total": len(data.memberships)}
    for i, item in enumerate(data.memberships):
        try:
            await _validate_user_exists(session, item.user_id)
            target_role = item.role or "member"
            if target_role == "owner" and ctx.role != "owner":
                results["errors"].append({"index": i, "user_id": str(item.user_id), "error": "Only owners can assign owner role"})
                continue
            existing = await session.scalar(
                select(Membership).where(
                    and_(Membership.org_id == org_id, Membership.user_id == item.user_id, Membership.deleted_at.is_(None))
                )
            )
            if existing:
                results["updated"].append({"membership_id": str(existing.id), "user_id": str(item.user_id), "action": "already_exists"})
                continue
            m = Membership(
                id=uuid4(),
                org_id=org_id,
                user_id=item.user_id,
                role=target_role,
                department_id=item.department_id,
                status="active",
                created_at=now_utc(),
                updated_at=now_utc(),
            )
            session.add(m)
            results["created"].append({"membership_id": str(m.id), "user_id": str(item.user_id), "role": target_role})
        except HTTPException as he:
            results["errors"].append({"index": i, "user_id": str(item.user_id), "error": he.detail})
        except Exception as e:
            results["errors"].append({"index": i, "user_id": str(item.user_id), "error": str(e)})
    try:
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        logger.error(f"Bulk membership creation failed: {e}")
        problem(409, "urn:problem:bulk-integrity-error", "Bulk Operation Failed",
                "Failed to create memberships due to data constraint violations")
    await AuditLogger.log_event(
        session, ctx.user_id, "membership.bulk_create", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"org_id": str(org_id), "results": results},
    )
    return results


# ----------------- bulk invite by email -----------------
@router.post("/bulk-invite", response_model=dict[str, Any])
async def bulk_invite_by_email(
    org_id: UUID,
    data: MembershipBulkInviteRequest,
    request: Request,
    background: BackgroundTasks,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """Bulk invite users by email - creates invitations, not direct memberships."""
    require_perm(ctx, "member:manage")
    await _validate_org_exists(session, org_id)
    
    if len(data.memberships) > 100:
        problem(400, "urn:problem:bulk-limit", "Bulk Limit Exceeded",
                "Cannot create more than 100 invitations at once")
    
    results: dict[str, Any] = {"created": [], "errors": [], "total": len(data.memberships)}
    
    # Import here to avoid circular imports
    from liderix_api.models.invitations import Invitation
    from liderix_api.services.mailer import send_invitation_email
    from liderix_api.models.users import User
    
    for i, item in enumerate(data.memberships):
        try:
            # Check if user already exists
            existing_user = await session.scalar(
                select(User).where(User.email == item.email.lower())
            )
            
            if existing_user:
                # Check if already a member
                existing_membership = await session.scalar(
                    select(Membership).where(
                        and_(
                            Membership.org_id == org_id,
                            Membership.user_id == existing_user.id,
                            Membership.deleted_at.is_(None)
                        )
                    )
                )
                if existing_membership:
                    results["errors"].append({
                        "index": i, 
                        "email": item.email, 
                        "error": "User is already a member"
                    })
                    continue
            
            # Check for existing invitation
            existing_invitation = await session.scalar(
                select(Invitation).where(
                    and_(
                        Invitation.org_id == org_id,
                        Invitation.email == item.email.lower(),
                        Invitation.status == "pending"
                    )
                )
            )
            
            if existing_invitation:
                results["errors"].append({
                    "index": i,
                    "email": item.email,
                    "error": "Invitation already pending"
                })
                continue
            
            # Create invitation
            invitation = Invitation(
                id=uuid4(),
                org_id=org_id,
                email=item.email.lower(),
                role=item.role or "member",
                department_id=item.department_id,
                invited_by_id=ctx.user_id,
                token=secrets.token_urlsafe(32),
                expires_at=now_utc() + timedelta(days=7),
                status="pending",
                created_at=now_utc(),
                updated_at=now_utc(),
            )
            
            session.add(invitation)
            
            # Send invitation email in background
            background.add_task(
                send_invitation_email,
                item.email,
                invitation.token,
                org_id
            )
            
            results["created"].append({
                "invitation_id": str(invitation.id),
                "email": item.email,
                "role": item.role or "member"
            })
            
        except Exception as e:
            logger.error(f"Failed to create invitation for {item.email}: {e}")
            results["errors"].append({
                "index": i,
                "email": item.email,
                "error": str(e)
            })
    
    try:
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        logger.error(f"Bulk invitation creation failed: {e}")
        problem(409, "urn:problem:bulk-integrity-error", "Bulk Operation Failed",
                "Failed to create invitations due to data constraint violations")
    
    await AuditLogger.log_event(
        session, ctx.user_id, "invitation.bulk_create", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"org_id": str(org_id), "results": results},
    )
    
    return results


# ----------------- update -----------------
@router.patch("/{membership_id}", response_model=MembershipRead)
async def update_membership(
    org_id: UUID,
    membership_id: UUID,
    data: MembershipUpdate,
    request: Request,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """Update membership with role/status/department validation."""
    require_perm(ctx, "member:manage")
    membership = await _get_membership(session, org_id, membership_id)
    changes: dict[str, Any] = {}
    payload = data.model_dump(exclude_unset=True)
    if "role" in payload:
        old_role, new_role = membership.role, payload["role"]
        if old_role != new_role:
            ok, err = _can_modify_role(ctx.role, old_role, new_role)
            if not ok:
                problem(403, "urn:problem:role-change-forbidden", "Role Change Forbidden", err)
            if old_role == "owner" and new_role != "owner":
                if await _owner_count(session, org_id) <= 1:
                    problem(409, "urn:problem:last-owner", "Cannot Demote Last Owner",
                            "Cannot demote the last owner of the organization")
            changes["role"] = {"old": old_role, "new": new_role}
    if "department_id" in payload:
        old_dept_id, new_dept_id = membership.department_id, payload["department_id"]
        if old_dept_id != new_dept_id:
            await _validate_department_exists(session, org_id, new_dept_id)
            changes["department_id"] = {
                "old": str(old_dept_id) if old_dept_id else None,
                "new": str(new_dept_id) if new_dept_id else None,
            }
    if "status" in payload:
        old_status, new_status = membership.status, payload["status"]
        if old_status != new_status:
            valid_transitions = {
                "active": ["inactive", "pending"],
                "inactive": ["active"],
                "pending": ["active", "inactive"],
            }
            if new_status not in valid_transitions.get(old_status, []):
                problem(400, "urn:problem:invalid-status-transition", "Invalid Status Transition",
                        f"Cannot change status from {old_status} to {new_status}")
            changes["status"] = {"old": old_status, "new": new_status}
    for field, value in payload.items():
        if field not in {"title"}:  # ignore unknown/removed field
            setattr(membership, field, value)
    membership.updated_at = now_utc()
    try:
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        logger.error(f"Failed to update membership {membership_id}: {e}")
        problem(409, "urn:problem:integrity-error", "Data Integrity Error",
                "Failed to update membership due to data constraint violation")
    await session.refresh(membership)
    await AuditLogger.log_event(
        session, ctx.user_id, "membership.update", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"org_id": str(org_id), "membership_id": str(membership_id), "changes": changes},
    )
    return membership
# ----------------- delete (soft) -----------------
@router.delete("/{membership_id}", status_code=204)
async def delete_membership(
    org_id: UUID,
    membership_id: UUID,
    request: Request,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """Soft delete membership with owner protection."""
    require_perm(ctx, "member:manage")
    membership = await _get_membership(session, org_id, membership_id)
    if membership.role == "owner":
        if await _owner_count(session, org_id) <= 1:
            problem(409, "urn:problem:last-owner", "Cannot Remove Last Owner",
                    "Cannot remove the last owner of the organization")
    if membership.user_id == ctx.user_id:
        problem(400, "urn:problem:self-removal", "Cannot Remove Self",
                "Cannot remove your own membership. Transfer ownership first if you are the owner.")
    membership.deleted_at = now_utc()
    await session.commit()
    await AuditLogger.log_event(
        session, ctx.user_id, "membership.delete", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"org_id": str(org_id), "membership_id": str(membership_id),
         "deleted_user_id": str(membership.user_id), "deleted_role": membership.role},
    )
# ----------------- statistics -----------------
@router.get("/stats", response_model=MembershipStatsResponse)
async def get_membership_statistics(
    org_id: UUID,
    request: Request,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """Aggregated membership statistics for org."""
    require_perm(ctx, "org:read")
    await _validate_org_exists(session, org_id)
    role_rows = await session.execute(
        select(Membership.role, func.count(Membership.id))
        .where(
            and_(Membership.org_id == org_id, Membership.deleted_at.is_(None), Membership.status == "active")
        )
        .group_by(Membership.role)
    )
    role_distribution = {role: cnt for role, cnt in role_rows.all()}
    status_rows = await session.execute(
        select(Membership.status, func.count(Membership.id))
        .where(and_(Membership.org_id == org_id, Membership.deleted_at.is_(None)))
        .group_by(Membership.status)
    )
    status_distribution = {st: cnt for st, cnt in status_rows.all()}
    dept_rows = await session.execute(
        select(Department.name, func.count(Membership.id))
        .select_from(Membership)
        .join(Department, Membership.department_id == Department.id, isouter=True)
        .where(and_(Membership.org_id == org_id, Membership.deleted_at.is_(None), Membership.status == "active"))
        .group_by(Department.name)
    )
    department_distribution = {(name or "No Department"): cnt for name, cnt in dept_rows.all()}
    thirty_days_ago = now_utc() - timedelta(days=30)
    recent_joins = await session.scalar(
        select(func.count(Membership.id)).where(
            and_(
                Membership.org_id == org_id,
                Membership.created_at >= thirty_days_ago,
                Membership.deleted_at.is_(None),
            )
        )
    ) or 0
    total_active = sum(role_distribution.values())
    result = MembershipStatsResponse(
        total_members=total_active,
        role_distribution=role_distribution,
        status_distribution=status_distribution,
        department_distribution=department_distribution,
        recent_joins_30d=recent_joins,
    )
    await AuditLogger.log_event(
        session, ctx.user_id, "membership.stats", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"org_id": str(org_id)},
    )
    return result