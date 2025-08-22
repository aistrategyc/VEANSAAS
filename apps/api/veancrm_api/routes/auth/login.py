# apps/api/liderix_api/routes/auth/login.py
from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from uuid import uuid4
from datetime import timedelta
from typing import Optional
from redis.asyncio import Redis

from liderix_api.models.users import User
from liderix_api.services.auth import (
    verify_password, create_access_token, create_refresh_token, decode_token
)
from liderix_api.schemas.auth import LoginRequest, TokenResponse
from liderix_api.db import get_async_session
from liderix_api.config.settings import settings
from .utils import (
    now_utc, now_utc_timestamp, normalize_email, AuthError, 
    RateLimiter, AuditLogger, TokenWhitelist, get_client_info
)

router = APIRouter(prefix="/auth", tags=["Auth"])
redis = Redis.from_url(settings.REDIS_URL)
rate_limiter = RateLimiter(redis)
token_whitelist = TokenWhitelist(redis)

# Security constants
MAX_LOGIN_ATTEMPTS = 5
LOGIN_LOCKOUT_DURATION = 900  # 15 minutes
DEVICE_TRACKING_ENABLED = getattr(settings, 'DEVICE_TRACKING_ENABLED', True)
SECURE_COOKIES = getattr(settings, "COOKIE_SECURE", False)
SAMESITE = getattr(settings, "COOKIE_SAMESITE", "lax" if not SECURE_COOKIES else "strict")

async def check_account_lockout(email: str, session: AsyncSession) -> Optional[int]:
    """
    Check if account is locked due to suspicious activity
    Returns remaining lockout time in seconds, or None if not locked
    """
    lockout_key = f"account_lockout:{email}"
    remaining_ttl = await redis.ttl(lockout_key)
    return remaining_ttl if remaining_ttl > 0 else None

async def lock_account(email: str, duration: int = 3600):
    """Lock account for specified duration (default 1 hour)"""
    lockout_key = f"account_lockout:{email}"
    await redis.setex(lockout_key, duration, "locked")

async def track_login_device(user_id: str, ip: str, user_agent: str) -> bool:
    """
    Track login device and detect new devices
    Returns True if this is a new device
    """
    if not DEVICE_TRACKING_ENABLED:
        return False
    
    device_hash = f"{ip}:{user_agent}"
    device_key = f"known_devices:{user_id}"
    
    # Check if device is known
    is_known = await redis.sismember(device_key, device_hash)
    
    if not is_known:
        # Add new device to known devices
        await redis.sadd(device_key, device_hash)
        await redis.expire(device_key, 86400 * 90)  # Keep for 90 days
        return True
    
    return False

def set_secure_cookie(response: Response, name: str, value: str, max_age: int):
    """Set secure HTTP-only cookie with proper attributes"""
    cookie_kwargs = {
        "key": name,
        "value": value,
        "httponly": True,
        "secure": SECURE_COOKIES,
        "samesite": SAMESITE,
        "max_age": max_age,
        "path": "/",
    }
    
    # Add domain if configured
    if hasattr(settings, 'COOKIE_DOMAIN') and settings.COOKIE_DOMAIN:
        cookie_kwargs["domain"] = settings.COOKIE_DOMAIN
    
    response.set_cookie(**cookie_kwargs)

