from uuid import UUID

from fastapi import HTTPException, Request, status
from models import Customer
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from shared.dependencies import AuthContext
from shared.schemas.customer import (
    CustomerCreate,
    CustomerListResponse,
    CustomerResponse,
    CustomerUpdate,
)
from shared.schemas.mixins import PaginationResponse
from shared.utils import update_model_from_dict


async def get_customer_list(
    request: Request,
    offset: int,
    limit: int,
    db: AsyncSession,
    auth: AuthContext,
) -> CustomerListResponse:
    query = select(
        Customer,
    ).filter(Customer.organization_uuid == auth.organization_uuid)

    count_query = (
        select(func.count())
        .where(Customer.organization_uuid == auth.organization_uuid)
        .select_from(Customer)
    )

    query_result = await db.execute(query.offset(offset).limit(limit))

    db_customers = query_result.scalars().all()

    total_count = await db.scalar(count_query) or 0

    return CustomerListResponse(
        items=[CustomerResponse.model_validate(customer) for customer in db_customers],
        pagination=PaginationResponse(
            count=total_count,
            offset=offset,
            limit=limit,
            has_more=(offset + limit) < total_count,
        ),
    )


async def get_customer(
    request: Request, uuid: UUID, db: AsyncSession, auth: AuthContext
):
    result = await db.execute(
        select(Customer).where(
            Customer.uuid == uuid, Customer.organization_uuid == auth.organization_uuid
        )
    )
    db_customer = result.scalar_one_or_none()

    if not db_customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Customer not found'
        )

    return db_customer


async def create_customer(
    request: Request, data: CustomerCreate, db: AsyncSession, auth: AuthContext
):
    if not data.created_by_uuid:
        data.created_by_uuid = auth.user.uuid if auth.is_user else None

    db_customer = Customer(
        **data.model_dump(),
        organization_uuid=auth.organization_uuid,
    )
    db.add(db_customer)

    await db.commit()
    return db_customer


async def update_customer(
    request: Request,
    uuid: UUID,
    data: CustomerUpdate,
    db: AsyncSession,
    auth: AuthContext,
):
    result = await db.execute(
        select(Customer).where(
            Customer.uuid == uuid, Customer.organization_uuid == auth.organization_uuid
        )
    )

    db_customer = result.scalar_one_or_none()

    if not db_customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Customer not found'
        )

    update_data = data.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )
    await update_model_from_dict(model_instance=db_customer, update_data=update_data)
    await db.commit()

    return db_customer
