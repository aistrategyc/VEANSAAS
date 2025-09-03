from dependencies import get_refresh_token
from fastapi import APIRouter, Depends, Request, status
from schemas import (
    LoginUserRequest,
    RegisterByInviterUserRequest,
    RegisterUserRequest,
    TokenResponse,
)
from service import (
    login,
    refresh_access_token,
    register,
    register_by_invite,
    verify_email,
)

from shared.dependencies import (
    get_company_units_invite_service,
    get_company_units_organization_service,
    get_user_service,
)
from shared.service_clients.company_units import (
    CompanyUnitsInviteServiceClient,
    CompanyUnitsOrganizationServiceClient,
)
from shared.service_clients.user import UserServiceClient

router = APIRouter(prefix='/auth', tags=['Auth'])


@router.post('/register', status_code=status.HTTP_201_CREATED)
async def register_route(
    request: Request,
    data: RegisterUserRequest,
    user_service: UserServiceClient = Depends(get_user_service),
    units_service: CompanyUnitsOrganizationServiceClient = Depends(
        get_company_units_organization_service
    ),
):
    return await register(
        request=request,
        data=data,
        user_service=user_service,
        units_service=units_service,
    )


@router.post('/register-by-invite', status_code=status.HTTP_201_CREATED)
async def register_by_invite_route(
    request: Request,
    data: RegisterByInviterUserRequest,
    invite_service: CompanyUnitsInviteServiceClient = Depends(
        get_company_units_invite_service
    ),
    user_service: UserServiceClient = Depends(get_user_service),
):
    return await register_by_invite(
        request=request,
        data=data,
        user_service=user_service,
        invite_service=invite_service,
    )


@router.post('/login', response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def login_route(
    request: Request,
    data: LoginUserRequest,
    user_service: UserServiceClient = Depends(get_user_service),
):
    return await login(request=request, data=data, user_service=user_service)


@router.get('/verify-email', status_code=status.HTTP_200_OK)
async def verify_email_route(
    request: Request,
    token,
    user_service: UserServiceClient = Depends(get_user_service),
):
    return await verify_email(request=request, token=token, user_service=user_service)


@router.post(
    '/refresh-access-token',
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
async def refresh_access_token_route(
    request: Request, refresh_payload: dict = Depends(get_refresh_token)
):
    return await refresh_access_token(request=request, payload=refresh_payload)
