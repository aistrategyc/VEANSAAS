# apps/api/liderix_api/routes/auth/refresh.py - COMPLETE VERSION
from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, Request, Response
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from liderix_api.config.settings import settings
from liderix_api.db import get_async_session
from liderix_api.models.users import User
from liderix_api.schemas.auth import TokenResponse
from liderix_api.services.auth import (
    create_access_token,
    create_refresh_token,
    decode_token,
)
from .utils import (
    now_utc_timestamp, AuthError, AuditLogger, 
    TokenWhitelist, get_client_info
)

router = APIRouter(prefix="/auth", tags=["Auth"])
redis = Redis.from_url(settings.REDIS_URL)
token_whitelist = TokenWhitelist(redis)

# Security constants
MAX_REFRESH_ATTEMPTS = 10  # Max refresh attempts per hour
REFRESH_RATE_WINDOW = 3600  # 1 hour

async def check_refresh_rate_limit(user_id: str, ip: str) -> bool:
    """
    Check refresh token rate limiting
    Returns True if within limits, False if rate limited
    """
    rate_key = f"refresh_rate:{user_id}:{ip}"
    current_count = await redis.incr(rate_key)
    
    if current_count == 1:
        await redis.expire(rate_key, REFRESH_RATE_WINDOW)
    
    return current_count <= MAX_REFRESH_ATTEMPTS

async def store_session_metadata(user_id: str, jti: str, ip: str, user_agent: str):
    """Store session metadata for tracking"""
    session_key = f"session_meta:{user_id}:{jti}"
    session_data = {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "ip": ip,
        "user_agent": user_agent,
        "last_used": datetime.now(timezone.utc).isoformat()
    }
    
    await redis.hmset(session_key, session_data)
    await redis.expire(session_key, settings.REFRESH_TTL_SEC)

async def update_session_last_used(user_id: str, jti: str):
    """Update last used timestamp for session"""
    session_key = f"session_meta:{user_id}:{jti}"
    await redis.hset(session_key, "last_used", datetime.now(timezone.utc).isoformat())

def set_refresh_cookie(response: Response, token: str):
    """Set secure refresh token cookie"""
    cookie_kwargs = {
        "key": settings.REFRESH_COOKIE_NAME,
        "value": token,
        "httponly": True,
        "secure": True,
        "samesite": "strict",
        "max_age": settings.REFRESH_TTL_SEC,
        "path": "/",
    }
    
    # Add domain if configured
    if hasattr(settings, 'COOKIE_DOMAIN') and settings.COOKIE_DOMAIN:
        cookie_kwargs["domain"] = settings.COOKIE_DOMAIN
    
    response.set_cookie(**cookie_kwargs)

