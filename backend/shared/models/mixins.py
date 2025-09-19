import datetime
from typing import Annotated
from uuid import UUID, uuid4

import phonenumbers
from fastapi import HTTPException, status
from sqlalchemy import DateTime, ForeignKey, Uuid, func
from sqlalchemy.orm import mapped_column, validates

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


class PhoneNumberMixin:
    @validates('phone_number')
    def validate_phone_number(self, key, phone_number):
        if phone_number is None:
            return None

        try:
            parsed = phonenumbers.parse(phone_number, None)
            if not phonenumbers.is_valid_number(parsed):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail='Invalid phone number format',
                )
            return phonenumbers.format_number(
                parsed, phonenumbers.PhoneNumberFormat.E164
            )
        except phonenumbers.NumberParseException:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail='Invalid phone number format',
            )
