from fastapi import APIRouter, Depends, Request, status
from schemas import LoginUserRequest, RegisterUserRequest, TokenResponse
from service import login, register
from sqlalchemy.ext.asyncio import AsyncSession

from shared.database import get_db
from shared.dependencies import get_company_units_service, get_user_service
from shared.rabbitmq import rabbitmq
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


@router.get('/test-rabbit')
async def test_rabbit():
    test_msg = {'test': 'Hello RabbitMQ zela!', 'action': 'test.message'}

    await rabbitmq.publish(routing_key='user.created', message=test_msg)

    return {'message': 'ok'}
