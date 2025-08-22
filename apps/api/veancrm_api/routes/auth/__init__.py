# apps/api/liderix_api/routes/auth/__init__.py

from fastapi import APIRouter

from liderix_api.routes.auth.register import router as register_router
from liderix_api.routes.auth.login import router as login_router
from liderix_api.routes.auth.refresh import router as refresh_router
from liderix_api.routes.auth.password_reset import router as password_reset_router
from liderix_api.routes.auth.monitoring import router as monitoring_router

router = APIRouter(tags=["Authentication"])

router.include_router(register_router, prefix="", tags=["Registration"])
router.include_router(login_router, prefix="", tags=["Login & Session Management"])
router.include_router(refresh_router, prefix="", tags=["Token Management"])
router.include_router(password_reset_router, prefix="", tags=["Password Reset"])
router.include_router(monitoring_router, prefix="", tags=["Monitoring & Analytics"])

@router.get("/health")
async def auth_health_check():
    return {
        "status": "healthy",
        "service": "authentication",
        "version": "2.0.0"
    }