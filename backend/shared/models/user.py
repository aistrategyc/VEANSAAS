from typing import List

from sqlalchemy import Boolean, String, true
from sqlalchemy.orm import Mapped, mapped_column, relationship

from shared.database import Base
from shared.models.mixins import (
    PhoneNumberMixin,
    created_at,
    updated_at,
    uuid_primary_key,
)


class User(Base, PhoneNumberMixin):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'user_service'}

    uuid: Mapped[uuid_primary_key]
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str | None] = mapped_column(
        String(255), nullable=True, unique=True, index=True
    )
    phone_number: Mapped[str | None] = mapped_column(
        String(24), nullable=True, unique=True, index=True
    )
    first_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, server_default=true())
    is_verified: Mapped[bool] = mapped_column(Boolean, server_default=true())
    hashed_password: Mapped[str] = mapped_column(String(255))
    studio_memberships: Mapped[List['StudioMember']] = relationship(
        back_populates='user',
        lazy='noload',
        foreign_keys='StudioMember.user_uuid',
        cascade='all, delete',
    )
    organization_memberships: Mapped[List['OrganizationMember']] = relationship(
        back_populates='user',
        lazy='noload',
        foreign_keys='OrganizationMember.user_uuid',
        cascade='all, delete',
    )
    appointments: Mapped[List['Appointment']] = relationship(
        back_populates='master',
        lazy='noload',
        foreign_keys='Appointment.master_uuid',
    )
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    def __str__(self) -> str:
        return f'{self.username} - {self.first_name} {self.last_name}'
