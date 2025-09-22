from uuid import UUID

from fastapi import HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from shared.dependencies import AuthContext
from shared.models.company_units.service import Service, ServiceCategory
from shared.schemas.company_units.service import (
    ServiceCategoryCreate,
    ServiceCategoryUpdate,
    ServiceCreate,
)
from shared.utils import update_model_from_dict


async def crete_category(
    request: Request, data: ServiceCategoryCreate, db: AsyncSession, auth: AuthContext
):
    service_category_data = data.model_dump()
    db_service_category = ServiceCategory(
        **service_category_data,
        organization_uuid=auth.organization_uuid,
    )
    db.add(db_service_category)

    await db.commit()
    return db_service_category


async def get_list_categories(request: Request, db: AsyncSession, auth: AuthContext):
    result = await db.execute(
        select(ServiceCategory).where(
            ServiceCategory.organization_uuid == auth.organization_uuid
        )
    )
    db_service_category = result.scalars().all()
    return db_service_category


async def update_category(
    request: Request,
    uuid: UUID,
    data: ServiceCategoryUpdate,
    db: AsyncSession,
    auth: AuthContext,
):
    db_service_category = await db.get(ServiceCategory, uuid)

    if not db_service_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Studio not found'
        )

    update_data = data.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )
    await update_model_from_dict(
        model_instance=db_service_category, update_data=update_data
    )
    await db.commit()

    return db_service_category


async def create_service(
    request: Request, data: ServiceCreate, db: AsyncSession, auth: AuthContext
):
    service_data = data.model_dump()
    db_service = Service(
        **service_data,
        organization_uuid=auth.organization_uuid,
    )
    db.add(db_service)

    await db.commit()
    return db_service
