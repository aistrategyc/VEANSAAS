"""
Production-ready permission checking service with role-based access control.
Supports organization-level and project-level permissions.
"""
from __future__ import annotations

import logging
from typing import List, Dict, Any, Optional
from enum import Enum
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_

from liderix_api.models.users import User, UserRole
from liderix_api.models.memberships import Membership, MembershipRole
from liderix_api.models.projects import Project, ProjectMemberRole
from liderix_api.models.project_members import ProjectMember

logger = logging.getLogger(__name__)


class Permission(str, Enum):
    # User permissions
    USERS_READ = "users:read"
    USERS_WRITE = "users:write"
    USERS_DELETE = "users:delete"
    
    # Organization permissions
    ORG_READ = "org:read"
    ORG_WRITE = "org:write"
    ORG_DELETE = "org:delete"
    ORG_ADMIN = "org:admin"
    
    # Project permissions
    PROJECT_READ = "project:read"
    PROJECT_WRITE = "project:write"
    PROJECT_DELETE = "project:delete"
    PROJECT_ADMIN = "project:admin"
    
    # Task permissions
    TASK_READ = "task:read"
    TASK_WRITE = "task:write"
    TASK_DELETE = "task:delete"
    
    # System permissions
    SYSTEM_ADMIN = "system:admin"


async def check_task_permission(
    session: AsyncSession,
    task,  # Task model instance
    user: User,
    permission: str
) -> bool:
    """
    Check if user has permission to perform action on task
    
    Args:
        session: Database session
        task: Task instance
        user: User instance
        permission: Permission type (read, write, delete)
    
    Returns:
        bool: True if user has permission
    """
    try:
        if not task or not user or not user.is_active:
            return False
        
        # System admins have all permissions
        if getattr(user, 'is_admin', False):
            return True
        
        # Task creator has all permissions
        if hasattr(task, 'creator_id') and task.creator_id == user.id:
            return True
        
        # Task assignee has read/write permissions (but not delete)
        if hasattr(task, 'assignee_id') and task.assignee_id == user.id:
            return permission in ["read", "write"]
        
        # If task belongs to a project, check project permissions
        if hasattr(task, 'project_id') and task.project_id:
            # Get the project
            if hasattr(task, 'project') and task.project:
                project = task.project
            else:
                # Load project if not already loaded
                project = await session.get(Project, task.project_id)
            
            if project:
                return await check_project_permission(session, project, user, permission)
        
        # If task belongs to an organization (but no project), check org permissions
        if hasattr(task, 'org_id') and task.org_id:
            return await check_organization_permission(session, task.org_id, user, permission)
        
        # For tasks without project/org, only creator and assignee have access
        return False
        
    except Exception as e:
        logger.error(f"Error checking task permission: {e}")
        return False


async def check_project_permission(
    session: AsyncSession,
    project: Project,
    user: User,
    permission: str
) -> bool:
    """Check if user has permission for specific project"""
    try:
        if not user.is_active:
            return False
        
        # System admins have all permissions
        if getattr(user, 'is_admin', False):
            return True
        
        # Project owner always has full access
        if hasattr(project, 'owner_id') and project.owner_id == user.id:
            return True
        
        # Check project-specific membership
        project_member = await session.scalar(
            select(ProjectMember).where(
                and_(
                    ProjectMember.project_id == project.id,
                    ProjectMember.user_id == user.id,
                    ProjectMember.deleted_at.is_(None)
                )
            )
        )
        
        if not project_member:
            # Check if project is public and permission is read
            if hasattr(project, 'is_public') and project.is_public and permission == "read":
                return True
            return False
        
        # Role-based permission check
        role_permissions = {
            "owner": ["read", "write", "delete", "admin"],
            "admin": ["read", "write", "admin"],
            "member": ["read", "write"],
            "viewer": ["read"]
        }
        
        user_role = getattr(project_member, 'role', 'member')
        allowed_permissions = role_permissions.get(user_role, [])
        return permission in allowed_permissions
        
    except Exception as e:
        logger.error(f"Error checking project permission: {e}")
        return False


