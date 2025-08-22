from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from datetime import datetime, timezone

from liderix_api.models.kpi import KPI
from liderix_api.schemas.kpis import KPICreate, KPIUpdate, KPIRead
from liderix_api.db import get_async_session
from liderix_api.services.auth import get_current_user
from liderix_api.models.users import User

router = APIRouter(prefix="", tags=["KPIs"])

# 🔹 Получить все KPI пользователя
@router.get("/kpis", response_model=list[KPIRead])
async def get_kpis(
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    result = await session.execute(
        select(KPI).where(KPI.user_id == current_user.id)
    )
    return result.scalars().all()

# 🔹 Получить один KPI
@router.get("/kpis/{kpi_id}", response_model=KPIRead)
async def get_kpi(
    kpi_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    kpi = await session.get(KPI, kpi_id)
    if not kpi or kpi.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="KPI not found")
    return kpi

# 🔹 Создать KPI
@router.post("/kpis", response_model=KPIRead)
async def create_kpi(
    data: KPICreate,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    new_kpi = KPI(
        **data.dict(),
        user_id=current_user.id,
        created_at=datetime.now(timezone.utc)
    )
    session.add(new_kpi)
    await session.commit()
    await session.refresh(new_kpi)
    return new_kpi

# 🔹 Обновить KPI
@router.put("/kpis/{kpi_id}", response_model=KPIRead)
async def update_kpi(
    kpi_id: UUID,
    data: KPIUpdate,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    kpi = await session.get(KPI, kpi_id)
    if not kpi or kpi.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="KPI not found")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(kpi, field, value)

    await session.commit()
    await session.refresh(kpi)
    return kpi

# 🔹 Удалить KPI
@router.delete("/kpis/{kpi_id}")
async def delete_kpi(
    kpi_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    kpi = await session.get(KPI, kpi_id)
    if not kpi or kpi.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="KPI not found")

    await session.delete(kpi)
    await session.commit()
    return {"detail": "KPI deleted"}