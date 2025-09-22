from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, Request, status
from services.service import (
    create_service,
    crete_category,
    get_list_categories,
    get_list_services,
    get_service,
    update_category,
)
from sqlalchemy.ext.asyncio import AsyncSession

from shared.database import get_db
from shared.dependencies import AuthContext, get_auth_context
from shared.schemas.company_units.service import (
    ServiceCategoryCreate,
    ServiceCategoryResponse,
    ServiceCategoryUpdate,
    ServiceCreate,
    ServiceResponse,
)
from shared.security import requires_permission

router = APIRouter(prefix='/services', tags=['Service Categories'])


@requires_permission('services:create', scope='orgs')
@router.post('', response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service_route(
    request: Request,
    data: ServiceCreate,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await create_service(request=request, data=data, db=db, auth=auth)


@router.get(
    '',
    response_model=List[ServiceResponse],
    status_code=status.HTTP_200_OK,
)
async def get_list_services_route(
    request: Request,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_list_services(request=request, db=db, auth=auth)


@router.post(
    '/categories',
    response_model=ServiceCategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
@requires_permission('services-categories:create', scope='orgs')
async def crete_category_route(
    request: Request,
    data: ServiceCategoryCreate,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await crete_category(request=request, data=data, db=db, auth=auth)


@router.get(
    '/categories',
    response_model=List[ServiceCategoryResponse],
    status_code=status.HTTP_200_OK,
)
async def get_list_categories_route(
    request: Request,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_list_categories(request=request, db=db, auth=auth)


@router.patch(
    '/categories/{uuid}',
    response_model=ServiceCategoryResponse,
    status_code=status.HTTP_200_OK,
)
@requires_permission('services-categories:update', scope='orgs')
async def update_category_route(
    request: Request,
    uuid: UUID,
    data: ServiceCategoryUpdate,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await update_category(
        request=request, uuid=uuid, data=data, db=db, auth=auth
    )


@router.get(
    '/{uuid}',
    response_model=ServiceResponse,
    status_code=status.HTTP_200_OK,
)
async def get_service_route(
    request: Request,
    uuid: UUID,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_service(request=request, uuid=uuid, db=db, auth=auth)
