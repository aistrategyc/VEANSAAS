from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    username: str = Field(max_length=50)
    email: EmailStr | None = Field(max_length=255)
    first_name: str | None = Field(max_length=255)
    last_name: str | None = Field(max_length=255)
    is_active: bool = Field(default=True)


class UserResponse(UserBase):
    uuid: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: EmailStr | None = Field(max_length=255)
    first_name: str | None = Field(max_length=255)
    last_name: str | None = Field(max_length=255)
    is_active: bool = Field(default=True)
