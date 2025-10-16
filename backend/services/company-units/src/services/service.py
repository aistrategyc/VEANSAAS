from typing import List
from uuid import UUID

from fastapi import HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from shared.dependencies import AuthContext
from shared.models.company_units.service import (
    AttributeOption,
    CategoryAttribute,
    Service,
    ServiceCategory,
)
from shared.schemas.company_units.service import (
    AttributeOptionCreate,
    AttributeOptionUpdate,
    CategoryAttributeCreate,
    CategoryAttributeUpdate,
    ServiceCategoryCreate,
    ServiceCategoryUpdate,
    ServiceCreate,
    ServiceUpdate,
)
from shared.utils import update_model_from_dict


async def crete_category(
    request: Request, data: ServiceCategoryCreate, db: AsyncSession, auth: AuthContext
):
    service_category_data = data.model_dump(exclude={'attributes'})
    db_service_category = ServiceCategory(
        **service_category_data,
        organization_uuid=auth.organization_uuid,
    )
    db.add(db_service_category)

    if data.attributes:
        await db.flush()

        db_attribute_options = []
        for attribute_data in data.attributes:
            db_attribute = CategoryAttribute(
                **attribute_data.model_dump(exclude={'options'}),
                category_uuid=db_service_category.uuid,
                organization_uuid=auth.organization_uuid,
            )
            db.add(db_attribute)

            if attribute_data.options:
                await db.flush()
                for data_options in attribute_data.options:
                    db_attribute_option = AttributeOption(
                        **data_options.model_dump(),
                        attribute_uuid=db_attribute.uuid,
                        organization_uuid=auth.organization_uuid,
                    )
                    db_attribute_options.append(db_attribute_option)

        db.add_all(db_attribute_options)

    await db.commit()

    result = await db.execute(
        select(ServiceCategory)
        .where(ServiceCategory.uuid == db_service_category.uuid)
        .options(
            joinedload(ServiceCategory.attributes).joinedload(
                CategoryAttribute.attribute_options
            )
        )
    )
    db_service_category_with_relations = result.unique().scalar_one()

    return db_service_category_with_relations


async def get_list_categories(request: Request, db: AsyncSession, auth: AuthContext):
    result = await db.execute(
        select(ServiceCategory)
        .where(ServiceCategory.organization_uuid == auth.organization_uuid)
        .options(
            selectinload(ServiceCategory.attributes).selectinload(
                CategoryAttribute.attribute_options
            )
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
    result = await db.execute(
        select(ServiceCategory).where(
            ServiceCategory.uuid == uuid,
            ServiceCategory.organization_uuid == auth.organization_uuid,
        )
    )
    db_service_category = result.scalar_one_or_none()

    if not db_service_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Service category not found'
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


async def get_list_services(request: Request, db: AsyncSession, auth: AuthContext):
    result = await db.execute(
        select(Service).where(Service.organization_uuid == auth.organization_uuid)
    )
    db_service = result.scalars().all()
    return db_service


async def get_service(
    request: Request, uuid: UUID, db: AsyncSession, auth: AuthContext
):
    result = await db.execute(
        select(Service).where(
            Service.uuid == uuid, Service.organization_uuid == auth.organization_uuid
        )
    )
    db_service = result.scalar_one_or_none()

    if not db_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Service not found'
        )
    return db_service


async def update_service(
    request: Request,
    uuid: UUID,
    data: ServiceUpdate,
    db: AsyncSession,
    auth: AuthContext,
):
    result = await db.execute(
        select(Service).where(
            Service.uuid == uuid, Service.organization_uuid == auth.organization_uuid
        )
    )
    db_service = result.scalar_one_or_none()

    if not db_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Service not found'
        )
    update_data = data.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )
    await update_model_from_dict(model_instance=db_service, update_data=update_data)
    await db.commit()

    return db_service


