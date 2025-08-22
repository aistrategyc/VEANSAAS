from __future__ import annotations

import uuid

from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import relationship

from liderix_api.db import Base
from .organization import OrgFKMixin, TimestampMixin, SoftDeleteMixin

class SecurityException(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "security_exceptions"

    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False
    )

    user_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True
    )

    exception_type = Column(String, nullable=False)

    details = Column(JSONB, nullable=True)

    occurred_at = Column(DateTime(timezone=True), nullable=False)

    # Relationships
    organization = relationship("Organization")
    user = relationship("User")