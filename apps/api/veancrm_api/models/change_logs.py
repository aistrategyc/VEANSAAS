# apps/api/liderix_api/models/change_logs.py
from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import relationship

from liderix_api.db import Base

class ChangeLog(Base):
    """
    Модель для хранения логов изменений сущностей.
    """
    __tablename__ = "change_logs"

    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False)
    user_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False)
    org_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=True)
    entity_type = Column(
        String(50),
        nullable=False,
        index=True)
    entity_id = Column(
        PG_UUID(as_uuid=True),
        nullable=False,
        index=True)
    changes = Column(
        JSONB,
        nullable=False,
        default=dict)
    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False)

    # Связи
    user = relationship("User")
    organization = relationship("Organization")