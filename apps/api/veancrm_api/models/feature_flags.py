# apps/api/liderix_api/models/feature_flags.py
from __future__ import annotations

import uuid
from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB

from liderix_api.db import Base
from .mixins import TimestampMixin

class FeatureFlag(Base, TimestampMixin):
    """
    Модель для хранения флажков функций (feature flags).
    """
    __tablename__ = "feature_flags"

    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False)
    key = Column(
        String(100),
        unique=True,
        index=True,
        nullable=False)
    description = Column(
        String(255),
        nullable=True)
    enabled_globally = Column(
        Boolean,
        default=False,
        nullable=False)
    rules = Column(
        JSONB,
        nullable=True,
        default=list)