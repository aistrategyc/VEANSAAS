from __future__ import annotations

import uuid
from enum import Enum as PythonEnum
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import (
    Column,
    String,
    Enum,
    DateTime,
    UniqueConstraint,
    Index,
    ForeignKey,
    Boolean,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship, validates

from liderix_api.db import Base
from .mixins import TimestampMixin, SoftDeleteMixin, OrgFKMixin
from .memberships import MembershipRole


class InvitationStatus(PythonEnum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"


class Invitation(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    """
    Приглашение пользователя в организацию.
    - invited_email: email приглашённого
    - role: какая роль будет назначена при акцепте
    - department_id: отдел, к которому привяжем membership при акцепте (опционально)
    - token: публичный токен (UUID в виде строки) для ссылки в письме
    - expires_at: срок действия
    - invited_by_id: кто пригласил
    - status: PENDING / ACCEPTED / REJECTED / EXPIRED
    """
    __tablename__ = "invitations"

    __table_args__ = (
        # Не допускаем несколько PENDING-инвайтов на один email в рамках одной орг
        UniqueConstraint(
            "org_id",
            "invited_email",
            "status",
            name="uq_invitation_org_email_status",
        ),
        Index("ix_invitation_token", "token", unique=True),
        Index("ix_invitation_status", "status"),
        Index("ix_invitation_expires_at", "expires_at"),
    )

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)

    invited_email = Column(String(320), nullable=False, index=True)
    role = Column(Enum(MembershipRole, name="membershiprole", native_enum=True), nullable=False)

    department_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("departments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    token = Column(String(64), unique=True, nullable=False, index=True, default=lambda: uuid.uuid4().hex)
    expires_at = Column(DateTime(timezone=True), nullable=True)

    invited_by_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    status = Column(
        Enum(InvitationStatus, name="invitationstatus", native_enum=True),
        default=InvitationStatus.PENDING,
        nullable=False,
    )

    # relationships
    organization = relationship("Organization", lazy="selectin")
    department = relationship("Department", lazy="selectin")
    invited_by = relationship("User", lazy="selectin")

    @validates("invited_email")
    def _normalize_email(self, key, value: str):
        if not value:
            raise ValueError("invited_email is required")
        # простая нормализация
        return value.strip().lower()

    def is_expired(self) -> bool:
        return bool(self.expires_at and datetime.now(timezone.utc) > self.expires_at)

    def __repr__(self) -> str:
        return f"<Invitation id={self.id} org_id={self.org_id} email={self.invited_email} status={self.status.value}>"