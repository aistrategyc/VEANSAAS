from uuid import UUID

from pydantic import BaseModel, Field

from shared.schemas.common import TimestampMixin, UUIDMixin


class ServiceCategoryBase(BaseModel):
    name: str = Field(max_length=255)
    description: str | None = Field(default=None)
    is_active: bool = Field(default=True)


class ServiceCategoryCreate(ServiceCategoryBase):
    pass


class ServiceCategoryUpdate(ServiceCategoryBase):
    pass


class ServiceCategoryResponse(ServiceCategoryBase, UUIDMixin, TimestampMixin):
    organization_uuid: UUID
