import logging
import uuid
import asyncio
import inspect
from typing import Optional, AsyncGenerator
from fastapi import FastAPI, Depends, HTTPException, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession, AsyncEngine, create_async_engine
from sqlalchemy.orm import sessionmaker
from liderix_api.config.settings import settings
from liderix_api.db import get_async_session as core_get_async_session
from liderix_api.middleware.security import add_security_middleware

logger = logging.getLogger("uvicorn.error")

# -----------------------------------------------------------------------------
# Приложение
# -----------------------------------------------------------------------------
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/openapi.json",
)

# -----------------------------------------------------------------------------
# CORS — production-ready with environment configuration
# -----------------------------------------------------------------------------
# Default localhost origins for development
DEFAULT_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
]

# Use environment CORS_ALLOW_ORIGINS if available, otherwise fallback to defaults
ALLOWED_ORIGINS = getattr(settings, 'CORS_ALLOW_ORIGINS', DEFAULT_ORIGINS)

# If CORS_ALLOW_ORIGINS is a string, parse it appropriately
if isinstance(ALLOWED_ORIGINS, str):
    if ALLOWED_ORIGINS.strip() == "*":
        ALLOWED_ORIGINS = ["*"]
    else:
        try:
            import json
            ALLOWED_ORIGINS = json.loads(ALLOWED_ORIGINS)
        except (json.JSONDecodeError, TypeError):
            # Try comma-separated format
            ALLOWED_ORIGINS = [s.strip() for s in ALLOWED_ORIGINS.split(",") if s.strip()]
            if not ALLOWED_ORIGINS:
                logger.warning(f"Failed to parse CORS_ALLOW_ORIGINS: {ALLOWED_ORIGINS}, using defaults")
                ALLOWED_ORIGINS = DEFAULT_ORIGINS

logger.info(f"CORS allowed origins: {ALLOWED_ORIGINS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "Content-Type", "Authorization"],
)

# Security middleware - включаем для продакшена
add_security_middleware(app)

# -----------------------------------------------------------------------------
# БД: основная (Liderix) - с улучшенной обработкой ошибок
# -----------------------------------------------------------------------------
if not settings.LIDERIX_DB_URL:
    raise RuntimeError("LIDERIX_DB_URL is not configured")

try:
    engine_liderix: AsyncEngine = create_async_engine(
        settings.LIDERIX_DB_URL,
        echo=False,
        pool_pre_ping=True,
        pool_size=getattr(settings, "DB_POOL_SIZE", 5),
        max_overflow=getattr(settings, "DB_MAX_OVERFLOW", 10),
        # Дополнительные настройки для стабильности
        pool_timeout=30,
        pool_recycle=3600,
    )
    SessionLiderix = sessionmaker(engine_liderix, class_=AsyncSession, expire_on_commit=False)
except Exception as e:
    logger.error(f"Failed to create primary database engine: {e}")
    raise

async def get_liderix_session() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLiderix() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database session error: {e}")
            try:
                await session.rollback()
            except:
                pass  # Игнорируем ошибки rollback
            raise
        finally:
            try:
                await session.close()
            except:
                pass  # Игнорируем ошибки закрытия

# -----------------------------------------------------------------------------
# БД: клиентская (ITSTEP) - с улучшенной обработкой
# -----------------------------------------------------------------------------
engine_itstep: Optional[AsyncEngine] = None
SessionItstep: Optional[sessionmaker] = None

if settings.ITSTEP_DB_URL:
    try:
        engine_itstep = create_async_engine(
            settings.ITSTEP_DB_URL,
            echo=False,
            pool_pre_ping=True,
            pool_size=getattr(settings, "CLIENT_DB_POOL_SIZE", 3),
            max_overflow=getattr(settings, "CLIENT_DB_MAX_OVERFLOW", 5),
            pool_timeout=20,
            pool_recycle=3600,
        )
        SessionItstep = sessionmaker(engine_itstep, class_=AsyncSession, expire_on_commit=False)
        logger.info("Client DB (ITSTEP) engine created successfully")
    except Exception as e:
        logger.error(f"Failed to create client database engine: {e}")
        engine_itstep = None
        SessionItstep = None
else:
    logger.warning("ITSTEP_DB_URL is not set — client analytics routes will return 503.")

async def get_itstep_session() -> AsyncGenerator[AsyncSession, None]:
    if SessionItstep is None:
        raise HTTPException(status_code=503, detail="Client DB is not configured")
    
    async with SessionItstep() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Client database session error: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()

