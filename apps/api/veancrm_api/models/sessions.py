from __future__ import annotations

import uuid

from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship

from liderix_api.db import Base
from .mixins import TimestampMixin, SoftDeleteMixin

class Session(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "sessions"

    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False
    )

    user_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    device_info = Column(String, nullable=True)

    ip_address = Column(String, nullable=True)

    expires_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", lazy="selectin", back_populates="sessions")