from dependencies import get_refresh_token
from fastapi import APIRouter, Depends, Request, status
from schemas import LoginUserRequest, RegisterUserRequest, TokenResponse
from service import login, refresh_access_token, register, verify_email
from sqlalchemy.ext.asyncio import AsyncSession

from shared.database import get_db
from shared.dependencies import get_company_units_service, get_user_service
from shared.service_clients.company_units import CompanyUnitsServiceClient
from shared.service_clients.user import UserServiceClient

router = APIRouter(prefix='/auth', tags=['Auth'])


@router.post('/register', status_code=status.HTTP_201_CREATED)
async def register_route(
    request: Request,
    data: RegisterUserRequest,
    user_service: UserServiceClient = Depends(get_user_service),
    units_service: CompanyUnitsServiceClient = Depends(get_company_units_service),
    db: AsyncSession = Depends(get_db),
):
    return await register(
        request=request,
        data=data,
        db=db,
        user_service=user_service,
        units_service=units_service,
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
