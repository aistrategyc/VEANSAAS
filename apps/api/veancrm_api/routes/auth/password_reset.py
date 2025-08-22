# apps/api/liderix_api/routes/auth/password_reset.py
from fastapi import APIRouter, Depends, BackgroundTasks, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from uuid import uuid4
from datetime import timedelta
from typing import Optional
import secrets as _secrets
import resend
from redis.asyncio import Redis

from liderix_api.db import get_async_session
from liderix_api.models.users import User
from liderix_api.schemas.auth import (
    PasswordResetRequestSchema, 
    PasswordResetConfirmSchema,
    MessageResponse
)
from liderix_api.services.auth import hash_password, verify_password
from liderix_api.config.settings import settings
from .utils import (
    now_utc, sha256_hex, normalize_email, validate_password,
    AuthError, RateLimiter, AuditLogger, get_client_info
)

router = APIRouter(prefix="/auth", tags=["Password Reset"])
resend.api_key = settings.RESEND_API_KEY
redis = Redis.from_url(settings.REDIS_URL)
rate_limiter = RateLimiter(redis)

async def send_password_reset_email(email: str, username: str, token: str):
    """Send password reset email with secure token"""
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}&email={email}"
    
    try:
        resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": email,
            "subject": "Reset your Liderix password",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Password Reset Request</h1>
                <p>Hello {username},</p>
                <p>We received a request to reset your password for your Liderix account.</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #666;">
                        <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, 
                        please ignore this email and your password will remain unchanged.
                    </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" 
                       style="background-color: #dc3545; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                
                <p style="color: #666; font-size: 14px;">
                    If the button doesn't work, copy and paste this link: {reset_link}
                </p>
                <p style="color: #666; font-size: 14px;">
                    This link will expire in 1 hour for security reasons.
                </p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                    This is an automated message from Liderix. Please do not reply to this email.
                </p>
            </div>
            """
        })
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to send password reset email to {email}: {e}")

@router.post("/password-reset/request", response_model=MessageResponse)
async def request_password_reset(
    data: PasswordResetRequestSchema,
    background: BackgroundTasks,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Request password reset with enhanced security measures
    """
    ip, user_agent = get_client_info(request)
    email = normalize_email(data.email)
    
    # Rate limiting for password reset requests
    reset_rate_key = f"password_reset_rate:{email}:{ip}"
    reset_count = await redis.incr(reset_rate_key)
    if reset_count == 1:
        await redis.expire(reset_rate_key, 3600)  # 1 hour window
    
    if reset_count > 3:  # Max 3 resets per hour per email per IP
        await AuditLogger.log_event(
            session, None, "auth.password_reset.rate_limited", False, ip, user_agent,
            {"email": email, "attempts": reset_count}
        )
        AuthError.problem(429, "urn:problem:reset-rate-limit", 
                         "Too Many Reset Requests", 
                         "Too many password reset requests. Please try again later.")
    
    # Generic response for security (don't reveal if email exists)
    generic_response = MessageResponse(
        message="If this email exists in our system, you will receive password reset instructions."
    )
    
    # Find user
    user = await session.scalar(select(User).where(User.email == email))
    
    if not user:
        # Log attempt but return generic response
        await AuditLogger.log_event(
            session, None, "auth.password_reset.email_not_found", False, ip, user_agent,
            {"email": email}
        )
        return generic_response
    
    if not user.is_verified:
        # Don't allow password reset for unverified accounts
        await AuditLogger.log_event(
            session, user.id, "auth.password_reset.unverified_account", False, ip, user_agent,
            {"email": email}
        )
        return generic_response
    
    if hasattr(user, 'is_active') and not user.is_active:
        # Don't allow password reset for inactive accounts
        await AuditLogger.log_event(
            session, user.id, "auth.password_reset.inactive_account", False, ip, user_agent,
            {"email": email}
        )
        return generic_response
    
    # Generate secure reset token
    reset_token = _secrets.token_urlsafe(32)
    reset_token_hash = sha256_hex(reset_token)
    reset_expires_at = now_utc() + timedelta(hours=1)  # 1 hour expiry
    
    # Store reset token
    async with session.begin():
        await session.execute(
            update(User)
            .where(User.id == user.id)
            .values(
                password_reset_token_hash=reset_token_hash,
                password_reset_expires_at=reset_expires_at,
                updated_at=now_utc()
            )
        )
    
    # Send reset email
    background.add_task(send_password_reset_email, email, user.username, reset_token)
    
    # Log successful request
    await AuditLogger.log_event(
        session, user.id, "auth.password_reset.requested", True, ip, user_agent,
        {"email": email}
    )
    
    return generic_response

