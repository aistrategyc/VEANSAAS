from uuid import UUID

from database import get_db_customer
from fastapi import APIRouter, Depends, Query, Request, status
from service import (
    create_customer,
    get_customer,
    get_customer_list,
    search_customer,
    update_customer,
)
from sqlalchemy.ext.asyncio import AsyncSession

from shared.dependencies import AuthContext, get_auth_context
from shared.schemas.customer import (
    CustomerCreate,
    CustomerFilter,
    CustomerListResponse,
    CustomerResponse,
    CustomerSelectOptionsResponse,
    CustomerUpdate,
)

router = APIRouter(prefix='/customers', tags=['Customer'])


@router.get(
    '',
    response_model=CustomerListResponse,
    status_code=status.HTTP_201_CREATED,
    name='Customer list',
)
async def get_customer_list_route(
    request: Request,
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=1000),
    db: AsyncSession = Depends(get_db_customer),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_customer_list(
        request=request, offset=offset, limit=limit, db=db, auth=auth
    )


@router.get(
    '/selection',
    response_model=CustomerSelectOptionsResponse,
    status_code=status.HTTP_200_OK,
    name='Customer selection list',
)
async def search_customer_route(
    request: Request,
    filters: CustomerFilter = Depends(),
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=1000),
    db: AsyncSession = Depends(get_db_customer),
    auth: AuthContext = Depends(get_auth_context),
):
    return await search_customer(
        request=request, offset=offset, limit=limit, filters=filters, db=db, auth=auth
    )


@router.get(
    '/{uuid}',
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
    name='Customer get',
)
async def get_customer_route(
    request: Request,
    uuid: UUID,
    db: AsyncSession = Depends(get_db_customer),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_customer(request=request, uuid=uuid, db=db, auth=auth)


@router.post(
    '',
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
    name='Customer create',
)
async def create_customer_route(
    request: Request,
    data: CustomerCreate,
    db: AsyncSession = Depends(get_db_customer),
    auth: AuthContext = Depends(get_auth_context),
):
    return await create_customer(request=request, data=data, db=db, auth=auth)


@router.patch(
    '/{uuid}',
    response_model=CustomerResponse,
    status_code=status.HTTP_200_OK,
    name='Customer update',
)
async def update_customer_route(
    request: Request,
    uuid: UUID,
    data: CustomerUpdate,
    db: AsyncSession = Depends(get_db_customer),
    auth: AuthContext = Depends(get_auth_context),
):
    return await update_customer(
        request=request, uuid=uuid, data=data, db=db, auth=auth
    )
