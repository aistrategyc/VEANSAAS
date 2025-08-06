from fastapi import Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from services.user.src.models import User


async def get_user_by_username(request: Request, username: str, db: AsyncSession):
    result = await db.execute(select(User).filter(User.username == username))
    user = result.scalar_one_or_none()
    return user
