import datetime
from typing import Annotated
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Uuid, false, func
from sqlalchemy.orm import Mapped, mapped_column

from shared.database import Base

uuid_primary_key = Annotated[
    UUID,
    mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4),
]


created_at = Annotated[
    datetime.datetime, mapped_column(DateTime(timezone=True), server_default=func.now())
]

updated_at = Annotated[
    datetime.datetime, mapped_column(DateTime(timezone=True), server_default=func.now())
]


created_by_uuid = Annotated[
    UUID | None,
    mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('user_service.users.uuid', ondelete='SET NULL'),
        nullable=True,
    ),
]


class BaseInvite(Base):
    __abstract__ = True

    uuid: Mapped[uuid_primary_key]
    email: Mapped[str] = mapped_column(String(255), index=True)
    token: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    expires_at: Mapped[datetime.datetime] = mapped_column(DateTime)
    is_used: Mapped[bool] = mapped_column(Boolean, server_default=false())
    is_cancelled: Mapped[bool] = mapped_column(Boolean, server_default=false())
    created_by_uuid: Mapped[created_by_uuid]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]
