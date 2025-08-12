from fastapi import APIRouter, Request, status
from schemas import LoginUserRequest, RegisterUserRequest
from service import login, register

from shared.schemas.user import UserResponse

router = APIRouter(prefix='/auth', tags=['Auth'])


@router.post(
    '/register', response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def register_route(request: Request, data: RegisterUserRequest):
    return await register(request=request, data=data)


@router.post('/login')
async def login_route(request: Request, data: LoginUserRequest):
    return await login(request=request, data=data)
