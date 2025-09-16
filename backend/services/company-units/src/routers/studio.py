from fastapi import APIRouter, Depends, Request, status
from service import create_studio_invite
from sqlalchemy.ext.asyncio import AsyncSession

from shared.database import get_db
from shared.dependencies import AuthContext, get_auth_context
from shared.schemas.company_units.common import BaseInviteResponse
from shared.schemas.company_units.studio import (
    StudioInviteCreateRequest,
)

router = APIRouter(prefix='/studios', tags=['Studios'])


@router.post(
    '/{uuid}/invite',
    response_model=BaseInviteResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_studio_invite_route(
    request: Request,
    uuid: str,
    data: StudioInviteCreateRequest,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await create_studio_invite(
        request=request, studio_uuid=uuid, data=data, db=db, auth=auth
    )
