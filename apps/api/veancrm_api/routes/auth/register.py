from __future__ import annotations

from datetime import timedelta
from typing import Optional
from uuid import uuid4
import secrets as _secrets

from fastapi import APIRouter, Depends, BackgroundTasks, Query, Response, Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from redis.asyncio import Redis

# --- безопасная инициализация resend ---
try:
    import resend  # type: ignore
    _RESEND_AVAILABLE = True
except Exception:
    resend = None  # type: ignore
    _RESEND_AVAILABLE = False

from liderix_api.db import get_async_session
from liderix_api.models.users import User
from liderix_api.schemas.auth import RegisterSchema, VerifySchema, ResendSchema
from liderix_api.services.auth import hash_password
from liderix_api.config.settings import settings
from .utils import (
    now_utc,
    sha256_hex,
    normalize_email,
    validate_password,
    validate_username,
    AuthError,
    RateLimiter,
    AuditLogger,
    get_client_info,
)

class MessageResponse(BaseModel):
    message: str

router = APIRouter(tags=["Auth"])
redis = Redis.from_url(settings.REDIS_URL)
rate_limiter = RateLimiter(redis)


async def send_verification_email_async(email: str, username: str, token: str) -> None:
    """Отправка письма подтверждения (с безопасным фолбэком, чтобы не падать при ошибках)."""
    import logging
    logger = logging.getLogger(__name__)
    link = f"{settings.FRONTEND_URL}/verify-email?token={token}&email={email}"

    if not _RESEND_AVAILABLE or not settings.RESEND_API_KEY:
        logger.warning("Resend is not available or API key is missing; skipping email to %s", email)
        return

    try:
        resend.api_key = settings.RESEND_API_KEY
        resend.Emails.send({  # type: ignore[attr-defined]
            "from": settings.EMAIL_FROM,
            "to": email,
            "subject": "Verify your Liderix account",
            "html": f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Welcome to Liderix, {username}!</h1>
                <p>Thank you for creating an account. Please verify your email address to get started.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{link}"
                       style="background-color: #007bff; color: white; padding: 12px 24px;
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        Verify Email Address
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    If the button doesn't work, copy and paste this link: {link}
                </p>
                <p style="color: #666; font-size: 14px;">
                    This link will expire in 48 hours.
                </p>
            </div>
            """,
        })
    except Exception as e:
        logger.error("Failed to send verification email to %s: %s", email, e)


@router.post("/register", response_model=MessageResponse, status_code=201)
async def register(
    data: RegisterSchema,
    request: Request,
    background: BackgroundTasks,
    response: Response,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Регистрация пользователя с валидациями/лимитами и отправкой письма подтверждения.
    """
    ip, user_agent = get_client_info(request)

    # Rate limiting
    if not await rate_limiter.check_registration_attempts(ip):
        await AuditLogger.log_event(session, None, "auth.register.rate_limited", False, ip, user_agent)
        AuthError.problem(
            429,
            "urn:problem:registration-rate-limit",
            "Too Many Registrations",
            "Too many registration attempts. Please try again later.",
        )

    # Нормализация/валидация
    email = normalize_email(data.email)
    username = data.username.strip()

    ok, err = validate_password(data.password)
    if not ok:
        await AuditLogger.log_event(
            session, None, "auth.register.weak_password", False, ip, user_agent, {"email": email, "error": err}
        )
        AuthError.problem(400, "urn:problem:weak-password", "Weak Password", err)

    uok, uerr = validate_username(username)
    if not uok:
        await AuditLogger.log_event(
            session, None, "auth.register.invalid_username", False, ip, user_agent, {"username": username, "error": uerr}
        )
        AuthError.problem(400, "urn:problem:invalid-username", "Invalid Username", uerr)

    # Токен подтверждения
    token = _secrets.token_urlsafe(32)
    token_hash = sha256_hex(token)
    expires_at = now_utc() + timedelta(hours=48)

    try:
        async with session.begin():
            existing = await session.scalar(select(User).where(User.email == email))

            if existing and existing.is_verified:
                await AuditLogger.log_event(
                    session, existing.id, "auth.register.duplicate_email", False, ip, user_agent, {"email": email}
                )
                AuthError.duplicate_email()

            # Проверка уникальности username среди верифицированных
            existing_username = await session.scalar(
                select(User).where(User.username == username, User.is_verified == True)  # noqa: E712
            )
            if existing_username:
                await AuditLogger.log_event(
                    session, None, "auth.register.duplicate_username", False, ip, user_agent, {"username": username}
                )
                AuthError.problem(409, "urn:problem:duplicate-username", "Username Taken", "This username is already taken")

            if not existing:
                user = User(
                    id=uuid4(),
                    username=username,
                    email=email,
                    hashed_password=hash_password(data.password),
                    client_id=data.client_id,
                    is_verified=False,
                    is_active=True,
                    verification_token_hash=token_hash,
                    verification_token_expires_at=expires_at,
                    created_at=now_utc(),
                )
                session.add(user)
            else:
                await session.execute(
                    update(User)
                    .where(User.id == existing.id, User.is_verified == False)  # noqa: E712
                    .values(
                        username=username,  # допускаем смену имени до верификации
                        hashed_password=hash_password(data.password),
                        verification_token_hash=token_hash,
                        verification_token_expires_at=expires_at,
                        updated_at=now_utc(),
                    )
                )
                user = existing

    except IntegrityError as e:
        await AuditLogger.log_event(
            session, None, "auth.register.integrity_error", False, ip, user_agent, {"email": email, "error": str(e)}
        )
        low = str(e).lower()
        if "email" in low:
            AuthError.duplicate_email()
        elif "username" in low:
            AuthError.problem(409, "urn:problem:duplicate-username", "Username Taken", "This username is already taken")
        else:
            AuthError.problem(500, "urn:problem:database-error", "Registration Failed", "Unable to create account")

    # Location
    response.headers["Location"] = f"/api/users/{user.id}"

    # Отправка письма — в фоне
    final_username = username if not existing else existing.username  # type: ignore[has-type]
    background.add_task(send_verification_email_async, email, final_username, token)

    await AuditLogger.log_event(
        session, user.id, "auth.register.success", True, ip, user_agent, {"email": email, "username": username}
    )

    return MessageResponse(message="Account created successfully! Please check your email to verify your account.")


@router.get("/verify", response_model=MessageResponse)
async def verify_email(
    request: Request,
    token: str = Query(..., description="Verification token"),
    email: str = Query(..., description="Email address"),
    session: AsyncSession = Depends(get_async_session),
):
    """Verify email address using GET endpoint"""
    return await _verify_email_logic(token, email, request, session)


@router.post("/verify", response_model=MessageResponse)
async def verify_email_post(
    data: VerifySchema,
    request: Request,
    session: AsyncSession = Depends(get_async_session),
):
    """Verify email address using POST endpoint"""
    return await _verify_email_logic(data.token, data.email, request, session)


async def _verify_email_logic(
    token: str,
    email: str,
    request: Request,
    session: AsyncSession,
) -> MessageResponse:
    """Общая логика подтверждения email."""
    ip, user_agent = get_client_info(request)
    email = normalize_email(email)
    token_hash = sha256_hex(token)

    async with session.begin():
        user = await session.scalar(select(User).where(User.email == email))

        if not user or not user.verification_token_hash:
            await AuditLogger.log_event(
                session, None, "auth.verify.invalid_token", False, ip, user_agent, {"email": email}
            )
            AuthError.invalid_token()

        if user.is_verified:
            await AuditLogger.log_event(
                session, user.id, "auth.verify.already_verified", True, ip, user_agent, {"email": email}
            )
            return MessageResponse(message="Email already verified. You can now log in.")

        # Проверка наличия и совпадения токена
        if not user.verification_token_hash or not user.verification_token_expires_at:
            await AuditLogger.log_event(session, user.id, "auth.verify.no_token", False, ip, user_agent, {"email": email})
            AuthError.invalid_token()

        if not _secrets.compare_digest(user.verification_token_hash, token_hash):
            await AuditLogger.log_event(
                session, user.id, "auth.verify.wrong_token", False, ip, user_agent, {"email": email}
            )
            AuthError.invalid_token()

        if user.verification_token_expires_at < now_utc():
            await AuditLogger.log_event(
                session, user.id, "auth.verify.expired_token", False, ip, user_agent, {"email": email}
            )
            AuthError.token_expired()

        await session.execute(
            update(User)
            .where(User.id == user.id)
            .values(
                is_verified=True,
                verification_token_hash=None,
                verification_token_expires_at=None,
                verified_at=now_utc(),
                updated_at=now_utc(),
            )
        )

    await AuditLogger.log_event(session, user.id, "auth.verify.success", True, ip, user_agent, {"email": email})
    return MessageResponse(message="Email verified successfully! You can now log in to your account.")


@router.post("/resend-verification", response_model=MessageResponse)
async def resend_verification(
    data: ResendSchema,
    request: Request,
    background: BackgroundTasks,
    session: AsyncSession = Depends(get_async_session),
):
    """Повторная отправка письма подтверждения с rate limit."""
    ip, user_agent = get_client_info(request)
    email = normalize_email(data.email)

    # Rate limit (3/час)
    resend_key = f"resend_verification:{email}"
    resend_count = await redis.incr(resend_key)
    if resend_count == 1:
        await redis.expire(resend_key, 3600)

    if resend_count > 3:
        await AuditLogger.log_event(
            session, None, "auth.resend.rate_limited", False, ip, user_agent, {"email": email}
        )
        AuthError.problem(
            429, "urn:problem:resend-rate-limit", "Too Many Requests", "Too many resend attempts. Please try again later."
        )

    user = await session.scalar(select(User).where(User.email == email))

    # Унифицированный ответ для безопасности
    generic = MessageResponse(
        message="If this email exists and is not verified, a new verification link has been sent."
    )

    if not user or user.is_verified:
        await AuditLogger.log_event(
            session,
            user.id if user else None,
            "auth.resend.no_action",
            True,
            ip,
            user_agent,
            {"email": email, "reason": "verified_or_not_found"},
        )
        return generic

    # Новый токен
    token = _secrets.token_urlsafe(32)
    token_hash = sha256_hex(token)
    expires_at = now_utc() + timedelta(hours=48)

    async with session.begin():
        await session.execute(
            update(User)
            .where(User.id == user.id, User.is_verified == False)  # noqa: E712
            .values(
                verification_token_hash=token_hash,
                verification_token_expires_at=expires_at,
                updated_at=now_utc(),
            )
        )

    background.add_task(send_verification_email_async, email, user.username, token)

    await AuditLogger.log_event(session, user.id, "auth.resend.success", True, ip, user_agent, {"email": email})
    return generic