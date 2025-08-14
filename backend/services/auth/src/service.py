from fastapi import HTTPException, Request, status
from schemas import LoginUserRequest, RegisterUserRequest, TokenResponse
from security import pwd_context
from utils import (
    create_access_token,
    create_organization_with_org_service,
    create_user_with_user_service,
    get_user_for_auth,
    verify_password,
)

from shared.schemas.user import (
    UserCreateInternal,
)


async def register(request: Request, data: RegisterUserRequest):
    user, organization = data.user, data.organization

    hashed_password = pwd_context.hash(user.password)
    user_internal = UserCreateInternal(
        **user.model_dump(exclude={'password'}), hashed_password=hashed_password
    )
    user_created = await create_user_with_user_service(request_data=user_internal)
    organization.created_by_uuid = str(user_created.uuid)
    await create_organization_with_org_service(request_data=organization)
    return user_created


async def login(request: Request, data: LoginUserRequest) -> TokenResponse:
    user = await get_user_for_auth(username=data.username)
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
