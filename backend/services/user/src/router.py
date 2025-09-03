from uuid import UUID

from fastapi import APIRouter, Depends, Request, status
from service import (
    check_uniqueness_user,
    create_user,
    delete_user,
    get_my_user,
    get_user_for_auth,
    verification_email,
)
from sqlalchemy.ext.asyncio import AsyncSession

from shared.cache.decorators import redis_cache
from shared.cache.key_builders import user_me_key_builder
from shared.database import get_db
from shared.dependencies import (
    AuthContext,
    get_auth_context,
    get_current_user,
    get_service_token,
)
from shared.schemas.auth import AuthUserResponse
from shared.schemas.user import (
    UserCreateInternal,
    UserResponse,
    UserUniquenessCheckRequest,
    UserUniquenessCheckResponse,
    UserVerificationEmail,
)

router = APIRouter(prefix='/users', tags=['User'])


@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_user_route(
    request: Request,
    user: UserCreateInternal,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await create_user(request=request, user=user, db=db)


@router.delete('/{user_uuid}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_route(
    request: Request,
    user_uuid: UUID,
    current_service: dict = Depends(get_service_token),
    db: AsyncSession = Depends(get_db),
):
    return await delete_user(request=request, user_uuid=user_uuid, db=db)


@router.get('/me', response_model=UserResponse, status_code=status.HTTP_200_OK)
@redis_cache(expire=180, key_builder=user_me_key_builder)
async def get_my_user_router(
    request: Request,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_my_user(request=request, current_user=current_user, db=db)


@router.get(
    '/{username}/auth', response_model=AuthUserResponse, status_code=status.HTTP_200_OK
)
@redis_cache(expire=180, use_kwargs=['username'])
async def get_user_for_auth_route(
    request: Request,
    username: str,
    auth: AuthContext = Depends(get_auth_context),
    db: AsyncSession = Depends(get_db),
):
    return await get_user_for_auth(request=request, username=username, db=db)


@router.post(
    '/check-uniqueness-user',
    response_model=UserUniquenessCheckResponse,
    status_code=status.HTTP_200_OK,
)
async def check_uniqueness_user_route(
    request: Request,
    data: UserUniquenessCheckRequest,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await check_uniqueness_user(request=request, data=data, db=db)


@router.post('/verification_email', status_code=status.HTTP_200_OK)
async def verification_email_route(
    request: Request,
    data: UserVerificationEmail,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await verification_email(request=request, data=data, db=db)
