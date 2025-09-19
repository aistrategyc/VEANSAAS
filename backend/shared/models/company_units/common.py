import datetime
from typing import Annotated
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Uuid, false
from sqlalchemy.orm import Mapped, mapped_column

from shared.database import Base
from shared.models.mixins import (
    created_at,
    created_by_uuid,
    updated_at,
    uuid_primary_key,
)

organization_uuid = Annotated[
    UUID,
    mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.organizations.uuid', ondelete='CASCADE'),
    ),
]


class BaseInvite(Base):
    __abstract__ = True

    uuid: Mapped[uuid_primary_key]
    email: Mapped[str] = mapped_column(String(255), index=True)
    token: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    expires_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True))
    is_used: Mapped[bool] = mapped_column(Boolean, server_default=false())
    is_cancelled: Mapped[bool] = mapped_column(Boolean, server_default=false())
    created_by_uuid: Mapped[created_by_uuid]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]
