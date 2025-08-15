from fastapi import HTTPException, Request, status
from schemas import LoginUserRequest, RegisterUserRequest, TokenResponse
from security import pwd_context
from sqlalchemy.ext.asyncio import AsyncSession
from utils import (
    create_access_token,
    verify_password,
)

from shared.schemas.user import (
    UserCreateInternal,
)
from shared.service_clients.company_units import CompanyUnitsServiceClient
from shared.service_clients.user import UserServiceClient


async def register(
    request: Request,
    data: RegisterUserRequest,
    db: AsyncSession,
    user_service: UserServiceClient,
    units_service: CompanyUnitsServiceClient,
):
    user_created = None
    try:
        user, organization = data.user, data.organization

        hashed_password = pwd_context.hash(user.password)
        user_internal = UserCreateInternal(
            **user.model_dump(exclude={'password'}), hashed_password=hashed_password
        )

        user_created = await user_service.create_user(request_data=user_internal)

        organization.created_by_uuid = str(user_created.uuid)

        await units_service.create_organization(request_data=organization)

        await db.commit()
        return {
            'status': 'success',
            'message': 'User registered. Check your email for confirmation.',
        }
    except Exception:
        if user_created:
            await user_service.delete_user(user_created.uuid)
        raise


async def login(
    request: Request, data: LoginUserRequest, user_service: UserServiceClient
) -> TokenResponse:
    user = await user_service.get_user_for_auth(username=data.username)

    if not await verify_password(
        password=data.password, hashed_password=user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid authentication credentials',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    access_token = await create_access_token(
        data={
            'sub': 'user',
            'user_uuid': user.uuid,
            'username': user.username,
            'email': user.email,
        }
    )

    return TokenResponse(access_token=access_token)
