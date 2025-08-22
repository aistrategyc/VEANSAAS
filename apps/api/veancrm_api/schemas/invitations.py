from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from liderix_api.models.memberships import MembershipRole


class InvitationBase(BaseModel):
    invited_email: EmailStr = Field(..., description="Email приглашённого пользователя")
    role: MembershipRole = Field(..., description="Роль, которая будет назначена при акцепте")
    department_id: Optional[UUID] = Field(None, description="Отдел, к которому привяжем участника")
    expires_at: Optional[datetime] = Field(None, description="Срок действия приглашения")


class InvitationCreate(InvitationBase):
    pass


class InvitationRead(BaseModel):
    id: UUID
    org_id: UUID
    invited_email: EmailStr
    role: MembershipRole
    department_id: Optional[UUID]
    token: str
    expires_at: Optional[datetime]
    invited_by_id: Optional[UUID]
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


class InvitationPreflightRead(BaseModel):
    org_id: UUID
    invited_email: EmailStr
    role: MembershipRole
    department_id: Optional[UUID]
    expires_at: Optional[datetime]
    status: str
    organization_name: Optional[str] = None


class InvitationAccept(BaseModel):
    # на будущее можно добавить подтверждение департамента
    pass


class InvitationReject(BaseModel):
    reason: Optional[str] = None