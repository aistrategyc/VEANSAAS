# apps/api/liderix_api/models/kpi.py
from __future__ import annotations

import uuid

from sqlalchemy import Column, String, Float, Boolean
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship

from liderix_api.db import Base
from .mixins import TimestampMixin, SoftDeleteMixin, OrgFKMixin

class KPI(Base, TimestampMixin, SoftDeleteMixin, OrgFKMixin):
    """
    Модель ключевого показателя эффективности (KPI).
    """
    __tablename__ = "kpis"

    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False)
    name = Column(
        String(255),
        nullable=False)
    description = Column(
        String(1024),
        nullable=True)
    target_value = Column(
        Float,
        nullable=False)
    current_value = Column(
        Float,
        default=0.0,
        nullable=False)
    unit = Column(
        String(50),
        nullable=True)
    is_active = Column(
        Boolean,
        default=True,
        nullable=False)
    on_track = Column(
        Boolean,
        default=True,
        nullable=False)

    # Связи
    organization = relationship(
        "Organization",
        lazy="selectin",
        cascade="none",
        overlaps="kpis",
    )

    __mapper_args__ = {"eager_defaults": True}