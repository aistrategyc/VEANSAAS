from datetime import datetime
from decimal import Decimal
from typing import List
from uuid import UUID

from pydantic import BaseModel, Field

from shared.enums.appointment import AppointmentStatusEnum
from shared.schemas.mixins import PaginationResponse, TimestampMixin, UUIDMixin


class AppointmentBase(BaseModel):
    customer_uuid: UUID
    master_uuid: UUID
    service_uuid: UUID
    date_time: datetime
    duration: int = Field(ge=0)
    price: Decimal = Field(ge=0)
    note: str = Field(default='')


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentResponse(AppointmentBase, UUIDMixin, TimestampMixin):
    pass

    class Config:
        from_attributes = True


class AppointmentStatusBase(BaseModel):
    status: AppointmentStatusEnum
    comment: str | None = Field(default=None)


class AppointmentStatusCreate(AppointmentStatusBase):
    pass


class AppointmentStatusResponse(AppointmentStatusBase, UUIDMixin, TimestampMixin):
    created_by_uuid: UUID


class AppointmentListResponse(BaseModel):
    items: List[AppointmentResponse]
    pagination: PaginationResponse
