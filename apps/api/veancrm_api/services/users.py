from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from liderix_api.models.users import User
from liderix_api.schemas.user import UserCreate, UserUpdate
from uuid import UUID
import uuid

async def get_users(db: AsyncSession):
    result = await db.execute(select(User))
    return result.scalars().all()

async def get_user(user_id: UUID, db: AsyncSession):
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

async def create_user(data: UserCreate, db: AsyncSession):
    new_user = User(
        id=uuid.uuid4(),
        email=data.email,
        username=data.username,
        client_id=uuid.uuid4(),  # ⚠️ Временно, замени при необходимости
        password_hash=data.password  # ⚠️ Пока без хэширования
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

async def update_user(user_id: UUID, data: UserUpdate, db: AsyncSession):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return None

    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return user

async def delete_user(user_id: UUID, db: AsyncSession):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return None

    await db.delete(user)
    await db.commit()
    return user