from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request, status
from services.service import (
    create_attribute_options,
    create_service,
    crete_attribute,
    crete_category,
    delete_attribute,
    delete_attribute_options,
    delete_category,
    delete_service,
    get_categories_selection,
    get_list_categories,
    get_list_services,
    get_list_services_detail,
    get_service,
    update_attribute,
    update_attribute_options,
    update_category,
    update_service,
)
from sqlalchemy.ext.asyncio import AsyncSession

from shared.database import get_db
from shared.dependencies import AuthContext, get_auth_context
from shared.schemas.company_units.service import (
    AttributeOptionCreate,
    AttributeOptionResponse,
    AttributeOptionUpdate,
    CategoryAttributeCreate,
    CategoryAttributeResponse,
    CategoryAttributeUpdate,
    ServiceCategoryCreate,
    ServiceCategoryDetailListResponse,
    ServiceCategoryDetailResponse,
    ServiceCategoryResponse,
    ServiceCategorySelection,
    ServiceCategoryUpdate,
    ServiceCreate,
    ServiceDetailResponse,
    ServiceResponse,
    ServiceUpdate,
    ServiceWithCategoryListResponse,
)
from shared.security import requires_permission

router = APIRouter(prefix='/services', tags=['Service Categories'])


@requires_permission('services:create', scope='orgs')
@router.post(
    '',
    response_model=ServiceResponse,
    status_code=status.HTTP_201_CREATED,
    name='Service create',
)
async def create_service_route(
    request: Request,
    data: ServiceCreate,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await create_service(request=request, data=data, db=db, auth=auth)


@router.get(
    '/selection',
    response_model=List[ServiceDetailResponse],
    status_code=status.HTTP_200_OK,
    name='Service list',
)
async def get_list_services_detail_route(
    request: Request,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_list_services_detail(request=request, db=db, auth=auth)


@router.get(
    '',
    response_model=ServiceWithCategoryListResponse,
    status_code=status.HTTP_200_OK,
    name='Service list',
)
async def get_list_services_route(
    request: Request,
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_list_services(
        request=request, offset=offset, limit=limit, db=db, auth=auth
    )


@router.get(
    '/categories/selection',
    response_model=List[ServiceCategorySelection],
    status_code=status.HTTP_200_OK,
)
async def get_categories_selection_route(
    request: Request,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_categories_selection(request=request, db=db, auth=auth)


@router.post(
    '/categories',
    response_model=ServiceCategoryDetailResponse,
    status_code=status.HTTP_201_CREATED,
    name='Category create',
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
    response_model=ServiceCategoryDetailListResponse,
    status_code=status.HTTP_200_OK,
    name='Category list',
)
async def get_list_categories_route(
    request: Request,
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_list_categories(
        request=request, offset=offset, limit=limit, db=db, auth=auth
    )


@router.patch(
    '/categories/{uuid}',
    response_model=ServiceCategoryResponse,
    status_code=status.HTTP_200_OK,
    name='Category update',
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


@router.delete(
    '/categories/{uuid}',
    status_code=status.HTTP_204_NO_CONTENT,
    name='Category delete',
)
@requires_permission('services-categories:delete', scope='orgs')
async def delete_category_route(
    request: Request,
    uuid: UUID,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await delete_category(request=request, uuid=uuid, db=db, auth=auth)


@router.post(
    '/attributes',
    response_model=CategoryAttributeResponse,
    status_code=status.HTTP_201_CREATED,
)
@requires_permission('services-attributes:create', scope='orgs')
async def create_attribute_route(
    request: Request,
    data: CategoryAttributeCreate,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await crete_attribute(request=request, data=data, db=db, auth=auth)


@router.delete(
    '/attributes/{uuid}',
    status_code=status.HTTP_204_NO_CONTENT,
)
@requires_permission('services-attributes:delete', scope='orgs')
async def delete_attribute_route(
    request: Request,
    uuid: UUID,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await delete_attribute(request=request, uuid=uuid, db=db, auth=auth)


@router.patch(
    '/attributes/{uuid}',
    response_model=CategoryAttributeResponse,
    status_code=status.HTTP_200_OK,
)
@requires_permission('services-attributes:update', scope='orgs')
async def update_attribute_route(
    request: Request,
    uuid: UUID,
    data: CategoryAttributeUpdate,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await update_attribute(
        request=request, uuid=uuid, data=data, db=db, auth=auth
    )


@router.delete(
    '/attribute-options/{uuid}',
    status_code=status.HTTP_204_NO_CONTENT,
)
@requires_permission('services-attribute-options:delete', scope='orgs')
async def delete_attribute_options_route(
    request: Request,
    uuid: UUID,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await delete_attribute_options(request=request, uuid=uuid, db=db, auth=auth)


@router.patch(
    '/attribute-options/{uuid}',
    response_model=AttributeOptionResponse,
    status_code=status.HTTP_201_CREATED,
)
@requires_permission('services-attribute-options:update', scope='orgs')
async def update_attribute_options_route(
    request: Request,
    uuid: UUID,
    data: AttributeOptionUpdate,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await update_attribute_options(
        request=request, uuid=uuid, data=data, db=db, auth=auth
    )


@router.post(
    '/attribute-options',
    response_model=List[AttributeOptionResponse],
    status_code=status.HTTP_201_CREATED,
)
@requires_permission('services-attribute-options:create', scope='orgs')
async def create_attribute_options_route(
    request: Request,
    data: List[AttributeOptionCreate],
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await create_attribute_options(request=request, data=data, db=db, auth=auth)


@router.get(
    '/{uuid}',
    response_model=ServiceResponse,
    status_code=status.HTTP_200_OK,
    name='Service get',
)
async def get_service_route(
    request: Request,
    uuid: UUID,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_service(request=request, uuid=uuid, db=db, auth=auth)


@router.patch(
    '/{uuid}',
    response_model=ServiceResponse,
    status_code=status.HTTP_200_OK,
    name='Service update',
)
@requires_permission('services:update', scope='orgs')
async def update_service_route(
    request: Request,
    uuid: UUID,
    data: ServiceUpdate,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await update_service(request=request, data=data, uuid=uuid, db=db, auth=auth)


@router.delete('/{uuid}', status_code=status.HTTP_204_NO_CONTENT, name='Service delete')
@requires_permission('services:delete', scope='orgs')
async def delete_service_route(
    request: Request,
    uuid: UUID,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await delete_service(request=request, uuid=uuid, db=db, auth=auth)