@router.post("/login", response_model=TokenResponse)
async def login(
    data: LoginRequest, 
    request: Request,
    response: Response,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Authenticate user with comprehensive security measures
    """
    ip, user_agent = get_client_info(request)
    email = normalize_email(data.email)
    
    # Check account lockout first
    lockout_remaining = await check_account_lockout(email, session)
    if lockout_remaining:
        await AuditLogger.log_event(
            session, None, "auth.login.account_locked", False, ip, user_agent,
            {"email": email, "lockout_remaining": lockout_remaining}
        )
        AuthError.problem(423, "urn:problem:account-locked", 
                         "Account Locked", 
                         f"Account temporarily locked. Try again in {lockout_remaining // 60} minutes.")
    
    # Check rate limiting
    failed_attempts = await rate_limiter.check_login_attempts(email, ip, increment=False)
    if failed_attempts >= MAX_LOGIN_ATTEMPTS:
        await AuditLogger.log_event(
            session, None, "auth.login.rate_limited", False, ip, user_agent,
            {"email": email, "attempts": failed_attempts}
        )
        AuthError.rate_limit_exceeded()
    
    # Fetch user with related data
    user = await session.scalar(
        select(User)
        .options(selectinload(User.organizations))
        .where(User.email == email)
    )
    
    # Check if user exists (timing-safe)
    if not user:
        # Increment failure count
        await rate_limiter.check_login_attempts(email, ip, increment=True)
        await AuditLogger.log_event(
            session, None, "auth.login.user_not_found", False, ip, user_agent,
            {"email": email}
        )
        AuthError.invalid_credentials()
    
    # Verify password (timing-safe)
    if not verify_password(data.password, user.hashed_password):
        # Increment failure count
        current_failures = await rate_limiter.check_login_attempts(email, ip, increment=True)
        
        await AuditLogger.log_event(
            session, user.id, "auth.login.wrong_password", False, ip, user_agent,
            {"email": email, "attempt_count": current_failures}
        )
        
        # Lock account after too many failures
        if current_failures >= MAX_LOGIN_ATTEMPTS:
            await lock_account(email, LOGIN_LOCKOUT_DURATION)
            await AuditLogger.log_event(
                session, user.id, "auth.login.account_auto_locked", False, ip, user_agent,
                {"email": email, "trigger": "too_many_failures"}
            )
        
        AuthError.invalid_credentials()
    
    # Check account status
    if hasattr(user, 'is_active') and not user.is_active:
        await AuditLogger.log_event(
            session, user.id, "auth.login.account_disabled", False, ip, user_agent,
            {"email": email}
        )
        AuthError.account_disabled()
    
    if not user.is_verified:
        await AuditLogger.log_event(
            session, user.id, "auth.login.unverified", False, ip, user_agent,
            {"email": email}
        )
        AuthError.email_not_verified()
    
    # Check for account suspension
    if hasattr(user, 'suspended_until') and user.suspended_until and user.suspended_until > now_utc():
        await AuditLogger.log_event(
            session, user.id, "auth.login.suspended", False, ip, user_agent,
            {"email": email, "suspended_until": user.suspended_until.isoformat()}
        )
        AuthError.problem(403, "urn:problem:account-suspended", 
                         "Account Suspended", 
                         f"Account suspended until {user.suspended_until.strftime('%Y-%m-%d %H:%M UTC')}")
    
    # Success - clear rate limiting
    await rate_limiter.check_login_attempts(email, ip, increment=False)
    
    # Track device for security monitoring
    is_new_device = await track_login_device(str(user.id), ip, user_agent)
    
    # Generate tokens
    now = now_utc_timestamp()
    access_jti = str(uuid4())
    refresh_jti = str(uuid4())
    
    # Collect user context for token
    user_context = {
        "sub": str(user.id),
        "email": user.email,
        "username": user.username,
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
        "iat": now,
        "jti": access_jti
    }
    
    # Add organization/role context if available
    if hasattr(user, 'organizations'):
        user_context["org_ids"] = [str(org.id) for org in user.organizations]
    
    if hasattr(user, 'roles'):
        user_context["roles"] = [role.name for role in user.roles] if user.roles else []
    
    # Create access token
    access_token = create_access_token(user_context)
    
    # Create refresh token
    refresh_context = {
        "sub": str(user.id),
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
        "iat": now,
        "exp": now + settings.REFRESH_TTL_SEC,
        "jti": refresh_jti,
        "typ": "refresh"
    }
    refresh_token = create_refresh_token(refresh_context)
    
    # Add refresh token to whitelist
    await token_whitelist.add(str(user.id), refresh_jti)
    
    # Set secure refresh token cookie
    set_secure_cookie(response, settings.REFRESH_COOKIE_NAME, refresh_token, settings.REFRESH_TTL_SEC)
    
    # Update user's last login
    try:
        fields = {
            "last_login_at": now_utc(),
            "updated_at": now_utc()
        }
        if hasattr(User, "last_login_ip"):
            fields["last_login_ip"] = ip

        await session.execute(
            update(User)
            .where(User.id == user.id)
            .values(**fields)
        )
        await session.commit()
    except Exception:
        await session.rollback()
        # optionally log error, but do not raise to avoid breaking login
    
    # Log successful login with context
    await AuditLogger.log_event(
        session, user.id, "auth.login.success", True, ip, user_agent,
        {
            "email": email,
            "username": user.username,
            "new_device": is_new_device,
            "access_jti": access_jti,
            "refresh_jti": refresh_jti
        }
    )
    
    # Send security alert for new device
    if is_new_device:
        # Could trigger background task to send security notification email
        await AuditLogger.log_event(
            session, user.id, "auth.login.new_device", True, ip, user_agent,
            {"email": email, "device_info": user_agent}
        )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TTL_SEC
    )

@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Logout current session and invalidate refresh token
    """
    ip, user_agent = get_client_info(request)
    refresh_token = request.cookies.get(settings.REFRESH_COOKIE_NAME)
    
    user_id = None
    
    if refresh_token:
        try:
            # Decode token (allow expired tokens for logout)
            claims = decode_token(refresh_token, verify_exp=False)
            
            if claims.get("typ") == "refresh" and claims.get("sub") and claims.get("jti"):
                user_id = claims["sub"]
                jti = claims["jti"]
                
                # Remove from whitelist
                await token_whitelist.remove(user_id, jti)
                
                await AuditLogger.log_event(
                    session, user_id, "auth.logout.success", True, ip, user_agent,
                    {"refresh_jti": jti}
                )
        except Exception as e:
            # Log failed token decode but continue with logout
            await AuditLogger.log_event(
                session, None, "auth.logout.invalid_token", False, ip, user_agent,
                {"error": str(e)}
            )
    
    # Clear refresh token cookie
    response.delete_cookie(
        key=settings.REFRESH_COOKIE_NAME,
        path="/",
        domain=getattr(settings, 'COOKIE_DOMAIN', None),
        secure=SECURE_COOKIES,
        httponly=True,
        samesite=SAMESITE
    )
    
    return {"message": "Successfully logged out"}

@router.post("/logout-all")
async def logout_all_sessions(
    request: Request,
    response: Response,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Logout from all sessions (invalidate all refresh tokens for user)
    """
    ip, user_agent = get_client_info(request)
    refresh_token = request.cookies.get(settings.REFRESH_COOKIE_NAME)
    
    if not refresh_token:
        AuthError.problem(401, "urn:problem:no-refresh", 
                         "No Active Session", "No active session found")
    
    try:
        # Decode current refresh token to get user ID
        claims = decode_token(refresh_token, verify_exp=False)
        
        if claims.get("typ") != "refresh" or not claims.get("sub"):
            AuthError.problem(401, "urn:problem:invalid-token", 
                             "Invalid Token", "Invalid refresh token")
        
        user_id = claims["sub"]
        
        # Remove all refresh tokens for this user
        await token_whitelist.remove_all_user_tokens(user_id)
        
        # Clear current refresh cookie
        response.delete_cookie(
            key=settings.REFRESH_COOKIE_NAME,
            path="/",
            domain=getattr(settings, 'COOKIE_DOMAIN', None),
            secure=SECURE_COOKIES,
            httponly=True,
            samesite=SAMESITE
        )
        
        await AuditLogger.log_event(
            session, user_id, "auth.logout_all.success", True, ip, user_agent
        )
        
        return {"message": "Successfully logged out from all sessions"}
    
    except Exception as e:
        await AuditLogger.log_event(
            session, None, "auth.logout_all.failed", False, ip, user_agent,
            {"error": str(e)}
        )
        AuthError.problem(401, "urn:problem:invalid-token", 
                         "Invalid Token", "Unable to logout from all sessions")

@router.get("/sessions")
async def get_active_sessions(
    request: Request,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Get list of active sessions for current user
    Note: This would require storing session metadata in Redis
    """
    ip, user_agent = get_client_info(request)
    refresh_token = request.cookies.get(settings.REFRESH_COOKIE_NAME)
    
    if not refresh_token:
        AuthError.problem(401, "urn:problem:no-refresh", 
                         "No Active Session", "No active session found")
    
    try:
        claims = decode_token(refresh_token, verify_exp=True)
        
        if claims.get("typ") != "refresh" or not claims.get("sub"):
            AuthError.problem(401, "urn:problem:invalid-token", 
                             "Invalid Token", "Invalid refresh token")
        
        user_id = claims["sub"]
        current_jti = claims["jti"]
        
        # Get all active refresh tokens for user
        pattern = f"refresh_whitelist:{user_id}:*"
        active_sessions = []
        
        async for key in redis.scan_iter(match=pattern, count=1000):
            jti = key.decode().split(":")[-1]
            
            # Get session metadata if stored (this would need to be implemented)
            session_key = f"session_meta:{user_id}:{jti}"
            session_data = await redis.hgetall(session_key)
            
            if session_data:
                active_sessions.append({
                    "jti": jti,
                    "is_current": jti == current_jti,
                    "created_at": session_data.get(b"created_at", b"").decode(),
                    "ip": session_data.get(b"ip", b"").decode(),
                    "user_agent": session_data.get(b"user_agent", b"").decode(),
                    "last_used": session_data.get(b"last_used", b"").decode()
                })
        
        await AuditLogger.log_event(
            session, user_id, "auth.sessions.viewed", True, ip, user_agent
        )
        
        return {"active_sessions": active_sessions}
    
    except Exception as e:
        await AuditLogger.log_event(
            session, None, "auth.sessions.failed", False, ip, user_agent,
            {"error": str(e)}
        )
        AuthError.problem(401, "urn:problem:invalid-token", 
                         "Invalid Token", "Unable to retrieve sessions")