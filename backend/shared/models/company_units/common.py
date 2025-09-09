import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    String,
    false,
)
from sqlalchemy.orm import Mapped, mapped_column

from shared.database import Base
from shared.models.base import (
    created_at,
    created_by_uuid,
    updated_at,
    uuid_primary_key,
)


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
