from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Literal, Optional, Tuple
from uuid import uuid4

from fastapi import HTTPException, status
from jose import jwt, JWTError, ExpiredSignatureError

from liderix_api.config.settings import settings

TokenType = Literal["access", "refresh"]

# ---------------------------------------------------------------------------
# Внутренние утилиты
# ---------------------------------------------------------------------------

def _now_ts() -> int:
    return int(datetime.now(timezone.utc).timestamp())

def _base_claims(ttl_sec: int, typ: TokenType) -> Dict[str, Any]:
    now = _now_ts()
    return {
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
        "iat": now,
        "nbf": now,
        "exp": now + ttl_sec,
        "jti": str(uuid4()),
        "typ": typ,
    }

def _unauth(type_: str, title: str, detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"type": type_, "title": title, "detail": detail, "status": 401},
        headers={"WWW-Authenticate": "Bearer"},
    )

# ---------------------------------------------------------------------------
# Генерация токенов
# ---------------------------------------------------------------------------

def create_access_token(*, sub: str, extra: Optional[Dict[str, Any]] = None) -> Tuple[str, int]:
    """
    Создаёт access JWT. Возвращает (token, expires_in_sec).
    Требуется sub = строковый UUID пользователя.
    """
    claims = _base_claims(settings.ACCESS_TTL_SEC, "access")
    claims["sub"] = sub
    if extra:
        claims.update(extra)
    token = jwt.encode(claims, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token, settings.ACCESS_TTL_SEC

def create_refresh_token(*, sub: str, extra: Optional[Dict[str, Any]] = None) -> Tuple[str, str, int]:
    """
    Создаёт refresh JWT. Возвращает (token, jti, expires_in_sec).
    jti пригодится для whitelisting/ревокации в Redis.
    """
    claims = _base_claims(settings.REFRESH_TTL_SEC, "refresh")
    claims["sub"] = sub
    if extra:
        claims.update(extra)
    token = jwt.encode(claims, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token, claims["jti"], settings.REFRESH_TTL_SEC

def create_token_pair(
    *, sub: str, access_extra: Optional[Dict[str, Any]] = None, refresh_extra: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Удобный хелпер: сразу пара токенов для логина/рефреша.
    """
    access, access_ttl = create_access_token(sub=sub, extra=access_extra)
    refresh, refresh_jti, refresh_ttl = create_refresh_token(sub=sub, extra=refresh_extra)
    return {
        "access_token": access,
        "access_expires_in": access_ttl,
        "refresh_token": refresh,
        "refresh_jti": refresh_jti,
        "refresh_expires_in": refresh_ttl,
        "token_type": "bearer",
    }

# ---------------------------------------------------------------------------
# Декодирование/проверка
# ---------------------------------------------------------------------------

def decode_token(token: str, *, expect_typ: Optional[TokenType] = None, verify_exp: bool = True) -> Dict[str, Any]:
    """
    Декодирует и валидирует JWT. Бросает HTTPException(401) на ошибках.
    Можно указать expect_typ="access"/"refresh" для жёсткой проверки типа.
    """
    try:
        # Важно: leeway — отдельный аргумент jose.jwt.decode, не часть options
        claims = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_exp": verify_exp},
            audience=settings.JWT_AUDIENCE if settings.JWT_AUDIENCE else None,
            issuer=settings.JWT_ISSUER if settings.JWT_ISSUER else None,
        )
    except ExpiredSignatureError:
        raise _unauth("urn:problem:token-expired", "Token expired", "The token has expired")
    except JWTError:
        raise _unauth("urn:problem:invalid-token", "Invalid token", "The token is invalid")

    if expect_typ and claims.get("typ") != expect_typ:
        raise _unauth("urn:problem:invalid-token-type", "Invalid token type", "Unexpected token type")

    return claims

def try_decode_token(token: str, *, expect_typ: Optional[TokenType] = None) -> Optional[Dict[str, Any]]:
    """
    «Мягкая» версия: возвращает claims или None, исключений не бросает.
    Удобно для внутренних проверок без возврата 401 пользователю.
    """
    try:
        return decode_token(token, expect_typ=expect_typ)
    except HTTPException:
        return None