# -----------------------------------------------------------------------------
# Middleware: Suppress audit logs for auth errors
# -----------------------------------------------------------------------------
@app.middleware("http") 
async def suppress_auth_audit_errors(request: Request, call_next):
    """Подавляем аудит логи для auth ошибок чтобы избежать DB constraint ошибок"""
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        # Если это auth related ошибка, не логируем в audit
        if "auth" in str(request.url).lower() and ("401" in str(e) or "refresh" in str(e).lower()):
            logger.warning(f"Auth error suppressed for audit: {e}")
        raise


# -----------------------------------------------------------------------------
# Middleware: X-Request-ID
# -----------------------------------------------------------------------------
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    request.state.request_id = request_id
    
    try:
        response: Response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response
    except Exception as e:
        logger.error(f"Request {request_id} failed: {e}")
        raise

# -----------------------------------------------------------------------------
# События приложения - улучшенные с retry логикой
# -----------------------------------------------------------------------------
@app.on_event("startup")
async def on_startup():
    logger.info("Starting application...")
    
    # Warmup primary DB с retry
    max_retries = 3
    for attempt in range(max_retries):
        try:
            async with engine_liderix.begin() as conn:
                await conn.run_sync(lambda *_: None)
            logger.info("Primary DB connection is warm.")
            break
        except Exception as e:
            logger.error(f"Primary DB warmup failed (attempt {attempt + 1}): {e}")
            if attempt == max_retries - 1:
                logger.critical("Primary DB warmup failed after all retries")
                raise
            await asyncio.sleep(2)
    
    # Warmup client DB (не критично)
    if engine_itstep is not None:
        try:
            async with engine_itstep.begin() as conn:
                await conn.run_sync(lambda *_: None)
            logger.info("Client DB (ITSTEP) connection is warm.")
        except Exception as e:
            logger.warning(f"Client DB (ITSTEP) warmup failed: {e}")
    
    # Глобальная подмена зависимости
    app.dependency_overrides[core_get_async_session] = get_liderix_session
    logger.info("Application startup completed.")

@app.on_event("shutdown")
async def on_shutdown():
    logger.info("Shutting down application...")
    
    try:
        await engine_liderix.dispose()
        logger.info("Primary DB connections disposed.")
    except Exception as e:
        logger.warning(f"Dispose primary DB error: {e}")
    
    if engine_itstep is not None:
        try:
            await engine_itstep.dispose()
            logger.info("Client DB connections disposed.")
        except Exception as e:
            logger.warning(f"Dispose client DB error: {e}")
    
    logger.info("Application shutdown completed.")

# -----------------------------------------------------------------------------
# Health checks - улучшенные для Docker
# -----------------------------------------------------------------------------
@app.get("/health", tags=["System"])
async def health():
    """Простая проверка живости для Docker healthcheck"""
    return {"status": "ok", "timestamp": uuid.uuid4().hex[:8]}

@app.get("/health/live", tags=["System"])
async def liveness():
    """Liveness probe для Kubernetes/Docker"""
    return {"status": "alive"}

@app.get("/health/ready", tags=["System"])
async def readiness():
    """Детальная проверка готовности"""
    checks = {}
    overall_status = "ready"
    
    # Проверка основной БД
    try:
        async with engine_liderix.begin() as conn:
            await conn.run_sync(lambda *_: None)
        checks["primary_db"] = {"status": "healthy", "type": "postgresql"}
    except Exception as e:
        checks["primary_db"] = {"status": "unhealthy", "error": str(e)[:100]}
        overall_status = "degraded"
    
    # Проверка клиентской БД
    if engine_itstep is not None:
        try:
            async with engine_itstep.begin() as conn:
                await conn.run_sync(lambda *_: None)
            checks["client_db"] = {"status": "healthy", "type": "postgresql"}
        except Exception as e:
            checks["client_db"] = {"status": "unhealthy", "error": str(e)[:100]}
            # Клиентская БД не критична для основной работы
    else:
        checks["client_db"] = {"status": "not_configured"}
    
    return {
        "status": overall_status,
        "checks": checks,
        "timestamp": uuid.uuid4().hex[:8]
    }

# -----------------------------------------------------------------------------
# Подключение роутеров
# -----------------------------------------------------------------------------
PREFIX = (getattr(settings, "API_PREFIX", "/api") or "/api").rstrip("/")

# --- базовые (основная БД) ---
from liderix_api.routes import (
    users as users_router,
    client as client_router,
    projects as projects_router,
    tasks as tasks_router,
    okrs as okrs_router,
    kpis as kpis_router,
    auth as auth_router,
    analytics as analytics_router,
)

# Подключение роутеров
app.include_router(users_router.router, prefix=PREFIX, tags=["Users"])
app.include_router(client_router.router, prefix=PREFIX, tags=["Clients"])
app.include_router(projects_router.router, prefix=PREFIX, tags=["Projects"])
app.include_router(tasks_router.router, prefix=PREFIX, tags=["Tasks"])
app.include_router(okrs_router.router, prefix=PREFIX, tags=["OKRs"])
app.include_router(kpis_router.router, prefix=PREFIX, tags=["KPIs"])
app.include_router(auth_router.router, prefix=PREFIX, tags=["Auth"])
app.include_router(analytics_router.router, prefix=PREFIX, tags=["Analytics"])

