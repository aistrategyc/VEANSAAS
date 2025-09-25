from uuid import UUID

from database import Base
from sqlalchemy import String, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from shared.enums.customer import Gender
from shared.models.mixins import (
    PhoneNumberMixin,
    created_at,
    updated_at,
    uuid_primary_key,
)


class Customer(Base, PhoneNumberMixin):
    __tablename__ = 'customers'
    uuid: Mapped[uuid_primary_key]
    email: Mapped[str | None] = mapped_column(
        String(255), nullable=True, unique=True, index=True
    )
    phone_number: Mapped[str | None] = mapped_column(
        String(24), nullable=True, unique=True, index=True
    )
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str | None] = mapped_column(String(50), nullable=True)
    gender: Mapped[Gender | None] = mapped_column(nullable=True)
    organization_uuid: Mapped[UUID] = mapped_column(Uuid(as_uuid=True))
    created_by_uuid: Mapped[UUID] = mapped_column(Uuid(as_uuid=True))
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]
