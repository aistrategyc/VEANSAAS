from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, Field

from shared.schemas.company_units.base import BaseInviteCreate
from shared.schemas.company_units.enum import StudioRole


class StudioBase(BaseModel):
    name: str = Field(max_length=255)
    organization_uuid: UUID | None = Field(default=None)
    created_by_uuid: UUID | str | None = Field(default=None)


class StudioMemberBase(BaseModel):
    user_uuid: UUID | str
    roles: List[StudioRole]
    studio_uuid: UUID | str


class StudioCreateRequest(StudioBase):
    pass


class StudioResponse(StudioBase):
    uuid: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StudioMemberCreateRequest(StudioMemberBase):
    created_by_uuid: UUID | str


class StudioInviteCreate(BaseInviteCreate):
    roles: List[StudioRole]
