from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from shared.dependencies import AuthContext
from shared.models.company_units.service import ServiceCategory
from shared.schemas.company_units.service import ServiceCategoryCreate


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
