from pydantic import BaseModel


class PaginationResponse(BaseModel):
    count: int
    offset: int
    limit: int
    has_more: bool
