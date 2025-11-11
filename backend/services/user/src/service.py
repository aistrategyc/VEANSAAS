from uuid import UUID

from fastapi import HTTPException, Request, Response, status
from sqlalchemy import exists, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import contains_eager, selectinload

from shared.dependencies import AuthContext
from shared.models.company_units.studio import StudioMember
from shared.models.user import User
from shared.schemas.auth import AuthUserResponse
from shared.schemas.company_units.studio import StudioRole
from shared.schemas.error import FieldError, ValidationError
from shared.schemas.mixins import PaginationResponse
from shared.schemas.user import (
    UserCreateInternal,
    UserListResponse,
    UserUniquenessCheckRequest,
    UserUniquenessCheckResponse,
    UserVerificationEmail,
    UserWitchMemberResponse,
)


async def get_user_for_auth(request: Request, username: str, db: AsyncSession):
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
        is_active=db_user.is_active,
        is_verified=db_user.is_verified,
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
            exists()
            .where(User.phone_number == data.phone_number)
            .label('phone_number_exists'),
        )
    )
    exists_info = result.first()

    return UserUniquenessCheckResponse(
        is_valid=not (
            exists_info.username_exists
            or exists_info.email_exists
            or exists_info.phone_number_exists
        ),
        username_exists=exists_info.username_exists,
        email_exists=exists_info.email_exists,
        phone_number_exists=exists_info.phone_number_exists,
    )


async def create_user(request: Request, user: UserCreateInternal, db: AsyncSession):
    uniqueness_result = await check_uniqueness_user(
        request=request,
        data=UserUniquenessCheckRequest(
            username=user.username, email=user.email, phone_number=user.phone_number
        ),
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

        if uniqueness_result.phone_number_exists:
            errors['email'] = FieldError(
                code='phone_number_exists',
                message='Phone number already registered',
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


async def get_my_user(request: Request, auth: AuthContext, db: AsyncSession):
    if not auth.is_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='User not found'
        )

    db_user = await db.get(User, auth.user.uuid)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='User not found'
        )
    return db_user


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


async def get_user_list(
    request: Request, offset: int, limit: int, db: AsyncSession, auth: AuthContext
):
    query = (
        select(User)
        .join(User.studio_memberships)
        .where(StudioMember.studio_uuid == auth.studio_uuid)
        .options(contains_eager(User.studio_memberships))
    )

    count_query = (
        select(func.count())
        .join(User.studio_memberships)
        .where(StudioMember.studio_uuid == auth.studio_uuid)
        .select_from(User)
    )

    query_result = await db.execute(query.offset(offset).limit(limit))
    db_users = query_result.unique().scalars().all()

    total_count = await db.scalar(count_query) or 0

    items = []
    for user in db_users:
        data_user = UserWitchMemberResponse.model_validate(user)
        data_user.studio_membership = (
            user.studio_memberships[0] if user.studio_memberships else None
        )
        items.append(data_user)

    return UserListResponse(
        items=items,
        pagination=PaginationResponse(
            count=total_count,
            offset=offset,
            limit=limit,
            has_more=(offset + limit) < total_count,
        ),
    )


async def selection_master(request: Request, db: AsyncSession, auth: AuthContext):
    query = (
        select(User)
        .join(User.studio_memberships)
        .where(
            StudioMember.studio_uuid == auth.studio_uuid,
            StudioMember.roles.contains([StudioRole.MASTER]),
        )
    )

    result = await db.execute(query)
    db_users = result.scalars().all()
    return db_users
