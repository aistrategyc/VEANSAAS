from decimal import Decimal
from typing import List
from uuid import UUID

from pydantic import BaseModel, Field

from shared.enums.company_units import AttributeType
from shared.schemas.mixins import TimestampMixin, UUIDMixin


class ServiceBase(BaseModel):
    name: str = Field(max_length=255)
    description: str | None = Field(default=None)
    base_price: Decimal = Field(ge=Decimal('0.00'))
    is_active: bool = Field(default=True)


class ServiceCreate(ServiceBase):
    category_uuid: UUID


class ServiceUpdate(ServiceBase):
    name: str | None = Field(default=None, max_length=255)
    base_price: Decimal | None = Field(default=None, ge=Decimal('0.00'))
    is_active: bool | None = Field(default=None)


class ServiceResponse(ServiceBase, UUIDMixin, TimestampMixin):
    organization_uuid: UUID
    category_uuid: UUID


class ServiceCategoryBase(BaseModel):
    name: str = Field(max_length=255)
    description: str | None = Field(default=None)
    is_active: bool = Field(default=True)


class ServiceCategoryUpdate(ServiceCategoryBase):
    name: str | None = Field(default=None, max_length=255)


class ServiceCategoryResponse(ServiceCategoryBase, UUIDMixin, TimestampMixin):
    organization_uuid: UUID


class CategoryAttributeBase(BaseModel):
    name: str = Field(max_length=255)
    description: str | None = Field(default=None)
    type: AttributeType
    sort_order: int = Field(default=0, ge=0)
    is_required: bool = Field(default=True)


class CategoryAttributeCreate(CategoryAttributeBase):
    category_uuid: UUID


class CategoryAttributeUpdate(CategoryAttributeBase):
    name: str | None = Field(default=None, max_length=255)
    type: AttributeType | None = Field(default=None)
    sort_order: int | None = Field(default=None, ge=0)
    is_required: bool | None = Field(default=None)


class CategoryAttributeResponse(CategoryAttributeBase, UUIDMixin, TimestampMixin):
    organization_uuid: UUID
    category_uuid: UUID


class AttributeOptionBase(BaseModel):
    value: str = Field(max_length=255)


class AttributeOptionCreate(AttributeOptionBase):
    attribute_uuid: UUID


class AttributeOptionResponse(AttributeOptionBase, UUIDMixin, TimestampMixin):
    attribute_uuid: UUID


class AttributeOptionUpdate(AttributeOptionBase):
    pass


class ServiceCategoryCreate(ServiceCategoryBase):
    attributes: List[CategoryAttributeBase] | None = Field(default=None)
