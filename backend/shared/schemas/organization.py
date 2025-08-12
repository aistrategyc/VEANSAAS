import enum
from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, Field

from shared.schemas.studio import StudioCreateRequest, StudioResponse


class OrganizationRole(str, enum.Enum):
    OWNER = 'owner'


class OrganizationPlanType(str, enum.Enum):
    SOLO = 'solo'
    NETWORK = 'network'


class OrganizationBase(BaseModel):
    name: str = Field(max_length=244)
    description: str | None = Field(default=None)
    plan_type: OrganizationPlanType
    is_active: bool = Field(default=True)
    created_by_uuid: UUID | str | None = Field(default=None)


class OrganizationCreateRequest(OrganizationBase):
    studio: StudioCreateRequest


class OrganizationResponse(OrganizationBase):
    uuid: UUID
    created_at: datetime
    updated_at: datetime
    studio: StudioResponse | None = Field(default=None)

    class Config:
        from_attributes = True


class OrganizationMemberBase(BaseModel):
    user_uuid: UUID | str
    organization_uuid: UUID | str
    roles: List[OrganizationRole]


class OrganizationMemberCreateRequest(OrganizationMemberBase):
    created_by_uuid: UUID | str
