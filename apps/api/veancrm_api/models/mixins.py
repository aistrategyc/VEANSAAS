# apps/api/liderix_api/models/mixins.py
from datetime import datetime
from sqlalchemy import Column, DateTime, Boolean, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import ForeignKey

class TimestampMixin:
    """
    Mixin для автоматической отметки времени создания и обновления записи.
    """
    __allow_unmapped__ = True

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

class SoftDeleteMixin:
    """
    Mixin для мягкого удаления (soft delete).
    """
    __allow_unmapped__ = True

    is_deleted = Column(
        Boolean,
        default=False,
        nullable=False,
    )
    deleted_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

class OrgFKMixin:
    """
    Mixin для добавления внешнего ключа на организацию.
    """
    __allow_unmapped__ = True

    org_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
