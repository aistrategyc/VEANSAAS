import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class BaseInvite(BaseModel):
    uuid: UUID | str
    email: EmailStr
    token: str = Field(..., max_length=64)
    expires_at: datetime.datetime
    is_used: bool
    is_cancelled: bool
    created_by_uuid: UUID | str
    created_at: datetime.datetime
    updated_at: datetime.datetime


class BaseInviteValidateResponse(BaseModel):
    uuid: UUID | str
    email: EmailStr
    type: Literal['organization', 'studio']


class BaseInviteMemberCreateRequest(BaseModel):
    type: Literal['organization', 'studio']
    user_uuid: UUID | str


class BaseInviteCreateRequest(BaseModel):
    email: EmailStr


class BaseInviteCreateDB(BaseModel):
    email: EmailStr
    token: str = Field(..., max_length=64)
    expires_at: datetime.datetime
    created_by_uuid: UUID | str | None = Field(default=None)


class BaseInviteResponse(BaseModel):
    email: EmailStr
    token: str
    url: str

    class Config:
        from_attributes = True