# -----------------------------------------------------------------------------
# Улучшенная аутентификация с fallback
# -----------------------------------------------------------------------------
_bearer = HTTPBearer(auto_error=False)

def _get_jwt_secret_and_opts():
    """Получение JWT настроек с fallback"""
    secret = (
        getattr(settings, "ACCESS_TOKEN_SECRET", None)
        or getattr(settings, "JWT_SECRET", None)
        or getattr(settings, "SECRET_KEY", None)
    )
    alg = getattr(settings, "JWT_ALGORITHM", "HS256")
    aud = getattr(settings, "JWT_AUDIENCE", None)
    iss = getattr(settings, "JWT_ISSUER", None)
    return secret, alg, aud, iss

async def _get_current_user_from_bearer(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
):
    """
    Безопасная аутентификация через JWT токен
    Удален fallback для production безопасности
    """
    if not credentials:
        logger.error("No authorization header provided")
        raise HTTPException(
            status_code=401, 
            detail="Authorization header required",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = credentials.credentials
    secret, alg, aud, iss = _get_jwt_secret_and_opts()

    if not secret:
        logger.error("JWT secret is not configured")
        raise HTTPException(
            status_code=500, 
            detail="Server configuration error"
        )

    try:
        options = {"verify_aud": False if not aud else True}
        payload = jwt.decode(
            token,
            secret,
            algorithms=[alg],
            audience=aud,
            issuer=iss,
            options=options,
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

    # Создаем минимальный user объект
    class _MiniUser:
        def __init__(self, payload):
            self.id = payload.get("user_id") or payload.get("sub")
            self.email = payload.get("email")
            self.full_name = payload.get("name") or payload.get("username")
            self.is_active = True
            self.roles = payload.get("roles", [])

    return _MiniUser(payload)

# Импорт основной аутентификации
try:
    from liderix_api.routes.auth.deps import get_current_user as _get_current_user
except ImportError:
    try:
        from liderix_api.routes.auth.utils import get_current_user as _get_current_user
    except ImportError:
        _get_current_user = None
        logger.warning("No primary auth dependency found, using fallback only")

async def _composite_current_user(request: Request):
    """Композитная аутентификация: основная + fallback"""
    if _get_current_user:
        try:
            # Проверяем сигнатуру функции
            sig = inspect.signature(_get_current_user)
            if 'request' in sig.parameters:
                return await _get_current_user(request)
            else:
                # Если это dependency, создаем временный объект
                return await _get_current_user()
        except HTTPException:
            raise  # Перебрасываем HTTP исключения как есть
        except Exception as e:
            logger.warning(f"Primary auth failed, using fallback: {e}")
            # Fallback к header-based auth
            bearer_creds = await _bearer(request)
            return await _get_current_user_from_bearer(bearer_creds)
    
    # Только fallback
    bearer_creds = await _bearer(request)
    return await _get_current_user_from_bearer(bearer_creds)

# -----------------------------------------------------------------------------
# /users/me endpoint
# -----------------------------------------------------------------------------
try:
    from pydantic import BaseModel as _BaseModel
except ImportError:
    _BaseModel = object

class _UserMeResponse(_BaseModel):
    id: str
    email: str
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    avatar_url: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    last_login_at: Optional[str] = None

@app.get(f"{PREFIX}/users/me", tags=["Users"], response_model=_UserMeResponse, name="users:me")
async def get_me(request: Request):
    """Получение информации о текущем пользователе - для тестирования без токена"""
    try:
        # Пытаемся получить пользователя через auth
        current_user = await _composite_current_user(request)
        return {
            "id": str(getattr(current_user, "id", "")),
            "email": getattr(current_user, "email", ""),
            "username": getattr(current_user, "username", None),
            "full_name": (
                getattr(current_user, "full_name", None) 
                or getattr(current_user, "name", None)
            ),
            "is_active": getattr(current_user, "is_active", True),
            "is_verified": getattr(current_user, "is_verified", True),
            "avatar_url": getattr(current_user, "avatar_url", None),
            "created_at": str(getattr(current_user, "created_at", "")) if getattr(current_user, "created_at", None) else None,
            "updated_at": str(getattr(current_user, "updated_at", "")) if getattr(current_user, "updated_at", None) else None,
            "last_login_at": str(getattr(current_user, "last_login_at", "")) if getattr(current_user, "last_login_at", None) else None,
        }
    except Exception as e:
        logger.warning(f"Auth failed for /users/me: {e}")
        raise HTTPException(
            status_code=401, 
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"}
        )

# -----------------------------------------------------------------------------
# Клиентские роутеры с правильными зависимостями
# -----------------------------------------------------------------------------
from liderix_api.routes.dashboard import overview as dashboard_router
from liderix_api.routes.analytics import sales as sales_router

app.include_router(
    dashboard_router.router,
    prefix=f"{PREFIX}/dashboard",
    tags=["Dashboard"],
    dependencies=[Depends(get_itstep_session)],
)

app.include_router(
    sales_router.router,
    prefix=f"{PREFIX}/analytics/sales",
    tags=["Client Analytics"],
    dependencies=[Depends(get_itstep_session)],
)

# --- Опциональные модули ---
# AI инсайты
try:
    from liderix_api.routes.insights.sales.route import router as insights_sales_router
    app.include_router(
        insights_sales_router, 
        prefix=f"{PREFIX}/insights/sales", 
        tags=["AI Insights"]
    )
    logger.info("AI Insights routes loaded successfully")
except ImportError as e:
    logger.warning(f"Insights routes not loaded: {e}")

# Организационная структура
try:
    from liderix_api.routes.org_structure import (
        org_router,
        departments_router,
        memberships_router,
        invitations_router,
    )
    app.include_router(org_router, prefix=PREFIX, tags=["Organizations"])
    app.include_router(departments_router, prefix=PREFIX, tags=["Departments"])
    app.include_router(memberships_router, prefix=PREFIX, tags=["Memberships"])
    app.include_router(invitations_router, prefix=PREFIX, tags=["Invitations"])
    logger.info("Organization structure routes loaded successfully")
except ImportError as e:
    logger.warning(f"Org-structure routes not loaded: {e}")

# -----------------------------------------------------------------------------
# Временные тестовые эндпоинты для отладки
# -----------------------------------------------------------------------------
@app.get(f"{PREFIX}/test", tags=["Test"])
async def test_endpoint():
    """Тестовый эндпоинт для проверки CORS"""
    return {"message": "Test successful", "cors": "working"}

@app.post(f"{PREFIX}/auth/test-login", tags=["Test"])
async def test_login():
    """Тестовый логин для отладки"""
    return {
        "access_token": "test-token",
        "token_type": "bearer",
        "user": {
            "id": "test-user",
            "email": "test@example.com",
            "full_name": "Test User"
        }
    }

# -----------------------------------------------------------------------------
# Error handlers для стандартизации ответов
# -----------------------------------------------------------------------------
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from fastapi.requests import Request as FastAPIRequest
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError

@app.exception_handler(HTTPException)
async def http_exception_handler(request: FastAPIRequest, exc: HTTPException):
    """Стандартизированный обработчик HTTP исключений"""
    # Если detail уже в правильном формате (dict), используем как есть
    if isinstance(exc.detail, dict) and "type" in exc.detail:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )
    
    # Создаем стандартный формат для простых строковых ошибок
    error_detail = {
        "type": "urn:problem:http-error",
        "title": _get_error_title(exc.status_code),
        "detail": str(exc.detail),
        "status": exc.status_code,
    }
    
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": error_detail}
    )