@router.post("/password-reset/confirm", response_model=MessageResponse)
async def confirm_password_reset(
    data: PasswordResetConfirmSchema,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Confirm password reset with new password
    """
    ip, user_agent = get_client_info(request)
    email = normalize_email(data.email)
    token_hash = sha256_hex(data.token)
    
    # Validate new password
    password_valid, password_error = validate_password(data.new_password)
    if not password_valid:
        await AuditLogger.log_event(
            session, None, "auth.password_reset.weak_password", False, ip, user_agent,
            {"email": email, "error": password_error}
        )
        AuthError.problem(400, "urn:problem:weak-password", 
                         "Weak Password", password_error)
    
    async with session.begin():
        user = await session.scalar(select(User).where(User.email == email))
        
        if not user:
            await AuditLogger.log_event(
                session, None, "auth.password_reset.user_not_found", False, ip, user_agent,
                {"email": email}
            )
            AuthError.problem(400, "urn:problem:invalid-reset-token", 
                             "Invalid Reset Token", "Invalid or expired reset token")
        
        # Validate reset token
        if not user.password_reset_token_hash:
            await AuditLogger.log_event(
                session, user.id, "auth.password_reset.no_token", False, ip, user_agent,
                {"email": email}
            )
            AuthError.problem(400, "urn:problem:invalid-reset-token", 
                             "Invalid Reset Token", "No active reset token found")
        
        # Constant-time comparison
        if not _secrets.compare_digest(user.password_reset_token_hash, token_hash):
            await AuditLogger.log_event(
                session, user.id, "auth.password_reset.wrong_token", False, ip, user_agent,
                {"email": email}
            )
            AuthError.problem(400, "urn:problem:invalid-reset-token", 
                             "Invalid Reset Token", "Invalid or expired reset token")
        
        # Check token expiration
        if not user.password_reset_expires_at or user.password_reset_expires_at < now_utc():
            await AuditLogger.log_event(
                session, user.id, "auth.password_reset.expired_token", False, ip, user_agent,
                {"email": email}
            )
            AuthError.problem(400, "urn:problem:reset-token-expired", 
                             "Reset Token Expired", "Reset token has expired. Please request a new one.")
        
        # Check if new password is same as current (optional security measure)
        if verify_password(data.new_password, user.hashed_password):
            await AuditLogger.log_event(
                session, user.id, "auth.password_reset.same_password", False, ip, user_agent,
                {"email": email}
            )
            AuthError.problem(400, "urn:problem:same-password", 
                             "Same Password", "New password cannot be the same as current password")
        
        # Update password and clear reset token
        new_password_hash = hash_password(data.new_password)
        await session.execute(
            update(User)
            .where(User.id == user.id)
            .values(
                hashed_password=new_password_hash,
                password_reset_token_hash=None,
                password_reset_expires_at=None,
                password_changed_at=now_utc(),
                updated_at=now_utc()
            )
        )
    
    # Revoke all existing refresh tokens for security
    from .utils import TokenWhitelist
    token_whitelist = TokenWhitelist(redis)
    await token_whitelist.remove_all_user_tokens(str(user.id))
    
    # Log successful password reset
    await AuditLogger.log_event(
        session, user.id, "auth.password_reset.completed", True, ip, user_agent,
        {"email": email}
    )
    
    return MessageResponse(
        message="Password reset successfully. Please log in with your new password."
    )

@router.post("/password-reset/cancel", response_model=MessageResponse)
async def cancel_password_reset(
    data: PasswordResetRequestSchema,  # Reuse same schema (just email)
    request: Request,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Cancel active password reset request
    """
    ip, user_agent = get_client_info(request)
    email = normalize_email(data.email)
    
    user = await session.scalar(select(User).where(User.email == email))
    
    # Generic response for security
    generic_response = MessageResponse(
        message="If there was an active password reset request, it has been cancelled."
    )
    
    if not user or not user.password_reset_token_hash:
        await AuditLogger.log_event(
            session, user.id if user else None, "auth.password_reset.cancel_no_token", 
            True, ip, user_agent, {"email": email}
        )
        return generic_response
    
    # Clear reset token
    async with session.begin():
        await session.execute(
            update(User)
            .where(User.id == user.id)
            .values(
                password_reset_token_hash=None,
                password_reset_expires_at=None,
                updated_at=now_utc()
            )
        )
    
    await AuditLogger.log_event(
        session, user.id, "auth.password_reset.cancelled", True, ip, user_agent,
        {"email": email}
    )
    
    return generic_response