def clear_refresh_cookie(response: Response):
    """Clear refresh token cookie"""
    cookie_kwargs = {
        "key": settings.REFRESH_COOKIE_NAME,
        "value": "",
        "httponly": True,
        "secure": True,
        "samesite": "strict",
        "max_age": 0,
        "path": "/",
    }
    
    if hasattr(settings, 'COOKIE_DOMAIN') and settings.COOKIE_DOMAIN:
        cookie_kwargs["domain"] = settings.COOKIE_DOMAIN
    
    response.set_cookie(**cookie_kwargs)

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: Request,
    response: Response,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Refresh access token using refresh token with comprehensive security
    
    Features:
    - Token rotation (invalidates old refresh token)
    - Replay attack detection
    - Rate limiting
    - Session tracking
    - Automatic revocation on suspicious activity
    """
    ip, user_agent = get_client_info(request)
    refresh_token = request.cookies.get(settings.REFRESH_COOKIE_NAME)

    if not refresh_token:
        await AuditLogger.log_event(
            session, None, "auth.refresh.no_token", False, ip, user_agent
        )
        AuthError.problem(401, "urn:problem:no-refresh", 
                         "Refresh Token Missing", "Refresh token not found in cookies")

    try:
        # Decode and validate token
        claims = decode_token(refresh_token, verify_exp=True)
    except Exception as e:
        await AuditLogger.log_event(
            session, None, "auth.refresh.invalid_token", False, ip, user_agent,
            {"error": str(e)}
        )
        clear_refresh_cookie(response)
        AuthError.problem(401, "urn:problem:invalid-refresh", 
                         "Invalid Refresh Token", "Refresh token is invalid or expired")

    # Validate token type
    if claims.get("typ") != "refresh":
        await AuditLogger.log_event(
            session, None, "auth.refresh.wrong_type", False, ip, user_agent,
            {"typ": claims.get("typ")}
        )
        clear_refresh_cookie(response)
        AuthError.problem(401, "urn:problem:invalid-token-type", 
                         "Invalid Token Type", "Expected refresh token")

    sub = claims.get("sub")
    jti = claims.get("jti")
    
    if not sub or not jti:
        await AuditLogger.log_event(
            session, None, "auth.refresh.missing_claims", False, ip, user_agent,
            {"sub": bool(sub), "jti": bool(jti)}
        )
        clear_refresh_cookie(response)
        AuthError.problem(401, "urn:problem:invalid-token", 
                         "Invalid Token", "Token missing required claims")

    # Check rate limiting
    if not await check_refresh_rate_limit(sub, ip):
        await AuditLogger.log_event(
            session, UUID(sub), "auth.refresh.rate_limited", False, ip, user_agent
        )
        AuthError.problem(429, "urn:problem:refresh-rate-limit", 
                         "Too Many Refresh Attempts", 
                         "Too many refresh attempts. Please try again later.")

    # Check if token is in whitelist (replay protection)
    if not await token_whitelist.exists(sub, jti):
        # Possible token reuse attack - revoke all user tokens
        await token_whitelist.remove_all_user_tokens(sub)
        
        await AuditLogger.log_event(
            session, UUID(sub), "auth.refresh.replay_detected", False, ip, user_agent,
            {"jti": jti, "action": "revoked_all_tokens"}
        )
        
        clear_refresh_cookie(response)
        AuthError.problem(401, "urn:problem:refresh-revoked", 
                         "Refresh Token Revoked", 
                         "Security violation detected. Please login again.")

    # Validate user exists and is active
    try:
        user: Optional[User] = await session.scalar(
            select(User)
            .options(
                selectinload(User.organizations) if hasattr(User, 'organizations') else selectinload(User.id)
            )
            .where(User.id == UUID(sub))
        )
    except Exception as e:
        await AuditLogger.log_event(
            session, UUID(sub), "auth.refresh.db_error", False, ip, user_agent,
            {"error": str(e)}
        )
        AuthError.problem(500, "urn:problem:server-error", 
                         "Server Error", "Unable to validate user")

    if not user:
        await token_whitelist.remove(sub, jti)
        await AuditLogger.log_event(
            session, UUID(sub), "auth.refresh.user_not_found", False, ip, user_agent
        )
        clear_refresh_cookie(response)
        AuthError.problem(401, "urn:problem:user-not-found", 
                         "User Not Found", "Please login again")

    # Check if user is deleted
    if hasattr(user, 'deleted_at') and user.deleted_at:
        await token_whitelist.remove_all_user_tokens(sub)
        await AuditLogger.log_event(
            session, user.id, "auth.refresh.user_deleted", False, ip, user_agent
        )
        clear_refresh_cookie(response)
        AuthError.problem(401, "urn:problem:user-deleted", 
                         "Account Deleted", "Please create a new account")

    # Check if user is active
    if hasattr(user, 'is_active') and not user.is_active:
        await token_whitelist.remove_all_user_tokens(sub)
        await AuditLogger.log_event(
            session, user.id, "auth.refresh.user_inactive", False, ip, user_agent
        )
        clear_refresh_cookie(response)
        AuthError.problem(403, "urn:problem:account-disabled", 
                         "Account Disabled", "Contact support to reactivate your account")

    # Check if user is verified
    if not user.is_verified:
        await token_whitelist.remove_all_user_tokens(sub)
        await AuditLogger.log_event(
            session, user.id, "auth.refresh.user_unverified", False, ip, user_agent
        )
        clear_refresh_cookie(response)
        AuthError.problem(403, "urn:problem:unverified", 
                         "Email Not Verified", "Please verify your email address")

    # Check account suspension
    if hasattr(user, 'suspended_until') and user.suspended_until and user.suspended_until > datetime.now(timezone.utc):
        await token_whitelist.remove_all_user_tokens(sub)
        await AuditLogger.log_event(
            session, user.id, "auth.refresh.user_suspended", False, ip, user_agent,
            {"suspended_until": user.suspended_until.isoformat()}
        )
        clear_refresh_cookie(response)
        AuthError.problem(403, "urn:problem:account-suspended", 
                         "Account Suspended", 
                         f"Account suspended until {user.suspended_until.strftime('%Y-%m-%d %H:%M UTC')}")

    # Token rotation: remove old token and create new ones
    await token_whitelist.remove(sub, jti)
    await update_session_last_used(sub, jti)

    # Generate new tokens
    now = now_utc_timestamp()
    new_access_jti = str(uuid4())
    new_refresh_jti = str(uuid4())

    # Prepare user context for new access token
    user_context = {
        "sub": sub,
        "email": user.email,
        "username": user.username,
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
        "iat": now,
        "jti": new_access_jti
    }

    # Add organization/role context if available
    if hasattr(user, 'organizations') and user.organizations:
        user_context["org_ids"] = [str(org.id) for org in user.organizations]

    if hasattr(user, 'roles') and user.roles:
        user_context["roles"] = [role.name for role in user.roles]

    # Create new access token
    new_access_token = create_access_token(user_context)

    # Create new refresh token
    refresh_context = {
        "sub": sub,
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
        "iat": now,
        "exp": now + settings.REFRESH_TTL_SEC,
        "jti": new_refresh_jti,
        "typ": "refresh"
    }
    new_refresh_token = create_refresh_token(refresh_context)

    # Add new refresh token to whitelist
    await token_whitelist.add(sub, new_refresh_jti)

    # Store session metadata
    await store_session_metadata(sub, new_refresh_jti, ip, user_agent)

    # Set new refresh cookie
    set_refresh_cookie(response, new_refresh_token)

    # Log successful refresh
    await AuditLogger.log_event(
        session, user.id, "auth.refresh.success", True, ip, user_agent,
        {
            "old_jti": jti,
            "new_access_jti": new_access_jti,
            "new_refresh_jti": new_refresh_jti,
            "username": user.username
        }
    )

    return TokenResponse(
        access_token=new_access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TTL_SEC
    )

@router.post("/revoke")
async def revoke_refresh_token(
    request: Request,
    response: Response,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Revoke current refresh token (single session logout)
    """
    ip, user_agent = get_client_info(request)
    refresh_token = request.cookies.get(settings.REFRESH_COOKIE_NAME)

    if not refresh_token:
        await AuditLogger.log_event(
            session, None, "auth.revoke.no_token", False, ip, user_agent
        )
        AuthError.problem(401, "urn:problem:no-refresh", 
                         "No Active Session", "No refresh token found")

    try:
        # Decode token (allow expired for revocation)
        claims = decode_token(refresh_token, verify_exp=False)
        
        if claims.get("typ") == "refresh" and claims.get("sub") and claims.get("jti"):
            user_id = claims["sub"]
            jti = claims["jti"]
            
            # Remove from whitelist
            await token_whitelist.remove(user_id, jti)
            
            # Remove session metadata
            session_key = f"session_meta:{user_id}:{jti}"
            await redis.delete(session_key)
            
            await AuditLogger.log_event(
                session, UUID(user_id), "auth.revoke.success", True, ip, user_agent,
                {"jti": jti}
            )
        else:
            await AuditLogger.log_event(
                session, None, "auth.revoke.invalid_token", False, ip, user_agent
            )
    except Exception as e:
        await AuditLogger.log_event(
            session, None, "auth.revoke.error", False, ip, user_agent,
            {"error": str(e)}
        )

    # Always clear cookie regardless of token validity
    clear_refresh_cookie(response)
    
    return {"message": "Refresh token revoked successfully"}

