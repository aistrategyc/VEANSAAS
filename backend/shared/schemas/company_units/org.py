from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, Field

from shared.schemas.company_units.common import BaseInviteCreateRequest
from shared.schemas.company_units.enum import OrganizationPlanType, OrganizationRole
from shared.schemas.company_units.studio import StudioCreateRequest, StudioResponse


class OrganizationBase(BaseModel):
    name: str = Field(max_length=244)
    description: str | None = Field(default=None)
    plan_type: OrganizationPlanType
    is_active: bool = Field(default=True)
    created_by_uuid: UUID | str | None = Field(default=None)


class OrganizationMemberBase(BaseModel):
    user_uuid: UUID | str
    organization_uuid: UUID | str
    roles: List[OrganizationRole]


class OrganizationCreateRequest(OrganizationBase):
    studio: StudioCreateRequest


class OrganizationMemberCreateRequest(OrganizationMemberBase):
    created_by_uuid: UUID | str


class OrganizationResponse(OrganizationBase):
    uuid: UUID
    created_at: datetime
    updated_at: datetime
    studio: StudioResponse | None = Field(default=None)

    class Config:
        from_attributes = True


class OrganizationInviteCreate(BaseInviteCreateRequest):
    organization_uuid: UUID | str
    roles: List[OrganizationRole]
