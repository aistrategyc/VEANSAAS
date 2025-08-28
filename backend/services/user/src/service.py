from uuid import UUID

from fastapi import HTTPException, Request, Response, status
from sqlalchemy import exists, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from shared.models.user import User
from shared.schemas.auth import AuthUserResponse
from shared.schemas.error import FieldError, ValidationError
from shared.schemas.user import (
    UserCreateInternal,
    UserUniquenessCheckRequest,
    UserUniquenessCheckResponse,
    UserVerificationEmail,
)


async def get_user_for_auth(request: Request, username: str, db: AsyncSession):
    result = await db.execute(
        select(User).filter(
            User.username == username,
            User.is_active.is_(True),
            User.is_verified.is_(True),
        )
    )

    result = await db.execute(
        select(User)
        .filter(
            User.username == username,
            User.is_active.is_(True),
            User.is_verified.is_(True),
        )
        .options(
            selectinload(User.studio_memberships),
            selectinload(User.organization_memberships),
        )
    )
    db_user = result.scalar_one_or_none()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='User not found'
        )
    studios_role = {m.studio_uuid: m.roles for m in db_user.studio_memberships}
    organizations_role = {
        m.organization_uuid: m.roles for m in db_user.organization_memberships
    }

    auth_user_response = AuthUserResponse(
        uuid=db_user.uuid,
        username=db_user.username,
        email=str(db_user.email),
        hashed_password=db_user.hashed_password,
        roles={'studios': studios_role, 'orgs': organizations_role},
    )

    return auth_user_response


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

    db_user = User(**user.model_dump(), is_verified=False)
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


async def verification_email(
    request: Request, data: UserVerificationEmail, db: AsyncSession
):
    result = await db.execute(
        select(User).filter(
            User.uuid == data.user_uuid,
            User.email == data.email,
            User.is_active.is_(True),
        )
    )
    db_user = result.scalar_one_or_none()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='User not found'
        )
    db_user.is_verified = True
    await db.commit()

    return Response(status_code=status.HTTP_200_OK)
