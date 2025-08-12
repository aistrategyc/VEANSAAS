from fastapi import APIRouter, Depends, Request, status
from service import check_uniqueness_user, get_user_by_username, create_user
from sqlalchemy.ext.asyncio import AsyncSession

from shared.database import get_db
from shared.schemas.user import (
    UserCreateInternal,
    UserInDB,
    UserUniquenessCheckRequest,
    UserUniquenessCheckResponse,
)

router = APIRouter(prefix='/users', tags=['User'])


@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_user_route(
    request: Request, user: UserCreateInternal, db: AsyncSession = Depends(get_db)
):
    return await create_user(request=request, user=user, db=db)


@router.get('/{username}', response_model=UserInDB, status_code=status.HTTP_200_OK)
async def get_user_by_username_route(
    request: Request, username: str, db: AsyncSession = Depends(get_db)
):
    return await get_user_by_username(request=request, username=username, db=db)


@router.post(
    '/check-uniqueness-user',
    response_model=UserUniquenessCheckResponse,
    status_code=status.HTTP_200_OK,
)
async def check_uniqueness_user_route(
    request: Request,
    data: UserUniquenessCheckRequest,
    db: AsyncSession = Depends(get_db),
):
    return await check_uniqueness_user(request=request, data=data, db=db)
