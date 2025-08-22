# apps/api/liderix_api/models/rate_limits.py
from __future__ import annotations

import uuid
from sqlalchemy import Column, String, Integer, DateTime, Index
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.sql import func

from liderix_api.db import Base
from .mixins import TimestampMixin, OrgFKMixin


class RateLimit(Base, OrgFKMixin, TimestampMixin):
    __tablename__ = "rate_limits"

    __table_args__ = (
        Index("ix_rate_limit_key", "key"),
    )

    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False,
    )

    # Ключ вида: "rate_limit:/auth/login:1.2.3.4" или без org — зависит от твоей логики
    key = Column(String(255), nullable=False, index=True)

    hits = Column(Integer, nullable=False, default=0)

    # временное окно
    window_start = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    window_end = Column(DateTime(timezone=True), nullable=False)

    def __repr__(self) -> str:
        return f"<RateLimit id={self.id} key={self.key!r} hits={self.hits}>"