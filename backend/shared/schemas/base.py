from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    success: bool = Field(default=False)
    error: str
    details: str | list | dict | None