def _get_error_title(status_code: int) -> str:
    """Получение заголовка ошибки по коду статуса"""
    titles = {
        400: "Bad Request",
        401: "Unauthorized", 
        403: "Forbidden",
        404: "Not Found",
        422: "Validation Error",
        429: "Too Many Requests",
        500: "Internal Server Error",
    }
    return titles.get(status_code, "HTTP Error")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: FastAPIRequest, exc: RequestValidationError):
    """Обработчик ошибок валидации запросов"""
    # Сериализуем ошибки в безопасный формат
    errors = []
    for error in exc.errors():
        safe_error = {
            "type": error.get("type", "unknown"),
            "loc": list(error.get("loc", [])),
            "msg": str(error.get("msg", "")),
            "input": str(error.get("input", ""))[:100] if error.get("input") is not None else None
        }
        errors.append(safe_error)
    
    error_detail = {
        "type": "urn:problem:validation-error",
        "title": "Validation Error",
        "detail": "Request validation failed",
        "status": 422,
        "errors": errors
    }
    
    return JSONResponse(
        status_code=422,
        content={"detail": error_detail}
    )

# -----------------------------------------------------------------------------
# Fallback для неизвестных маршрутов API
# -----------------------------------------------------------------------------
@app.api_route(f"{PREFIX}/{{path:path}}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def api_fallback(path: str):
    """Fallback для неизвестных API маршрутов"""
    raise HTTPException(
        status_code=404, 
        detail=f"API endpoint /{path} not found"
    )

logger.info(f"Application configured with prefix: {PREFIX}")