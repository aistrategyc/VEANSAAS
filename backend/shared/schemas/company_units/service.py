from decimal import Decimal
from typing import List
from uuid import UUID

from pydantic import BaseModel, Field

from shared.enums.company_units import AttributeType
from shared.schemas.mixins import PaginationResponse, TimestampMixin, UUIDMixin


class ServiceBase(BaseModel):
    name: str = Field(max_length=255)
    description: str | None = Field(default=None)
    base_price: float = Field(ge=0.00)
    is_active: bool = Field(default=True)


class ServiceSimpleResponse(BaseModel):
    uuid: UUID
    name: str

    class Config:
        from_attributes = True


class ServiceCreate(ServiceBase):
    category_uuid: UUID


class ServiceUpdate(ServiceBase):
    name: str | None = Field(default=None, max_length=255)
    base_price: Decimal | None = Field(default=None, ge=Decimal('0.00'))
    is_active: bool | None = Field(default=None)
    category_uuid: UUID


class ServiceCategoryBase(BaseModel):
    name: str = Field(max_length=255)
    description: str | None = Field(default=None)
    is_active: bool = Field(default=True)


class ServiceCategoryUpdate(ServiceCategoryBase):
    name: str | None = Field(default=None, max_length=255)


class ServiceCategorySelection(BaseModel):
    uuid: UUID
    name: str = Field(max_length=255)


class CategoryAttributeBase(BaseModel):
    name: str = Field(max_length=255)
    description: str | None = Field(default=None)
    type: AttributeType
    sort_order: int = Field(default=0, ge=0)
    is_required: bool = Field(default=True)


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


class CategoryAttributeCreate(CategoryAttributeBase):
    category_uuid: UUID
    options: List[AttributeOptionBase] | None = Field(default=None)


class CategoryAttributeWithoutCategoryCreate(CategoryAttributeBase):
    options: List[AttributeOptionBase] | None = Field(default=None)


class AttributeOptionCreate(AttributeOptionBase):
    attribute_uuid: UUID


class AttributeOptionResponse(AttributeOptionBase, UUIDMixin, TimestampMixin):
    attribute_uuid: UUID

    class Config:
        from_attributes = True


class AttributeOptionUpdate(AttributeOptionBase):
    pass


class ServiceCategoryCreate(ServiceCategoryBase):
    attributes: List[CategoryAttributeWithoutCategoryCreate]


class ServiceResponse(ServiceBase, UUIDMixin, TimestampMixin):
    organization_uuid: UUID
    category_uuid: UUID

    class Config:
        from_attributes = True


class CategoryAttributeDetailResponse(CategoryAttributeBase, UUIDMixin, TimestampMixin):
    organization_uuid: UUID
    category_uuid: UUID
    attribute_options: List[AttributeOptionResponse] | None = Field(default=None)

    class Config:
        from_attributes = True


class ServiceCategoryDetailResponse(ServiceCategoryBase, UUIDMixin, TimestampMixin):
    organization_uuid: UUID
    attributes: List[CategoryAttributeDetailResponse]

    class Config:
        from_attributes = True


class ServiceCategoryDetailListResponse(BaseModel):
    items: List[ServiceCategoryDetailResponse]
    pagination: PaginationResponse


class ServiceDetailResponse(ServiceBase, UUIDMixin, TimestampMixin):
    organization_uuid: UUID
    category_uuid: UUID
    category: ServiceCategoryDetailResponse | None = Field(default=None)


class ServiceCategoryResponse(ServiceCategoryBase, UUIDMixin, TimestampMixin):
    organization_uuid: UUID

    class Config:
        from_attributes = True


class ServiceWithCategoryResponse(ServiceBase, UUIDMixin, TimestampMixin):
    organization_uuid: UUID
    category: ServiceCategoryResponse | None = Field(default=None)

    class Config:
        from_attributes = True


class ServiceWithCategoryListResponse(BaseModel):
    items: List[ServiceWithCategoryResponse]
    pagination: PaginationResponse
