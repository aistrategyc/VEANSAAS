from uuid import UUID

from fastapi import HTTPException, Request, Response, status
from sqlalchemy import exists, select
from sqlalchemy.ext.asyncio import AsyncSession

from shared.models.user import User
from shared.schemas.error import FieldError, ValidationError
from shared.schemas.user import (
    UserCreateInternal,
    UserUniquenessCheckRequest,
    UserUniquenessCheckResponse,
)


async def get_user_for_auth(request: Request, username: str, db: AsyncSession):
    result = await db.execute(
        select(User).filter(User.username == username, User.is_active.is_(True))
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='User not found'
        )
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
    uniqueness_result = await check_uniqueness_user(
        request=request,
        data=UserUniquenessCheckRequest(username=user.username, email=user.email),
        db=db,
    )
    if not uniqueness_result.is_valid:
        errors = {}
        if uniqueness_result.username_exists:
            errors['username'] = FieldError(
                code='username_exists',
                message='Username already taken',
            )

        if uniqueness_result.email_exists:
            errors['email'] = FieldError(
                code='email_exists',
                message='Email already registered',
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ValidationError(errors=errors).model_dump(),
        )

    db_user = User(**user.model_dump())
    db.add(db_user)
    await db.commit()
    return db_user


async def delete_user(request: Request, user_uuid: UUID, db: AsyncSession):
    user = await db.get(User, user_uuid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='User not found'
        )
    await db.delete(user)
    await db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def get_my_user(request: Request, current_user: dict, db: AsyncSession):
    user_uuid = current_user.get('user_uuid')
    if not user_uuid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='User not found'
        )
    user = await db.get(User, user_uuid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='User not found'
        )
    return user
