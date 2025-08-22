from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import relationship

from liderix_api.db import Base

class EventLog(Base):
    """
    Модель для хранения записей аудита событий.
    """
    __tablename__ = "event_logs"

    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False)
    user_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True)
    org_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=True)
    event_type = Column(
        String(100),
        nullable=False,
        index=True)
    success = Column(
        Boolean,
        default=False,
        nullable=False)
    ip_address = Column(
        String(45),
        nullable=True)
    user_agent = Column(
        String(255),
        nullable=True)
    data = Column(
        JSONB,
        nullable=True,
        default=dict,
        name="metadata"
    )
    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False)

    # ─── Связи ────────────────────────────────────────────────────────────────
    user = relationship("User")
    organization = relationship("Organization")