async def check_organization_permission(
    session: AsyncSession,
    organization_id,  # Organization ID or instance
    user: User,
    permission: str
) -> bool:
    """
    Check if user has permission to perform action on organization
    
    Args:
        session: Database session
        organization_id: Organization ID or instance
        user: User instance
        permission: Permission type (read, write, delete, admin)
    
    Returns:
        bool: True if user has permission
    """
    try:
        if not user or not user.is_active:
            return False
        
        # System admins have all permissions
        if getattr(user, 'is_admin', False):
            return True
        
        # Extract organization ID if we got an instance
        if hasattr(organization_id, 'id'):
            org_id = organization_id.id
        else:
            org_id = organization_id
        
        # Check organization membership
        try:
            membership = await session.scalar(
                select(Membership).where(
                    and_(
                        Membership.organization_id == org_id,
                        Membership.user_id == user.id,
                        Membership.deleted_at.is_(None)
                    )
                )
            )
            
            if membership:
                # Role-based permissions
                role_permissions = {
                    "owner": ["read", "write", "delete", "admin"],
                    "admin": ["read", "write", "admin"],
                    "member": ["read", "write"],
                    "viewer": ["read"]
                }
                
                user_role = getattr(membership, 'role', 'member')
                allowed_permissions = role_permissions.get(user_role, [])
                return permission in allowed_permissions
            
        except Exception as e:
            logger.debug(f"Error checking organization membership: {e}")
        
        return False
        
    except Exception as e:
        logger.error(f"Error checking organization permission: {e}")
        return False


def require_permission(user: User, permission: str) -> None:
    """
    Check if user has required permission.
    Raises HTTPException if user doesn't have permission.
    """
    # Check if user is admin (using is_admin field)
    admin_permissions = [
        "users:read", "users:write", "users:delete",
        "organizations:admin", "system:admin"
    ]
    
    if permission in admin_permissions:
        if not getattr(user, 'is_admin', False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "type": "urn:problem:permission-denied",
                    "title": "Permission Denied",
                    "detail": f"User does not have permission: {permission}",
                    "status": 403
                }
            )
    
    # All other permissions are allowed for active users
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "urn:problem:user-inactive",
                "title": "User Inactive",
                "detail": "User account is not active",
                "status": 403
            }
        )


def has_permission(user: User, permission: str) -> bool:
    """
    Check if user has permission (returns bool instead of raising exception)
    """
    try:
        require_permission(user, permission)
        return True
    except HTTPException:
        return False


def get_user_permissions(user: User) -> list[str]:
    """Get list of all permissions for a user"""
    base_permissions = [
        "profile:read", "profile:write",
        "organizations:join", "organizations:leave",
        "task:read", "task:write"  # Added basic task permissions
    ]
    
    if getattr(user, 'is_admin', False):
        admin_permissions = [
            "users:read", "users:write", "users:delete",
            "organizations:admin", "system:admin",
            "task:delete", "project:admin"
        ]
        return base_permissions + admin_permissions
    
    return base_permissions


# Helper functions for common permission checks
async def can_read_task(session: AsyncSession, task, user: User) -> bool:
    """Helper function to check if user can read task"""
    return await check_task_permission(session, task, user, "read")


async def can_write_task(session: AsyncSession, task, user: User) -> bool:
    """Helper function to check if user can write/edit task"""
    return await check_task_permission(session, task, user, "write")


async def can_delete_task(session: AsyncSession, task, user: User) -> bool:
    """Helper function to check if user can delete task"""
    return await check_task_permission(session, task, user, "delete")


async def can_read_project(session: AsyncSession, project: Project, user: User) -> bool:
    """Helper function to check if user can read project"""
    return await check_project_permission(session, project, user, "read")


async def can_write_project(session: AsyncSession, project: Project, user: User) -> bool:
    """Helper function to check if user can write/edit project"""
    return await check_project_permission(session, project, user, "write")


async def can_delete_project(session: AsyncSession, project: Project, user: User) -> bool:
    """Helper function to check if user can delete project"""
    return await check_project_permission(session, project, user, "delete")


def is_system_admin(user: User) -> bool:
    """Check if user is system administrator"""
    return getattr(user, 'is_admin', False)


def is_active_user(user: User) -> bool:
    """Check if user is active"""
    return user and getattr(user, 'is_active', False)