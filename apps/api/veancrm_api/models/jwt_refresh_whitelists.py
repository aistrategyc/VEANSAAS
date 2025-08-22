# apps/api/liderix_api/models/jwt_refresh_whitelists.py
from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import relationship

from liderix_api.db import Base
from .mixins import TimestampMixin, SoftDeleteMixin, OrgFKMixin

class JWTRefreshWhitelist(Base, TimestampMixin, SoftDeleteMixin, OrgFKMixin):
    """
    Модель для хранения допустимых JWT refresh token'ов (JTI).
    """
    __tablename__ = "jwt_refresh_whitelists"

    jti = Column(
        String(255),
        primary_key=True,
        nullable=False)
    user_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False)
    # OrgFKMixin обеспечивает org_id
    expires_at = Column(
        DateTime(timezone=True),
        nullable=False)
    revoked = Column(
        Boolean,
        default=False,
        nullable=False)
    revoked_at = Column(
        DateTime(timezone=True),
        nullable=True)
    data = Column(
        JSONB,
        nullable=True,
        default=dict,
        name="metadata"
    )

    user = relationship(
        "User",
        cascade="none")
    organization = relationship(
        "Organization",
        cascade="none")