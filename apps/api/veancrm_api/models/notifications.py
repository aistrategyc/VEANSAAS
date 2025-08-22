# apps/api/liderix_api/models/notifications.py
from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum as PythonEnum

from sqlalchemy import (
    Column,
    String,
    DateTime,
    Enum,
    Integer,
    ForeignKey)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import relationship

from liderix_api.db import Base
from .mixins import TimestampMixin, SoftDeleteMixin, OrgFKMixin


class NotificationType(PythonEnum):
    """
    Тип уведомления.
    """
    EMAIL = "email"
    IN_APP = "in_app"
    PUSH = "push"


class NotificationStatus(PythonEnum):
    """
    Статус отправки уведомления.
    """
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"


class Notification(Base, TimestampMixin, SoftDeleteMixin, OrgFKMixin):
    """
    Модель для хранения уведомлений.
    """
    __tablename__ = "notifications"

    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False)
    user_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True)
    type = Column(
        Enum(NotificationType, native_enum=False),
        nullable=False)
    status = Column(
        Enum(NotificationStatus, native_enum=False),
        default=NotificationStatus.PENDING,
        nullable=False)
    recipient = Column(
        String(255),
        nullable=False)
    subject = Column(
        String(255),
        nullable=True)
    body = Column(
        String(2000),
        nullable=True)
    payload = Column(
        JSONB,
        nullable=True,
        default=dict)
    attempts = Column(
        Integer,
        default=0,
        nullable=False)
    last_attempt_at = Column(
        DateTime(timezone=True),
        nullable=True)
    scheduled_at = Column(
        DateTime(timezone=True),
        nullable=True)
    sent_at = Column(
        DateTime(timezone=True),
        nullable=True)

    # Связи
    user = relationship(
        "User",
        cascade="none")