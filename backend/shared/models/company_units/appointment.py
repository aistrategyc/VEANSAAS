import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from shared.database import Base
from shared.enums.appointment import (
    AppointmentPrepaymentStatusEnum,
    AppointmentStatusEnum,
)
from shared.models.mixins import (
    created_at,
    created_by_uuid,
    updated_at,
    uuid_primary_key,
)
from shared.schemas.company_units.appointment import AppointmentStatusCreate


class Appointment(Base):
    __tablename__ = 'appointments'
    __table_args__ = {'schema': 'organization_service'}

    uuid: Mapped[uuid_primary_key]
    studio_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.studios.uuid', ondelete='CASCADE'),
    )
    customer_uuid: Mapped[UUID] = mapped_column(Uuid(as_uuid=True))
    master_uuid: Mapped[UUID | None] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('user_service.users.uuid', ondelete='SET NULL'),
        nullable=True,
    )

    master: Mapped['User'] = relationship(
        back_populates='appointments',
        foreign_keys=[master_uuid],
        lazy='noload',
    )
    service_uuid: Mapped[UUID | None] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.services.uuid', ondelete='SET NULL'),
        nullable=True,
    )
    service: Mapped['Service'] = relationship(
        back_populates='appointments', foreign_keys=[service_uuid], lazy='noload'
    )
    date_time: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True))
    duration: Mapped[int] = mapped_column(Integer, server_default='0')
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), server_default='0.00')
    note: Mapped[str] = mapped_column(Text, server_default='')
    created_by_uuid: Mapped[created_by_uuid]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    async def create_status(
        self,
        data: AppointmentStatusCreate,
        created_by_uuid: UUID,
    ):
        db_status = AppointmentStatus(
            **data.model_dump(),
            appointment_uuid=self.uuid,
            created_by_uuid=created_by_uuid,
        )

        return db_status


class AppointmentStatus(Base):
    __tablename__ = 'appointment_statuses'
    __table_args__ = {'schema': 'organization_service'}

    uuid: Mapped[uuid_primary_key]
    appointment_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.appointments.uuid', ondelete='CASCADE'),
    )
    status: Mapped[AppointmentStatusEnum] = mapped_column(
        server_default=AppointmentStatusEnum.CONFIRMED.value
    )
    comment: Mapped[str] = mapped_column(Text, server_default='')
    created_by_uuid: Mapped[created_by_uuid]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class AppointmentPrepayment(Base):
    __tablename__ = 'appointment_prepayments'
    __table_args__ = {'schema': 'organization_service'}

    uuid: Mapped[uuid_primary_key]
    appointment_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.appointments.uuid', ondelete='CASCADE'),
    )
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), server_default='0.00')
    status: Mapped[AppointmentPrepaymentStatusEnum] = mapped_column(
        server_default=AppointmentPrepaymentStatusEnum.PENDING.value
    )
    created_by_uuid: Mapped[created_by_uuid]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class AppointmentAttributeValue(Base):
    __tablename__ = 'appointment_attribute_values'
    __table_args__ = {'schema': 'organization_service'}

    uuid: Mapped[uuid_primary_key]
    appointment_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.appointments.uuid', ondelete='CASCADE'),
    )
    attribute_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.category_attributes.uuid', ondelete='CASCADE'),
    )
    value: Mapped[str | None] = mapped_column(Text, nullable=True)
    option_uuid: Mapped[UUID | None] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.attribute_options.uuid', ondelete='CASCADE'),
        nullable=True,
    )
    created_by_uuid: Mapped[created_by_uuid]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]
