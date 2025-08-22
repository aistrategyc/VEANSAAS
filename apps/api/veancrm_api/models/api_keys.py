from __future__ import annotations
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import relationship  # ✅ ДОБАВЛЕН ИМПОРТ
from liderix_api.db import Base
from .mixins import TimestampMixin, SoftDeleteMixin

class APIKey(Base, TimestampMixin, SoftDeleteMixin):
    """
    Модель API ключа с поддержкой отметки времени и мягкого удаления.
    """
    __tablename__ = "api_keys"
    
    id: uuid.UUID = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False)
    name: str = Column(
        String(255),
        nullable=False)
    key_hash: str = Column(
        String(128),
        nullable=False)
    scopes: list[str] = Column(
        JSONB,
        nullable=False,
        default=list)
    owner_id: uuid.UUID = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False)
    is_active: bool = Column(
        Boolean,
        default=True,
        nullable=False)
    expires_at: datetime | None = Column(
        DateTime,
        nullable=True)
    
    user = relationship(
        "User",
        back_populates="api_keys",
        primaryjoin="APIKey.owner_id==User.id",
    )