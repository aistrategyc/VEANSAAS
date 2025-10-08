from typing import List
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, model_validator

from shared.enums.customer import Gender
from shared.schemas.mixins import PaginationResponse, TimestampMixin, UUIDMixin


class CustomerBase(BaseModel):
    email: EmailStr | None = Field(default=None, max_length=255)
    phone_number: str | None = Field(default=None, max_length=24)
    first_name: str = Field(max_length=50)
    last_name: str | None = Field(default=None, max_length=50)
    gender: Gender | None = Field(default=None)


class CustomerCreate(CustomerBase):
    created_by_uuid: UUID | str | None = Field(default=None)

    @model_validator(mode='after')
    def check_email_or_phone(cls, values):
        email = values.email
        phone_number = values.phone_number

        if email is None and phone_number is None:
            raise ValueError('Either email or phone number must be provided')
        return values


class CustomerUpdate(BaseModel):
    first_name: str | None = Field(default=None, max_length=50)
    last_name: str | None = Field(default=None, max_length=50)
    gender: Gender | None = Field(default=None)


class CustomerResponse(CustomerBase, UUIDMixin, TimestampMixin):
    organization_uuid: UUID
    created_by_uuid: UUID | None = Field(default=None)

    class Config:
        from_attributes = True


class CustomerListResponse(BaseModel):
    items: List[CustomerResponse]
    pagination: PaginationResponse


class CustomerSelectResponse(BaseModel):
    uuid: UUID
    phone_number: str | None = Field(default=None)
    email: EmailStr | None = Field(default=None)
    first_name: str
    last_name: str | None = Field(default=None)

    class Config:
        from_attributes = True


class CustomerSelectOptionsResponse(BaseModel):
    items: List[CustomerSelectResponse]
    pagination: PaginationResponse


class CustomerFilter(BaseModel):
    phone_number: str | None = Field(default=None)
    email: str | None = Field(default=None)