async def delete_service(
    request: Request, uuid: UUID, db: AsyncSession, auth: AuthContext
):
    result = await db.execute(
        select(Service).where(
            Service.uuid == uuid, Service.organization_uuid == auth.organization_uuid
        )
    )
    db_service = result.scalar_one_or_none()
    if not db_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Service not found'
        )
    await db.delete(db_service)
    await db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def delete_category(
    request: Request, uuid: UUID, db: AsyncSession, auth: AuthContext
):
    result = await db.execute(
        select(ServiceCategory).where(
            ServiceCategory.uuid == uuid,
            ServiceCategory.organization_uuid == auth.organization_uuid,
        )
    )
    db_service_category = result.scalar_one_or_none()
    if not db_service_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Service category not found'
        )
    await db.delete(db_service_category)
    await db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def crete_attribute(
    request: Request, data: CategoryAttributeCreate, db: AsyncSession, auth: AuthContext
):
    attribute_data = data.model_dump()
    db_attribute = CategoryAttribute(
        **attribute_data,
        organization_uuid=auth.organization_uuid,
    )
    db.add(db_attribute)

    await db.commit()
    return db_attribute


async def delete_attribute(
    request: Request, uuid: UUID, db: AsyncSession, auth: AuthContext
):
    result = await db.execute(
        select(CategoryAttribute).where(
            CategoryAttribute.uuid == uuid,
            CategoryAttribute.organization_uuid == auth.organization_uuid,
        )
    )
    db_attribute = result.scalar_one_or_none()
    if not db_attribute:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Attribute not found'
        )
    await db.delete(db_attribute)
    await db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def update_attribute(
    request: Request,
    uuid: UUID,
    data: CategoryAttributeUpdate,
    db: AsyncSession,
    auth: AuthContext,
):
    result = await db.execute(
        select(CategoryAttribute).where(
            CategoryAttribute.uuid == uuid,
            CategoryAttribute.organization_uuid == auth.organization_uuid,
        )
    )
    db_attribute = result.scalar_one_or_none()

    if not db_attribute:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Category attribute not found'
        )
    update_data = data.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )
    await update_model_from_dict(model_instance=db_attribute, update_data=update_data)
    await db.commit()

    return db_attribute


async def delete_attribute_options(
    request: Request, uuid: UUID, db: AsyncSession, auth: AuthContext
):
    result = await db.execute(
        select(AttributeOption).where(
            AttributeOption.uuid == uuid,
            AttributeOption.organization_uuid == auth.organization_uuid,
        )
    )
    db_service_attribute_option = result.scalar_one_or_none()
    if not db_service_attribute_option:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Attribute option not found'
        )
    await db.delete(db_service_attribute_option)
    await db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def update_attribute_options(
    request: Request,
    uuid: UUID,
    data: AttributeOptionUpdate,
    db: AsyncSession,
    auth: AuthContext,
):
    result = await db.execute(
        select(AttributeOption).where(
            AttributeOption.uuid == uuid,
            AttributeOption.organization_uuid == auth.organization_uuid,
        )
    )
    db_service_attribute_option = result.scalar_one_or_none()

    if not db_service_attribute_option:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Attribute option not found'
        )

    update_data = data.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )
    await update_model_from_dict(
        model_instance=db_service_attribute_option, update_data=update_data
    )
    await db.commit()

    return db_service_attribute_option


async def create_attribute_options(
    request: Request,
    data: List[AttributeOptionCreate],
    db: AsyncSession,
    auth: AuthContext,
):
    service_data_list = [item.model_dump() for item in data]

    db_attribute_options = []
    for service_data in service_data_list:
        db_service = AttributeOption(
            **service_data,
            organization_uuid=auth.organization_uuid,
        )
        db_attribute_options.append(db_service)

    db.add_all(db_attribute_options)
    await db.commit()

    return db_attribute_options


async def get_list_services_detail(
    request: Request, db: AsyncSession, auth: AuthContext
):
    result = await db.execute(
        select(Service)
        .where(Service.organization_uuid == auth.organization_uuid)
        .options(
            selectinload(Service.category)
            .selectinload(ServiceCategory.attributes)
            .selectinload(CategoryAttribute.attribute_options)
        )
    )
    db_service = result.scalars().all()
    return db_service
