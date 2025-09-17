from uuid import UUID

from fastapi import APIRouter, Depends, Request, status
from services.org import create_organization, get_organization, update_organization
from sqlalchemy.ext.asyncio import AsyncSession

from shared.database import get_db
from shared.dependencies import AuthContext, get_auth_context
from shared.schemas.company_units.org import (
    OrganizationCreateRequest,
    OrganizationResponse,
    OrganizationResponseSimple,
    OrganizationUpdateRequest,
)
from shared.security import requires_permission, requires_resource_access

router = APIRouter(prefix='/orgs', tags=['Organizations'])


@router.post(
    '/', response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED
)
async def create_organization_route(
    request: Request,
    data: OrganizationCreateRequest,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await create_organization(request=request, data=data, db=db)


@router.get(
    '/{uuid}', response_model=OrganizationResponseSimple, status_code=status.HTTP_200_OK
)
@requires_resource_access()
async def get_organization_route(
    request: Request,
    uuid: UUID,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_organization(request=request, uuid=uuid, db=db, auth=auth)


@router.patch(
    '/{uuid}', response_model=OrganizationResponseSimple, status_code=status.HTTP_200_OK
)
@requires_permission('org:update', scope='orgs')
@requires_resource_access(scope='orgs')
async def update_organization_route(
    request: Request,
    uuid: UUID,
    data: OrganizationUpdateRequest,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await update_organization(
        request=request, uuid=uuid, data=data, db=db, auth=auth
    )
