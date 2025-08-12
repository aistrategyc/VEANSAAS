from fastapi import Request
from sqlalchemy import exists, select
from sqlalchemy.ext.asyncio import AsyncSession

from shared.models.user import User
from shared.schemas.user import (
    UserCreateInternal,
    UserUniquenessCheckRequest,
    UserUniquenessCheckResponse,
)


async def get_user_by_username(request: Request, username: str, db: AsyncSession):
    result = await db.execute(select(User).filter(User.username == username))
    user = result.scalar_one_or_none()
    return user


async def check_uniqueness_user(
    request: Request, data: UserUniquenessCheckRequest, db: AsyncSession
) -> UserUniquenessCheckResponse:
    result = await db.execute(
        select(
            exists().where(User.username == data.username).label('username_exists'),
            exists().where(User.email == data.email).label('email_exists'),
        )
    )
    exists_info = result.first()

    return UserUniquenessCheckResponse(
        is_valid=not (exists_info.username_exists or exists_info.email_exists),
        username_exists=exists_info.username_exists,
        email_exists=exists_info.email_exists,
    )


async def create_user(request: Request, user: UserCreateInternal, db: AsyncSession):
    db_user = User(**user.model_dump())
    db.add(db_user)
    await db.commit()
    return db_user
