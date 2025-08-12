import enum
from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, Field


class StudioRole(str, enum.Enum):
    STUDIO_OWNER = 'studio_owner'
    MANAGER = 'studio_manager'
    MASTER = 'master'
    ADMINISTRATOR = 'administrator'


class StudioBase(BaseModel):
    name: str = Field(max_length=255)
    organization_uuid: UUID | None = Field(default=None)
    created_by_uuid: UUID | str


class StudioCreateRequest(StudioBase):
    pass


class StudioResponse(StudioBase):
    uuid: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StudioMemberBase(BaseModel):
    user_uuid: UUID | str
    roles: List[StudioRole]
    studio_uuid: UUID | str


class StudioMemberCreateRequest(StudioMemberBase):
    created_by_uuid: UUID | str
