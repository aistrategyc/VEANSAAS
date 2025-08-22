from fastapi import APIRouter
from . import sales, ads

router = APIRouter()

router.include_router(sales.router, prefix="/sales", tags=["Sales Analytics"])
router.include_router(ads.router, prefix="/ads", tags=["Ads Analytics"])