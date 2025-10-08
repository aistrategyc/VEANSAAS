from decimal import Decimal
from typing import List
from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, Integer, Numeric, String, Text, Uuid, true
from sqlalchemy.orm import Mapped, mapped_column, relationship

from shared.database import Base
from shared.enums.company_units import AttributeType
from shared.models.company_units.common import organization_uuid
from shared.models.mixins import created_at, updated_at, uuid_primary_key


class ServiceCategory(Base):
    __tablename__ = 'service_categories'
    __table_args__ = {'schema': 'organization_service'}

    uuid: Mapped[uuid_primary_key]
    organization_uuid: Mapped[organization_uuid]
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, server_default=true())
    services: Mapped[List['Service']] = relationship(
        back_populates='category',
        lazy='noload',
        foreign_keys='Service.category_uuid',
        cascade='all, delete',
    )
    attributes: Mapped[List['CategoryAttribute']] = relationship(
        back_populates='category',
        lazy='noload',
        foreign_keys='CategoryAttribute.category_uuid',
        cascade='all, delete',
    )
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class CategoryAttribute(Base):
    __tablename__ = 'category_attributes'
    __table_args__ = {'schema': 'organization_service'}

    uuid: Mapped[uuid_primary_key]
    organization_uuid: Mapped[organization_uuid]
    category_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.service_categories.uuid', ondelete='CASCADE'),
    )
    category: Mapped['ServiceCategory'] = relationship(
        back_populates='attributes',
        foreign_keys=[category_uuid],
        lazy='noload',
        cascade='all, delete',
    )
    attribute_options: Mapped[List['AttributeOption']] = relationship(
        back_populates='attribute',
        lazy='noload',
        foreign_keys='AttributeOption.attribute_uuid',
        cascade='all, delete',
    )
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    type: Mapped[AttributeType]
    sort_order: Mapped[int] = mapped_column(Integer, server_default='0')
    is_required: Mapped[bool] = mapped_column(Boolean, server_default=true())
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class AttributeOption(Base):
    __tablename__ = 'attribute_options'
    __table_args__ = {'schema': 'organization_service'}

    uuid: Mapped[uuid_primary_key]
    organization_uuid: Mapped[organization_uuid]
    attribute_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.category_attributes.uuid', ondelete='CASCADE'),
    )
    attribute: Mapped['CategoryAttribute'] = relationship(
        back_populates='attribute_options',
        foreign_keys=[attribute_uuid],
        lazy='noload',
        cascade='all, delete',
    )
    value: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class Service(Base):
    __tablename__ = 'services'
    __table_args__ = {'schema': 'organization_service'}

    uuid: Mapped[uuid_primary_key]
    organization_uuid: Mapped[organization_uuid]
    category_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.service_categories.uuid', ondelete='CASCADE'),
    )
    category: Mapped['ServiceCategory'] = relationship(
        back_populates='services',
        foreign_keys=[category_uuid],
        lazy='noload',
        cascade='all, delete',
    )
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    base_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), server_default='0.00')
    is_active: Mapped[bool] = mapped_column(Boolean, server_default=true())
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]
