from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from datetime import datetime, timezone
from liderix_api.models.okrs import OKR
from liderix_api.schemas.okrs import OKRCreate, OKRUpdate, OKRRead
from liderix_api.db import get_async_session
from liderix_api.services.auth import get_current_user
from liderix_api.models.users import User

router = APIRouter(prefix="/okrs", tags=["OKRs"])

# 🔹 Получить все OKR пользователя
@router.get("/", response_model=list[OKRRead])
async def get_okrs(
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    result = await session.execute(
        select(OKR).where(OKR.user_id == current_user.id)
    )
    return result.scalars().all()

# 🔹 Получить один OKR
@router.get("/{okr_id}", response_model=OKRRead)
async def get_okr(
    okr_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    okr = await session.get(OKR, okr_id)
    if not okr or okr.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="OKR not found")
    return okr

# 🔹 Создать OKR
@router.post("/", response_model=OKRRead)
async def create_okr(
    data: OKRCreate,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    new_okr = OKR(
        **data.dict(),
        user_id=current_user.id,
        created_at=datetime.now(timezone.utc)
    )
    session.add(new_okr)
    await session.commit()
    await session.refresh(new_okr)
    return new_okr

# 🔹 Обновить OKR
@router.put("/{okr_id}", response_model=OKRRead)
async def update_okr(
    okr_id: UUID,
    data: OKRUpdate,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    okr = await session.get(OKR, okr_id)
    if not okr or okr.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="OKR not found")
    for field, value in data.dict(exclude_unset=True).items():
        setattr(okr, field, value)
    await session.commit()
    await session.refresh(okr)
    return okr

# 🔹 Удалить OKR
@router.delete("/{okr_id}")
async def delete_okr(
    okr_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    okr = await session.get(OKR, okr_id)
    if not okr or okr.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="OKR not found")
    await session.delete(okr)
    await session.commit()
    return {"detail": "OKR deleted"}