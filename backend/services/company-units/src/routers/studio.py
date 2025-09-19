from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request, status
from services.studio import (
    create_studio_invite,
    get_list_studios,
    get_studio,
    get_studio_select_options,
    update_studio,
)
from sqlalchemy.ext.asyncio import AsyncSession

from shared.database import get_db
from shared.dependencies import AuthContext, get_auth_context
from shared.schemas.company_units.common import BaseInviteResponse
from shared.schemas.company_units.studio import (
    StudioFilter,
    StudioInviteCreateRequest,
    StudioListResponse,
    StudioResponse,
    StudioSelectOptionsResponse,
    StudioUpdateRequest,
)
from shared.security import requires_permission, requires_resource_access

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


@router.get(
    '/selection',
    response_model=List[StudioSelectOptionsResponse],
    status_code=status.HTTP_200_OK,
)
async def get_studio_select_options_route(
    request: Request,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_studio_select_options(request=request, db=db, auth=auth)


@router.get('/{uuid}', response_model=StudioResponse, status_code=status.HTTP_200_OK)
@requires_resource_access()
async def get_studio_route(
    request: Request,
    uuid: UUID,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_studio(request=request, uuid=uuid, db=db, auth=auth)


@router.patch('/{uuid}', response_model=StudioResponse, status_code=status.HTTP_200_OK)
@requires_permission('studio:update')
@requires_resource_access()
async def update_organization_route(
    request: Request,
    uuid: UUID,
    data: StudioUpdateRequest,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await update_studio(request=request, uuid=uuid, data=data, db=db, auth=auth)


@router.get('', response_model=StudioListResponse, status_code=status.HTTP_200_OK)
async def get_list_studios_route(
    request: Request,
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=1000),
    filters: StudioFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_list_studios(
        request=request, offset=offset, limit=limit, filters=filters, db=db, auth=auth
    )
