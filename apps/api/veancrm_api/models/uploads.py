from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship

from liderix_api.db import Base
from .mixins import TimestampMixin, SoftDeleteMixin


class Upload(Base, TimestampMixin, SoftDeleteMixin):
    """
    Универсальные загрузки файлов, привязанные к пользователю и к произвольной сущности
    через (owner_type, owner_id). Работает совместно с User.uploads.
    """
    __tablename__ = "uploads"

    # PK
    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False,
    )

    # Владелец файла (пользователь, загрузивший файл)
    user_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Полиморфная привязка к сущности (например: 'Project', 'Task', 'Organization', ...)
    owner_type = Column(String(50), nullable=False, index=True)
    owner_id = Column(PG_UUID(as_uuid=True), nullable=False, index=True)

    # Метаданные файла
    filename = Column(String(255), nullable=False)
    url = Column(String(1024), nullable=False)
    content_type = Column(String(100), nullable=False)
    size = Column(Integer, nullable=False)

    # Ключ в объектном хранилище (уникален)
    storage_key = Column(String(255), nullable=False, unique=True, index=True)

    # Связи
    user = relationship(
        "User",
        back_populates="uploads",
        lazy="selectin",
    )

    __table_args__ = (
        Index("ix_uploads_owner", "owner_type", "owner_id"),
        Index("ix_uploads_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Upload id={self.id} filename={self.filename} owner={self.owner_type}:{self.owner_id}>"