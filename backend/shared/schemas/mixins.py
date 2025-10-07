from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class PaginationResponse(BaseModel):
    count: int
    offset: int
    limit: int
    has_more: bool


class TimestampMixin(BaseModel):
    created_at: datetime
    updated_at: datetime


class UUIDMixin(BaseModel):
    uuid: UUID
