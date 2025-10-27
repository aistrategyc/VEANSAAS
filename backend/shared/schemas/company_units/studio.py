from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, Field

from shared.enums.company_units import StudioRole
from shared.schemas.company_units.invite import (
    BaseInviteCreateDB,
    BaseInviteCreateRequest,
)
from shared.schemas.mixins import PaginationResponse


class StudioBase(BaseModel):
    name: str = Field(max_length=255)
    phone_number: str | None = Field(default=None, max_length=24)
    address: str | None = Field(default=None, max_length=255)
    organization_uuid: UUID | None = Field(default=None)
    created_by_uuid: UUID | str | None = Field(default=None)


class StudioMemberBase(BaseModel):
    user_uuid: UUID | str
    roles: List[StudioRole]
    studio_uuid: UUID | str


class StudioMemberRoles(BaseModel):
    uuid: UUID
    roles: List[StudioRole]

    class Config:
        from_attributes = True


class StudioCreateRequest(StudioBase):
    pass


class StudioResponse(StudioBase):
    uuid: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StudioMemberCreateRequest(StudioMemberBase):
    created_by_uuid: UUID | str | None = Field(default=None)


class StudioInviteCreateRequest(BaseInviteCreateRequest):
    roles: List[StudioRole]


class StudioInviteCreateDB(BaseInviteCreateDB):
    roles: List[StudioRole]
    studio_uuid: UUID | str


class StudioUpdateRequest(BaseModel):
    name: str | None = Field(default=None, max_length=244)
    phone_number: str | None = Field(default=None, max_length=24)
    address: str | None = Field(default=None, max_length=255)
    is_active: bool | None = Field(default=None)


class StudioFilter(BaseModel):
    name: str | None = Field(default=None)


class WithMembersMixin(BaseModel):
    members_count: int


class StudioWithMembersResponse(StudioResponse, WithMembersMixin):
    class Config:
        from_attributes = False


class StudioSelectOptionsResponse(BaseModel):
    uuid: UUID
    name: str


class StudioListResponse(BaseModel):
    items: List[StudioWithMembersResponse]
    pagination: PaginationResponse
