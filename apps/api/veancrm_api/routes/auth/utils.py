# liderix_api/routes/auth/utils.py
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
import secrets as _secrets
import hashlib
import re

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis

from liderix_api.config.settings import settings

# Common utilities for all auth routes

def now_utc() -> datetime:
    """Get current UTC datetime"""
    return datetime.now(timezone.utc)

def now_utc_timestamp() -> int:
    """Get current UTC timestamp"""
    return int(now_utc().timestamp())

def sha256_hex(s: str) -> str:
    """Generate SHA256 hash"""
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

def normalize_email(email: str) -> str:
    """Normalize email to lowercase and strip whitespace"""
    return email.strip().lower()

def eq_const(a: str, b: str) -> bool:
    """Constant-time string comparison"""
    return _secrets.compare_digest(a, b)

def validate_password(password: str) -> tuple[bool, str]:
    """
    Validate password strength
    Returns (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if len(password) > 128:
        return False, "Password must be less than 128 characters"
    
    # Check for at least one uppercase, lowercase, digit, and special char
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))
    
    if not all([has_upper, has_lower, has_digit, has_special]):
        return False, "Password must contain uppercase, lowercase, digit, and special character"
    
    # Check for common weak passwords
    weak_passwords = {"password", "12345678", "qwerty123", "admin123"}
    if password.lower() in weak_passwords:
        return False, "Password is too common"
    
    return True, ""

def validate_username(username: str) -> tuple[bool, str]:
    """
    Validate username
    Returns (is_valid, error_message)
    """
    username = username.strip()
    
    if len(username) < 3:
        return False, "Username must be at least 3 characters long"
    
    if len(username) > 50:
        return False, "Username must be less than 50 characters"
    
    # Only allow alphanumeric and underscores
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return False, "Username can only contain letters, numbers, and underscores"
    
    return True, ""

class AuthError:
    """Standardized auth error responses"""
    
    @staticmethod
    def problem(status_code: int, type_: str, title: str, detail: str):
        """Raise standardized HTTP exception"""
        raise HTTPException(
            status_code=status_code,
            detail={
                "type": type_, 
                "title": title, 
                "detail": detail, 
                "status": status_code
            }
        )
    
    @classmethod
    def invalid_credentials(cls):
        cls.problem(401, "urn:problem:invalid-credentials", 
                   "Invalid Credentials", "Incorrect email or password")
    
    @classmethod
    def rate_limit_exceeded(cls):
        cls.problem(429, "urn:problem:rate-limit", 
                   "Rate Limit Exceeded", "Too many failed attempts. Try later.")
    
    @classmethod
    def account_disabled(cls):
        cls.problem(403, "urn:problem:account-disabled", 
                   "Account Disabled", "Your account is disabled")
    
    @classmethod
    def email_not_verified(cls):
        cls.problem(403, "urn:problem:unverified", 
                   "Email Not Verified", "Please verify your email first")
    
    @classmethod
    def duplicate_email(cls):
        cls.problem(409, "urn:problem:duplicate-email", 
                   "Duplicate Email", "A verified account with this email already exists")
    
    @classmethod
    def invalid_token(cls):
        cls.problem(400, "urn:problem:invalid-token", 
                   "Invalid Token", "Invalid verification token or email")
    
    @classmethod
    def token_expired(cls):
        cls.problem(400, "urn:problem:token-expired", 
                   "Token Expired", "Verification token expired. Please request a new one")

class RateLimiter:
    """Redis-based rate limiting"""
    
    def __init__(self, redis: Redis):
        self.redis = redis
    
    async def check_login_attempts(self, email: str, ip: str, increment: bool = True) -> int:
        """Check and increment login failure count"""
        key = f"login_fail:{email}:{ip}"
        if increment:
            fails = await self.redis.incr(key)
            if fails == 1:
                await self.redis.expire(key, 900)  # 15 minutes
            return fails
        else:
            await self.redis.delete(key)
            return 0
    
    async def check_registration_attempts(self, ip: str) -> bool:
        """Check registration rate limit per IP"""
        key = f"register_rate:{ip}"
        count = await self.redis.incr(key)
        if count == 1:
            await self.redis.expire(key, 3600)  # 1 hour
        return count <= 5  # Max 5 registrations per hour per IP

class AuditLogger:
    """Centralized audit logging"""

    @staticmethod
    async def log_event(
        session: AsyncSession,
        user_id: Optional[UUID],
        event_type: str,
        success: bool,
        ip: str,
        user_agent: str,
        metadata: Optional[dict] = None,
    ):
        try:
            from liderix_api.models.audit import EventLog

            log = EventLog(
                user_id=user_id,
                event_type=event_type,
                success=success,
                ip_address=ip,        # <-- важно: ip_address
                user_agent=user_agent,
                metadata=metadata or {},
                created_at=now_utc(),
            )
            session.add(log)
            await session.commit()
        except Exception as e:
            await session.rollback()
            import logging
            logging.getLogger(__name__).error(f"Audit logging failed: {e}")

            
class TokenWhitelist:
    """Manage refresh token whitelist in Redis"""
    
    def __init__(self, redis: Redis):
        self.redis = redis
        self.ttl = settings.REFRESH_TTL_SEC
    
    async def add(self, user_id: str, jti: str):
        """Add token to whitelist"""
        key = f"refresh_whitelist:{user_id}:{jti}"
        await self.redis.setex(key, self.ttl, "1")
    
    async def exists(self, user_id: str, jti: str) -> bool:
        """Check if token is whitelisted"""
        key = f"refresh_whitelist:{user_id}:{jti}"
        val = await self.redis.get(key)
        return val is not None
    
    async def remove(self, user_id: str, jti: str):
        """Remove token from whitelist"""
        key = f"refresh_whitelist:{user_id}:{jti}"
        await self.redis.delete(key)
    
    async def remove_all_user_tokens(self, user_id: str):
        """Remove all refresh tokens for a user"""
        pattern = f"refresh_whitelist:{user_id}:*"
        async for key in self.redis.scan_iter(match=pattern, count=1000):
            await self.redis.delete(key)

def get_client_info(request) -> tuple[str, str]:
    """Extract client IP and user agent from request"""
    ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    return ip, user_agent