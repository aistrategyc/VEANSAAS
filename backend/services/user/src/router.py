from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from services.user.src.service import get_user_by_username
from shared.database import get_db
from shared.schemas.user import UserResponse

router = APIRouter(prefix='/users', tags=['User'])


@router.get('/{username}', response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_user_by_username_route(
    request: Request, username: str, db: AsyncSession = Depends(get_db)
):
    return await get_user_by_username(request=request, username=username, db=db)
