# apps/api/liderix_api/services/auth.py

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict
from uuid import UUID, uuid4

import logging

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError, ExpiredSignatureError
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import NoResultFound

from liderix_api.db import get_async_session
from liderix_api.models.users import User
from liderix_api.config.settings import settings

logger = logging.getLogger(__name__)

# ------------------------------------------------------------------------------
# Password hashing
# ------------------------------------------------------------------------------
_pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Хэширует пароль с использованием bcrypt."""
    return _pwd.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверяет совпадение plain пароля с хэшем."""
    return _pwd.verify(plain_password, hashed_password)


# ------------------------------------------------------------------------------
# OAuth2 (Bearer) — используется на эндпоинте логина
# ------------------------------------------------------------------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/auth/login")


# ------------------------------------------------------------------------------
# JWT helpers
# ------------------------------------------------------------------------------
def _now_ts() -> int:
    """UTC timestamp в секундах."""
    return int(datetime.now(timezone.utc).timestamp())


def _base_claims(ttl_sec: int) -> Dict[str, Any]:
    """
    Общие claims для access/refresh токенов.
    Добавляет: iss, aud, iat, nbf, exp, jti.
    """
    now = _now_ts()
    return {
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
        "iat": now,
        "nbf": now,
        "exp": now + ttl_sec,
        "jti": str(uuid4()),
    }


def create_access_token(payload: Dict[str, Any]) -> str:
    """
    Создаёт access-токен.
    Обязательно передай {"sub": str(user_id)} в payload.
    """
    if "sub" not in payload:
        raise ValueError("Payload must include 'sub'")
    claims = {**_base_claims(settings.ACCESS_TTL_SEC), **payload, "typ": "access"}
    return jwt.encode(claims, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(payload: Dict[str, Any]) -> str:
    """
    Создаёт refresh-токен.
    Обязательно передай {"sub": str(user_id)} в payload.
    """
    if "sub" not in payload:
        raise ValueError("Payload must include 'sub'")
    claims = {**_base_claims(settings.REFRESH_TTL_SEC), **payload, "typ": "refresh"}
    return jwt.encode(claims, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str, *, verify_exp: bool = True) -> Dict[str, Any]:
    """
    Декодирует и валидирует JWT.
    Проверяет: подпись, iss/aud, exp (по флагу), iat/nbf с небольшим leeway.
    Бросает HTTPException 401 на ошибки.
    """
    try:
        return jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_exp": verify_exp},
            audience=settings.JWT_AUDIENCE if settings.JWT_AUDIENCE else None,
            issuer=settings.JWT_ISSUER if settings.JWT_ISSUER else None,
        )
    except ExpiredSignatureError as e:
        logger.warning(f"Expired token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"type": "urn:problem:token-expired", "title": "Token expired", "status": 401},
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError as e:
        logger.warning(f"Invalid token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"type": "urn:problem:invalid-token", "title": "Invalid token", "status": 401},
            headers={"WWW-Authenticate": "Bearer"},
        )


# ------------------------------------------------------------------------------
# Current user dependency (только для access токена)
# ------------------------------------------------------------------------------
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_async_session),
) -> User:
    """
    Извлекает пользователя из access-токена.
    Проверяет: тип "access", sub, существование user, is_active/is_verified.
    Бросает 401/403 на ошибки.
    """
    claims = decode_token(token, verify_exp=True)
    if claims.get("typ") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"type": "urn:problem:invalid-token-type", "title": "Invalid token type", "status": 401},
            headers={"WWW-Authenticate": "Bearer"},
        )
    sub = claims.get("sub")
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"type": "urn:problem:invalid-token", "title": "Invalid token (no sub)", "status": 401},
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        user = (await session.execute(select(User).where(User.id == UUID(sub)))).scalar_one()
    except NoResultFound:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"type": "urn:problem:user-not-found", "title": "User not found", "status": 401},
            headers={"WWW-Authenticate": "Bearer"},
        )

    # мягкое удаление
    if getattr(user, "deleted_at", None):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"type": "urn:problem:user-not-found", "title": "User not found", "status": 401},
            headers={"WWW-Authenticate": "Bearer"},
        )

    if hasattr(user, "is_active") and not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"type": "urn:problem:account-disabled", "title": "Account Disabled", "status": 403},
        )
    if hasattr(user, "is_verified") and not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"type": "urn:problem:unverified", "title": "Email not verified", "status": 403},
        )
    return user


# ------------------------------------------------------------------------------
# Admin guard dependency
# ------------------------------------------------------------------------------
async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Проверяет админ-доступ по полю is_admin.
    Если роли — меняем логику на проверку роли.
    """
    if not getattr(current_user, "is_admin", False):
        logger.warning(f"Admin access denied for user {current_user.id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"type": "urn:problem:access-denied", "title": "Admin access required", "status": 403},
        )
    return current_user


def generate_jwt_token(user_id: str) -> str:
    """Сокращённый хелпер на основе access-токена."""
    return create_access_token({"sub": str(user_id)})