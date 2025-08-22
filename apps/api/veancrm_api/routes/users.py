# apps/api/liderix_api/routes/users.py
from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from uuid import UUID
import logging

from fastapi import (
    APIRouter, Depends, HTTPException, status, Response, Request, 
    Query, BackgroundTasks, UploadFile, File
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func, and_, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from redis.asyncio import Redis

from liderix_api.db import get_async_session
from liderix_api.models.users import User
from liderix_api.models.memberships import Membership, MembershipStatus
from liderix_api.schemas.user import (
    UserRead, UserCreate, UserUpdate, UserListResponse,
    UserProfileUpdate, UserPasswordChange, UserStatsResponse,
    UserSearchResponse, UserPreferencesUpdate
)
from liderix_api.services.auth import get_current_user, hash_password, verify_password
from liderix_api.services.audit import AuditLogger
from liderix_api.services.permissions import require_permission
from liderix_api.services.file_upload import handle_avatar_upload
from liderix_api.config.settings import settings

router = APIRouter(prefix="/users", tags=["Users"])
logger = logging.getLogger(__name__)
redis = Redis.from_url(settings.REDIS_URL)

# Security constants
MAX_AVATAR_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_AVATAR_TYPES = {"image/jpeg", "image/png", "image/webp"}

# ----------------- helpers -----------------

def now_utc() -> datetime:
    return datetime.now(timezone.utc)

def problem(status_code: int, type_: str, title: str, detail: str):
    raise HTTPException(
        status_code=status_code,
        detail={"type": type_, "title": title, "detail": detail, "status": status_code},
    )

async def _get_user_with_validation(session: AsyncSession, user_id: UUID, current_user: User) -> User:
    """Get user with access validation"""
    user = await session.scalar(
        select(User)
        .options(selectinload(User.organizations))
        .where(User.id == user_id)
    )
    
    if not user:
        problem(404, "urn:problem:user-not-found", "User Not Found", 
                "User does not exist")
    
    if getattr(user, 'deleted_at', None) is not None:
        problem(404, "urn:problem:user-deleted", "User Deleted", 
                "User has been deleted")
    
    # Check if current user can access this user's data
    if user.id != current_user.id and not _can_access_user(current_user, user):
        problem(403, "urn:problem:access-denied", "Access Denied", 
                "You don't have permission to access this user's data")
    
    return user

def _can_access_user(current_user: User, target_user: User) -> bool:
    """Check if current user can access target user's data"""
    # Admin/super admin can access all users
    if hasattr(current_user, 'is_admin') and current_user.is_admin:
        return True
    
    # Check if users share organizations (simplified check)
    # In real implementation, you'd check specific permissions
    return False

async def _validate_username_unique(session: AsyncSession, username: str, exclude_user_id: Optional[UUID] = None) -> None:
    """Validate username uniqueness"""
    query = select(User).where(
        and_(
            func.lower(User.username) == username.lower(),
            User.deleted_at.is_(None)
        )
    )
    
    if exclude_user_id:
        query = query.where(User.id != exclude_user_id)
    
    existing = await session.scalar(query)
    if existing:
        problem(409, "urn:problem:username-taken", "Username Taken", 
                "This username is already taken")

async def _validate_email_unique(session: AsyncSession, email: str, exclude_user_id: Optional[UUID] = None) -> None:
    """Validate email uniqueness"""
    query = select(User).where(
        and_(
            func.lower(User.email) == email.lower(),
            User.deleted_at.is_(None)
        )
    )
    
    if exclude_user_id:
        query = query.where(User.id != exclude_user_id)
    
    existing = await session.scalar(query)
    if existing:
        problem(409, "urn:problem:email-taken", "Email Taken", 
                "This email is already registered")

async def _get_user_stats(session: AsyncSession, user_id: UUID) -> Dict[str, Any]:
    """Get user statistics"""
    # Count organizations
    org_count = await session.scalar(
        select(func.count(Membership.id)).where(
            and_(
                Membership.user_id == user_id,
                Membership.deleted_at.is_(None),
                Membership.status == MembershipStatus.ACTIVE
            )
        )
    ) or 0
    
    # Get roles distribution
    roles = await session.execute(
        select(Membership.role, func.count(Membership.id))
        .where(
            and_(
                Membership.user_id == user_id,
                Membership.deleted_at.is_(None),
                Membership.status == MembershipStatus.ACTIVE
            )
        )
        .group_by(Membership.role)
    )
    
    role_distribution = {role: count for role, count in roles}
    
    return {
        "organization_count": org_count,
        "role_distribution": role_distribution,
        "last_login": None,  # Will be filled from user data
        "account_age_days": None  # Will be calculated
    }

# ----------------- Current User Endpoints -----------------

@router.get("/me", response_model=UserRead)
async def get_current_user_profile(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """Get current user's profile"""
    await AuditLogger.log_event(
        None, current_user.id, "user.profile.view", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"user_id": str(current_user.id)}
    )
    
    return current_user

@router.patch("/me", response_model=UserRead)
async def update_current_user_profile(
    data: UserProfileUpdate,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Update current user's profile"""
    changes = {}
    payload = data.model_dump(exclude_unset=True)
    
    # Validate username if provided
    if "username" in payload:
        new_username = payload["username"].strip()
        if new_username != current_user.username:
            await _validate_username_unique(session, new_username, current_user.id)
            changes["username"] = {"old": current_user.username, "new": new_username}
    
    # Validate email if provided
    if "email" in payload:
        new_email = payload["email"].lower().strip()
        if new_email != current_user.email:
            await _validate_email_unique(session, new_email, current_user.id)
            changes["email"] = {"old": current_user.email, "new": new_email}
            # Mark email as unverified if changed
            payload["is_verified"] = False
            payload["verified_at"] = None
    
    # Apply changes
    for field, value in payload.items():
        if field in ["first_name", "last_name"] and value:
            value = value.strip()
        setattr(current_user, field, value)
    
    current_user.updated_at = now_utc()
    
    try:
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        logger.error(f"Failed to update user profile: {e}")
        problem(409, "urn:problem:update-failed", "Update Failed", 
                "Failed to update profile due to data constraint violation")
    
    await session.refresh(current_user)
    
    # Audit log
    await AuditLogger.log_event(
        session, current_user.id, "user.profile.update", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"user_id": str(current_user.id), "changes": changes}
    )
    
    return current_user

@router.post("/me/change-password")
async def change_user_password(
    data: UserPasswordChange,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Change current user's password"""
    # Verify current password
    if not verify_password(data.current_password, current_user.hashed_password):
        await AuditLogger.log_event(
            session, current_user.id, "user.password_change.failed", False,
            request.client.host if request.client else "unknown",
            request.headers.get("user-agent", "unknown"),
            {"user_id": str(current_user.id), "reason": "wrong_current_password"}
        )
        problem(400, "urn:problem:wrong-password", "Wrong Password", 
                "Current password is incorrect")
    
    # Validate new password
    if data.new_password == data.current_password:
        problem(400, "urn:problem:same-password", "Same Password", 
                "New password must be different from current password")
    
    # Update password
    current_user.hashed_password = hash_password(data.new_password)
    current_user.password_changed_at = now_utc()
    current_user.updated_at = now_utc()
    
    await session.commit()
    
    # Revoke all refresh tokens for security
    from liderix_api.routes.auth.utils import TokenWhitelist
    token_whitelist = TokenWhitelist(redis)
    await token_whitelist.remove_all_user_tokens(str(current_user.id))
    
    await AuditLogger.log_event(
        session, current_user.id, "user.password_change.success", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"user_id": str(current_user.id)}
    )
    
    return {"message": "Password changed successfully. Please log in again."}

@router.post("/me/upload-avatar")
async def upload_user_avatar(
    file: UploadFile = File(...),
    request: Request = None,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Upload user avatar"""
    # Validate file
    if file.content_type not in ALLOWED_AVATAR_TYPES:
        problem(400, "urn:problem:invalid-file-type", "Invalid File Type", 
                "Avatar must be JPEG, PNG, or WebP image")

    # Compute file size safely (UploadFile has no `.size`)
    try:
        file.file.seek(0, 2)  # move to end
        _size = file.file.tell()
        file.file.seek(0)     # reset to beginning for downstream consumers
    except Exception:
        _size = None

    if _size is not None and _size > MAX_AVATAR_SIZE:
        problem(400, "urn:problem:file-too-large", "File Too Large", 
                f"Avatar must be smaller than {MAX_AVATAR_SIZE // (1024*1024)}MB")
    
    try:
        # Handle file upload (implement this service)
        avatar_url = await handle_avatar_upload(file, current_user.id)
        
        # Update user avatar
        old_avatar = current_user.avatar_url
        current_user.avatar_url = avatar_url
        current_user.updated_at = now_utc()
        
        await session.commit()
        
        await AuditLogger.log_event(
            session, current_user.id, "user.avatar.upload", True,
            request.client.host if request.client else "unknown",
            request.headers.get("user-agent", "unknown"),
            {
                "user_id": str(current_user.id),
                "old_avatar": old_avatar,
                "new_avatar": avatar_url
            }
        )
        
        return {"message": "Avatar uploaded successfully", "avatar_url": avatar_url}
        
    except Exception as e:
        logger.error(f"Avatar upload failed for user {current_user.id}: {e}")
        problem(500, "urn:problem:upload-failed", "Upload Failed", 
                "Failed to upload avatar")

@router.patch("/me/preferences")
async def update_user_preferences(
    data: UserPreferencesUpdate,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Update user preferences"""
    payload = data.model_dump(exclude_unset=True)
    
    # Update preferences (assuming you have a preferences JSON field)
    if hasattr(current_user, 'preferences'):
        current_preferences = current_user.preferences or {}
        current_preferences.update(payload)
        current_user.preferences = current_preferences
    
    current_user.updated_at = now_utc()
    await session.commit()
    
    await AuditLogger.log_event(
        session, current_user.id, "user.preferences.update", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"user_id": str(current_user.id), "preferences": payload}
    )
    
    return {"message": "Preferences updated successfully"}

# ----------------- User Management Endpoints (Admin) -----------------

@router.get("/", response_model=UserListResponse)
async def list_users(
    request: Request,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=200, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by name, username, or email"),
    role_filter: Optional[str] = Query(None, description="Filter by role in any organization"),
    status_filter: Optional[str] = Query(None, description="Filter by account status"),
    sort_by: str = Query("created_at", description="Sort field"),
    sort_order: str = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """List users with advanced filtering (Admin only)"""
    # Check admin permission
    require_permission(current_user, "users:read")
    
    # Build base query
    query = select(User).where(User.deleted_at.is_(None))
    
    # Apply search filter
    if search and search.strip():
        search_term = f"%{search.strip()}%"
        query = query.where(
            or_(
                User.username.ilike(search_term),
                User.email.ilike(search_term),
                func.concat(User.first_name, ' ', User.last_name).ilike(search_term)
            )
        )
    
    # Apply status filter
    if status_filter:
        if status_filter == "active":
            query = query.where(User.is_active == True)
        elif status_filter == "inactive":
            query = query.where(User.is_active == False)
        elif status_filter == "verified":
            query = query.where(User.is_verified == True)
        elif status_filter == "unverified":
            query = query.where(User.is_verified == False)
    
    # Get total count
    total = await session.scalar(
        select(func.count()).select_from(query.subquery())
    ) or 0
    
    # Apply sorting
    sort_field = getattr(User, sort_by, User.created_at)
    if sort_order == "desc":
        query = query.order_by(sort_field.desc())
    else:
        query = query.order_by(sort_field.asc())
    
    # Apply pagination
    users = await session.scalars(
        query.offset((page - 1) * page_size).limit(page_size)
    )
    
    items = list(users)
    
    await AuditLogger.log_event(
        session, current_user.id, "users.list", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "filters": {
                "search": search,
                "role_filter": role_filter,
                "status_filter": status_filter
            }
        }
    )
    
    return UserListResponse(
        items=items,
        page=page,
        page_size=page_size,
        total=total,
        has_next=page * page_size < total,
        has_prev=page > 1
    )

@router.get("/search", response_model=List[UserSearchResponse])
async def search_users(
    q: str = Query(..., min_length=2, description="Search query"),
    limit: int = Query(10, ge=1, le=50, description="Maximum results"),
    request: Request = None,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Search users for mentions, assignments, etc."""
    search_term = f"%{q.strip()}%"
    
    users = await session.scalars(
        select(User)
        .where(
            and_(
                User.deleted_at.is_(None),
                User.is_active == True,
                or_(
                    User.username.ilike(search_term),
                    User.email.ilike(search_term),
                    func.concat(User.first_name, ' ', User.last_name).ilike(search_term)
                )
            )
        )
        .limit(limit)
    )
    
    results = [
        UserSearchResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            full_name=f"{user.first_name} {user.last_name}".strip() or user.username,
            avatar_url=user.avatar_url
        )
        for user in users
    ]
    
    await AuditLogger.log_event(
        session, current_user.id, "users.search", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"query": q, "results_count": len(results)}
    )
    
    return results


@router.get("/me/stats", response_model=UserStatsResponse)
async def get_my_statistics(
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Get statistics for the current authenticated user"""
    stats = await _get_user_stats(session, current_user.id)

    # Calculate account age
    if current_user.created_at:
        account_age = (now_utc() - current_user.created_at).days
        stats["account_age_days"] = account_age

    # Add last login
    if hasattr(current_user, 'last_login_at') and current_user.last_login_at:
        stats["last_login"] = current_user.last_login_at.isoformat()

    result = UserStatsResponse(
        user_id=current_user.id,
        username=current_user.username,
        **stats
    )

    await AuditLogger.log_event(
        session, current_user.id, "user.stats.self", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"target_user_id": str(current_user.id)}
    )

    return result

@router.get("/{user_id}", response_model=UserRead)
async def get_user(
    user_id: UUID,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Get user by ID"""
    user = await _get_user_with_validation(session, user_id, current_user)
    
    await AuditLogger.log_event(
        session, current_user.id, "user.view", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"viewed_user_id": str(user_id)}
    )
    
    return user

@router.get("/{user_id}/stats", response_model=UserStatsResponse)
async def get_user_statistics(
    user_id: UUID,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Get user statistics"""
    user = await _get_user_with_validation(session, user_id, current_user)
    
    stats = await _get_user_stats(session, user_id)
    
    # Calculate account age
    if user.created_at:
        account_age = (now_utc() - user.created_at).days
        stats["account_age_days"] = account_age
    
    # Add last login
    if hasattr(user, 'last_login_at') and user.last_login_at:
        stats["last_login"] = user.last_login_at.isoformat()
    
    result = UserStatsResponse(
        user_id=user_id,
        username=user.username,
        **stats
    )
    
    await AuditLogger.log_event(
        session, current_user.id, "user.stats", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {"target_user_id": str(user_id)}
    )
    
    return result


@router.patch("/{user_id}/admin-update", response_model=UserRead)
async def admin_update_user(
    user_id: UUID,
    data: UserUpdate,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Admin update user (Admin only)"""
    require_permission(current_user, "users:write")
    
    user = await session.get(User, user_id)
    if not user or user.deleted_at:
        problem(404, "urn:problem:user-not-found", "User Not Found", 
                "User does not exist")
    
    changes = {}
    payload = data.model_dump(exclude_unset=True)
    
    # Validate unique constraints
    if "username" in payload and payload["username"] != user.username:
        await _validate_username_unique(session, payload["username"], user_id)
        changes["username"] = {"old": user.username, "new": payload["username"]}
    
    if "email" in payload and payload["email"] != user.email:
        await _validate_email_unique(session, payload["email"], user_id)
        changes["email"] = {"old": user.email, "new": payload["email"]}
    
    # Apply changes
    for field, value in payload.items():
        if field in ["first_name", "last_name"] and value:
            value = value.strip()
        setattr(user, field, value)
    
    user.updated_at = now_utc()
    
    try:
        await session.commit()
    except IntegrityError as e:
        await session.rollback()
        logger.error(f"Admin update failed for user {user_id}: {e}")
        problem(409, "urn:problem:update-failed", "Update Failed", 
                "Failed to update user due to data constraint violation")
    
    await session.refresh(user)
    
    await AuditLogger.log_event(
        session, current_user.id, "user.admin_update", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "target_user_id": str(user_id),
            "admin_id": str(current_user.id),
            "changes": changes
        }
    )
    
    return user

@router.delete("/{user_id}")
async def delete_user(
    user_id: UUID,
    request: Request,
    hard_delete: bool = Query(False, description="Permanently delete user"),
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Delete user (Admin only)"""
    require_permission(current_user, "users:delete")
    
    if user_id == current_user.id:
        problem(400, "urn:problem:self-delete", "Cannot Delete Self", 
                "Cannot delete your own account")
    
    user = await session.get(User, user_id)
    if not user or user.deleted_at:
        problem(404, "urn:problem:user-not-found", "User Not Found", 
                "User does not exist")
    
    if hard_delete:
        # Permanently delete user
        await session.delete(user)
        action = "user.hard_delete"
    else:
        # Soft delete user
        user.deleted_at = now_utc()
        user.is_active = False
        action = "user.soft_delete"
    
    await session.commit()
    
    await AuditLogger.log_event(
        session, current_user.id, action, True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "deleted_user_id": str(user_id),
            "admin_id": str(current_user.id),
            "hard_delete": hard_delete
        }
    )
    
    return {"message": f"User {'permanently deleted' if hard_delete else 'deactivated'} successfully"}

# ----------------- Bulk Operations -----------------

@router.post("/bulk-actions")
async def bulk_user_actions(
    action: str = Query(..., regex="^(activate|deactivate|delete)$"),
    user_ids: List[UUID] = None,
    request: Request = None,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    """Bulk user actions (Admin only)"""
    require_permission(current_user, "users:write")
    
    if not user_ids or len(user_ids) > 100:
        problem(400, "urn:problem:invalid-bulk", "Invalid Bulk Operation", 
                "Must provide 1-100 user IDs")
    
    if current_user.id in user_ids:
        problem(400, "urn:problem:self-action", "Cannot Act on Self", 
                "Cannot perform bulk actions on your own account")
    
    results = {"success": [], "errors": []}
    
    for user_id in user_ids:
        try:
            user = await session.get(User, user_id)
            if not user or user.deleted_at:
                results["errors"].append({
                    "user_id": str(user_id),
                    "error": "User not found"
                })
                continue
            
            if action == "activate":
                user.is_active = True
            elif action == "deactivate":
                user.is_active = False
            elif action == "delete":
                user.deleted_at = now_utc()
                user.is_active = False
            
            user.updated_at = now_utc()
            results["success"].append(str(user_id))
            
        except Exception as e:
            results["errors"].append({
                "user_id": str(user_id),
                "error": str(e)
            })
    
    await session.commit()
    
    await AuditLogger.log_event(
        session, current_user.id, f"users.bulk_{action}", True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "action": action,
            "results": results,
            "admin_id": str(current_user.id)
        }
    )
    
    return results