# apps/api/liderix_api/middleware/security.py
from __future__ import annotations

import logging
import time
from typing import Optional
from urllib.parse import urlparse

from fastapi import HTTPException, Request, Response, status
from fastapi.responses import JSONResponse
from redis.asyncio import Redis
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from liderix_api.config.settings import settings

logger = logging.getLogger(__name__)


def _normalize_endpoint(path: str) -> str:
    """
    Приводим путь к виду без API_PREFIX:
    '/api/auth/login' -> '/auth/login'
    """
    prefix = settings.API_PREFIX.rstrip("/")
    if prefix and path.startswith(prefix + "/"):
        return path[len(prefix):]
    return path


class SecurityMiddleware(BaseHTTPMiddleware):
    """
    Security middleware для auth-эндпоинтов.

    Возможности:
    - Rate limiting по IP/endpoint
    - Rapid-fire детекция
    - Базовая CSRF-проверка для state-changing операций
    - Лимит размера тела запроса
    - Заголовки безопасности
    - Метрики в Redis
    """

    def __init__(self, app: ASGIApp):
        super().__init__(app)
        self.redis: Redis = Redis.from_url(settings.REDIS_URL)

        # 🔒 Усиленные лимиты для защиты от bruteforce атак
        self.rate_limits = {
            "/auth/register": {"requests": 5, "window": 3600},      # 5 регистраций в час
            "/auth/login": {"requests": 20, "window": 900},         # 20 попыток входа за 15 минут  
            "/auth/resend-verification": {"requests": 3, "window": 3600},
            "/auth/refresh": {"requests": 50, "window": 3600},      # снижено с 100
            "/auth/verify": {"requests": 10, "window": 3600},       # снижено с 100
            "/auth/logout": {"requests": 30, "window": 3600},       # снижено с 60
            "/auth/password-reset": {"requests": 3, "window": 3600}, # новый лимит
        }

        # 🔒 Более строгие пороги для подозрительных действий
        self.suspicious_thresholds = {
            "rapid_fire_per_minute": 30,      # снижено с 50
            "failed_logins_per_hour": 10,     # снижено с 20
            "registrations_per_hour": 3,      # снижено с 10
        }

        # Макс. размер тела в байтах
        self.max_auth_body_bytes = 1 * 1024 * 1024  # 1 MB

    async def dispatch(self, request: Request, call_next):
        start_ts = time.time()
        raw_path = request.url.path
        path = _normalize_endpoint(raw_path)
        method = request.method
        client_ip = self._get_client_ip(request)

        try:
            if path.startswith("/auth/"):
                await self._pre_auth_checks(request, client_ip, path, method)

            response = await call_next(request)

            if path.startswith("/auth/"):
                await self._post_auth_observe(client_ip, path, response.status_code)

            self._add_security_headers(response, request, path)
            await self._log_metrics(path, method, response.status_code, time.time() - start_ts)
            return response

        except HTTPException:
            raise
        except Exception as e:
            logger.exception("Security middleware error: %s", e)
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"detail": "Internal security error"},
            )

    async def _pre_auth_checks(self, request: Request, client_ip: str, path: str, method: str) -> None:
        await self._check_rate_limit(client_ip, path)
        await self._check_request_size(request)
        await self._check_rapid_fire(client_ip)

        if path == "/auth/register":
            await self._track_registrations(client_ip)
        if method in {"POST", "PUT", "PATCH", "DELETE"}:
            await self._check_csrf(request)

    async def _check_rate_limit(self, client_ip: str, path: str) -> None:
        conf = self.rate_limits.get(path)
        if not conf:
            return
        key = f"rate_limit:{path}:{client_ip}"
        current = await self.redis.incr(key)
        if current == 1:
            await self.redis.expire(key, conf["window"])
        if current > conf["requests"]:
            logger.warning(
                "Rate limit exceeded: ip=%s path=%s (%s/%s)",
                client_ip, path, current, conf["requests"]
            )
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "type": "urn:problem:rate-limit",
                    "title": "Rate Limit Exceeded",
                    "detail": f"Too many requests to {path}. Try again later.",
                    "status": 429,
                },
            )

    async def _check_request_size(self, request: Request) -> None:
        length = request.headers.get("content-length")
        if not length:
            return
        try:
            size = int(length)
        except ValueError:
            return
        if size > self.max_auth_body_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail={
                    "type": "urn:problem:request-too-large",
                    "title": "Request Too Large",
                    "detail": "Request body exceeds maximum allowed size",
                    "status": 413,
                },
            )

    async def _check_rapid_fire(self, client_ip: str) -> None:
        key = f"rapid_fire:{client_ip}"
        count = await self.redis.incr(key)
        if count == 1:
            await self.redis.expire(key, 60)
        if count > self.suspicious_thresholds["rapid_fire_per_minute"]:
            logger.warning("Rapid fire detected: ip=%s count=%s/min", client_ip, count)
            await self._flag_suspicious_ip(client_ip, "rapid_fire")

    async def _track_registrations(self, client_ip: str) -> None:
        key = f"registrations:{client_ip}"
        count = await self.redis.incr(key)
        if count == 1:
            await self.redis.expire(key, 3600)
        if count > self.suspicious_thresholds["registrations_per_hour"]:
            logger.warning("Excessive registrations: ip=%s count=%s/h", client_ip, count)
            await self._flag_suspicious_ip(client_ip, "excessive_registrations")

    async def _check_csrf(self, request: Request) -> None:
        # Разрешаем AJAX/JSON
        if request.headers.get("x-requested-with") == "XMLHttpRequest":
            return
        if request.headers.get("content-type", "").startswith("application/json"):
            return
        if request.headers.get("authorization"):
            return
        if request.url.path.startswith("/api/"):
            return
    
    

        origin = request.headers.get("origin")
        referer = request.headers.get("referer")
        allowed = set(settings.CORS_ALLOW_ORIGINS or []) | {settings.FRONTEND_URL}

        def _host_ok(url: Optional[str]) -> bool:
            if not url:
                return False
            try:
                host = urlparse(url).netloc
            except Exception:
                return False
            if url in allowed:
                return True
            for a in allowed:
                try:
                    ah = urlparse(a).netloc
                except Exception:
                    continue
                if ah and (host == ah or host.endswith("." + ah.lstrip("."))):
                    return True
            return False

        if origin and _host_ok(origin):
            return
        if referer and _host_ok(referer):
            return

        logger.warning("CSRF validation failed: origin=%s referer=%s", origin, referer)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "type": "urn:problem:csrf-validation-failed",
                "title": "CSRF Validation Failed",
                "detail": "Request failed CSRF validation",
                "status": 403,
            },
        )

    async def _post_auth_observe(self, client_ip: str, path: str, status_code: int) -> None:
        if path in {"/auth/login", "/auth/verify"} and status_code in (401, 403):
            key = f"auth_failures:{client_ip}"
            fails = await self.redis.incr(key)
            if fails == 1:
                await self.redis.expire(key, 3600)
            if fails > self.suspicious_thresholds["failed_logins_per_hour"]:
                logger.warning("Excessive auth failures: ip=%s fails=%s", client_ip, fails)
                await self._flag_suspicious_ip(client_ip, "excessive_auth_failures")
        elif path == "/auth/login" and status_code == 200:
            await self.redis.delete(f"auth_failures:{client_ip}")

    def _get_client_ip(self, request: Request) -> str:
        xff = request.headers.get("x-forwarded-for")
        if xff:
            return xff.split(",")[0].strip()
        xri = request.headers.get("x-real-ip")
        if xri:
            return xri
        return request.client.host if request.client else "unknown"

    async def _flag_suspicious_ip(self, client_ip: str, reason: str) -> None:
        key = f"suspicious_ip:{client_ip}"
        await self.redis.setex(key, 3600, reason)
        logger.error("Suspicious IP flagged: ip=%s reason=%s", client_ip, reason)

    def _add_security_headers(self, response: Response, request: Request, path: str) -> None:
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        if path.startswith("/auth/"):
            csp = (
                "default-src 'none'; "
                "img-src 'self' data: https:; "
                "style-src 'self' 'unsafe-inline'; "
                "script-src 'self' 'unsafe-inline'; "
                "connect-src 'self'; "
                "frame-ancestors 'none';"
            )
            response.headers["Content-Security-Policy"] = csp

    async def _log_metrics(self, path: str, method: str, status_code: int, dt: float) -> None:
        key = f"metrics:{path}:{method}"
        await self.redis.hincrby(key, "count", 1)
        await self.redis.hincrby(key, f"status_{status_code}", 1)
        avg_key = f"{key}:avg_time"
        cur = await self.redis.get(avg_key)
        try:
            new_avg = (float(cur) + dt) / 2.0 if cur else dt
        except Exception:
            new_avg = dt
        await self.redis.setex(avg_key, 3600, str(new_avg))
        await self.redis.expire(key, 86400)


def add_security_middleware(app: ASGIApp) -> None:
    """Подключение middleware к приложению FastAPI."""
    app.add_middleware(SecurityMiddleware)