@router.post("/revoke-all")
async def revoke_all_refresh_tokens(
    request: Request,
    response: Response,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Revoke all refresh tokens for current user (logout from all sessions)
    """
    ip, user_agent = get_client_info(request)
    refresh_token = request.cookies.get(settings.REFRESH_COOKIE_NAME)

    if not refresh_token:
        AuthError.problem(401, "urn:problem:no-refresh", 
                         "No Active Session", "No refresh token found")

    try:
        # Decode current token to get user ID
        claims = decode_token(refresh_token, verify_exp=False)
        
        if claims.get("typ") != "refresh" or not claims.get("sub"):
            AuthError.problem(401, "urn:problem:invalid-token", 
                             "Invalid Token", "Invalid refresh token")

        user_id = claims["sub"]
        
        # Get all session keys for cleanup
        session_pattern = f"session_meta:{user_id}:*"
        session_keys = []
        async for key in redis.scan_iter(match=session_pattern, count=1000):
            session_keys.append(key)
        
        # Remove all sessions metadata
        if session_keys:
            await redis.delete(*session_keys)
        
        # Remove all refresh tokens from whitelist
        await token_whitelist.remove_all_user_tokens(user_id)
        
        await AuditLogger.log_event(
            session, UUID(user_id), "auth.revoke_all.success", True, ip, user_agent,
            {"sessions_count": len(session_keys)}
        )
        
    except Exception as e:
        await AuditLogger.log_event(
            session, None, "auth.revoke_all.error", False, ip, user_agent,
            {"error": str(e)}
        )
        AuthError.problem(400, "urn:problem:revocation-failed", 
                         "Revocation Failed", "Unable to revoke all sessions")

    # Clear current cookie
    clear_refresh_cookie(response)
    
    return {"message": "All refresh tokens revoked successfully"}

@router.get("/validate")
async def validate_refresh_token(
    request: Request,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Validate current refresh token without refreshing it
    Useful for checking session validity
    """
    ip, user_agent = get_client_info(request)
    refresh_token = request.cookies.get(settings.REFRESH_COOKIE_NAME)

    if not refresh_token:
        await AuditLogger.log_event(
            session, None, "auth.validate.no_token", False, ip, user_agent
        )
        AuthError.problem(401, "urn:problem:no-refresh", 
                         "No Active Session", "No refresh token found")

    try:
        # Decode and validate token
        claims = decode_token(refresh_token, verify_exp=True)
        
        if claims.get("typ") != "refresh":
            await AuditLogger.log_event(
                session, None, "auth.validate.wrong_type", False, ip, user_agent
            )
            AuthError.problem(401, "urn:problem:invalid-token-type", 
                             "Invalid Token Type", "Expected refresh token")

        sub = claims.get("sub")
        jti = claims.get("jti")
        
        if not sub or not jti:
            await AuditLogger.log_event(
                session, None, "auth.validate.missing_claims", False, ip, user_agent
            )
            AuthError.problem(401, "urn:problem:invalid-token", 
                             "Invalid Token", "Token missing required claims")

        # Check whitelist
        if not await token_whitelist.exists(sub, jti):
            await AuditLogger.log_event(
                session, UUID(sub), "auth.validate.not_whitelisted", False, ip, user_agent
            )
            AuthError.problem(401, "urn:problem:token-revoked", 
                             "Token Revoked", "Refresh token has been revoked")

        # Validate user
        user = await session.scalar(select(User).where(User.id == UUID(sub)))
        
        if not user or not user.is_verified:
            await AuditLogger.log_event(
                session, UUID(sub) if user else None, "auth.validate.user_invalid", 
                False, ip, user_agent
            )
            AuthError.problem(401, "urn:problem:user-invalid", 
                             "Invalid User", "User not found or not verified")

        if hasattr(user, 'is_active') and not user.is_active:
            await AuditLogger.log_event(
                session, user.id, "auth.validate.user_inactive", False, ip, user_agent
            )
            AuthError.problem(403, "urn:problem:account-disabled", 
                             "Account Disabled", "User account is disabled")

        # Update session last used
        await update_session_last_used(sub, jti)
        
        await AuditLogger.log_event(
            session, user.id, "auth.validate.success", True, ip, user_agent,
            {"jti": jti}
        )

        return {
            "valid": True,
            "user_id": sub,
            "username": user.username,
            "email": user.email,
            "expires_at": claims.get("exp"),
            "issued_at": claims.get("iat")
        }

    except Exception as e:
        await AuditLogger.log_event(
            session, None, "auth.validate.error", False, ip, user_agent,
            {"error": str(e)}
        )
        AuthError.problem(401, "urn:problem:validation-failed", 
                         "Validation Failed", "Unable to validate refresh token")