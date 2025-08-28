from typing import Dict

from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    success: bool = Field(default=False)
    error: str
    details: str | list | dict | None


class FieldError(BaseModel):
    code: str = Field(...)
    message: str = Field(...)


class ValidationError(BaseModel):
    detail: str = Field(default='Validation failed')
    errors: Dict[str, FieldError]
