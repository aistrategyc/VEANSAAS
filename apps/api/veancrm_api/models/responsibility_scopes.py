from __future__ import annotations

import uuid

from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import relationship

from liderix_api.db import Base
from .organization import OrgFKMixin, TimestampMixin, SoftDeleteMixin

class ResponsibilityScope(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "responsibility_scopes"

    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False
    )

    user_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    object_type = Column(String, nullable=False)

    object_id = Column(PG_UUID(as_uuid=True))

    permissions = Column(JSONB, nullable=False)

    # Relationships (без back_populates для избежания циклических зависимостей)
    organization = relationship("Organization")
    user = relationship("User")