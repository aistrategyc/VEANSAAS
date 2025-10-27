from datetime import datetime
from decimal import Decimal
from typing import List
from uuid import UUID

from pydantic import BaseModel, Field, model_validator

from shared.enums.appointment import AppointmentStatusEnum
from shared.schemas.company_units.service import ServiceSimpleResponse
from shared.schemas.mixins import PaginationResponse, TimestampMixin, UUIDMixin
from shared.schemas.user import UserSimpleResponse


class AppointmentBase(BaseModel):
    customer_uuid: UUID
    master_uuid: UUID
    service_uuid: UUID
    date_time: datetime
    duration: int = Field(ge=0)
    price: Decimal = Field(ge=0)
    note: str = Field(default='')


class AppointmentResponse(AppointmentBase, UUIDMixin, TimestampMixin):
    service_uuid: UUID | None = Field(default=None)

    class Config:
        from_attributes = True


class AppointmentStatusBase(BaseModel):
    status: AppointmentStatusEnum
    comment: str | None = Field(default=None)


class AppointmentStatusCreate(AppointmentStatusBase):
    pass


class AppointmentStatusResponse(AppointmentStatusBase, UUIDMixin, TimestampMixin):
    created_by_uuid: UUID


class AppointmentInfoResponse(AppointmentBase):
    service_uuid: UUID | None = Field(default=None)
    master: UserSimpleResponse | None = Field(default=None)
    service: ServiceSimpleResponse | None = Field(default=None)

    class Config:
        from_attributes = True


class AppointmentListResponse(BaseModel):
    items: List[AppointmentInfoResponse]
    pagination: PaginationResponse


class AppointmentAttributeValueBase(BaseModel):
    attribute_uuid: UUID
    value: str | None = Field(default=None)
    option_uuid: UUID | None = Field(default=None)


class AppointmentAttributeValueResponse(
    AppointmentAttributeValueBase, UUIDMixin, TimestampMixin
):
    appointment_uuid: UUID

    class Config:
        from_attributes = True


class AppointmentAttributeValueCreate(AppointmentAttributeValueBase):
    @model_validator(mode='after')
    def validate_value_or_option(cls, values):
        print(values, 'values')
        filled_fields = sum([values.value is not None, values.option_uuid is not None])
        print(filled_fields, 'filled_fields')
        if filled_fields == 0:
            raise ValueError('Either "value" or "option_uuid" must be provided')
        elif filled_fields > 1:
            raise ValueError('Only one of "value" or "option_uuid" can be provided')

        return values


class AppointmentCreate(AppointmentBase):
    attributes: List[AppointmentAttributeValueCreate] | None = Field(default=None)
