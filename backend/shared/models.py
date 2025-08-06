import datetime
from typing import Annotated
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Uuid, func
from sqlalchemy.orm import mapped_column

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
