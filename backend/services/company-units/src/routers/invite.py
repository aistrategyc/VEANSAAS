from fastapi import APIRouter, Depends, Request, status
from services.invite import invite_create_members, invite_validate
from sqlalchemy.ext.asyncio import AsyncSession

from shared.database import get_db
from shared.dependencies import AuthContext, get_service_token
from shared.schemas.company_units.invite import (
    BaseInviteMemberCreateRequest,
    BaseInviteValidateResponse,
)

router = APIRouter(prefix='/invites', tags=['Invites'])


@router.get(
    '/{token}/validate',
    response_model=BaseInviteValidateResponse,
    status_code=status.HTTP_200_OK,
)
async def invite_validate_route(
    request: Request,
    token: str,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_service_token),
):
    return await invite_validate(request=request, token=token, db=db)


@router.post(
    '/{uuid}/members',
    status_code=status.HTTP_200_OK,
)
async def invite_create_members_route(
    request: Request,
    uuid: str,
    data: BaseInviteMemberCreateRequest,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_service_token),
):
    return await invite_create_members(request=request, uuid=uuid, data=data, db=db)
