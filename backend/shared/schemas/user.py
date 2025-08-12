from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    username: str = Field(max_length=50)
    email: EmailStr = Field(max_length=255)
    first_name: str = Field(max_length=255)
    last_name: str = Field(max_length=255)
    phone_number: str = Field(max_length=24)
    is_active: bool = Field(default=True)


class UserResponse(UserBase):
    uuid: UUID

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserInDB(UserResponse):
    hashed_password: str

    class Config:
        from_attributes = True


class UserCreateInternal(UserBase):
    pass


class UserCreateRequest(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: EmailStr | None = Field(max_length=255)
    first_name: str | None = Field(max_length=255)
    last_name: str | None = Field(max_length=255)
    phone_number: str | None = Field(max_length=24)
    is_active: bool = Field(default=True)


class UserUniquenessCheckRequest(BaseModel):
    username: str
    email: str


class UserUniquenessCheckResponse(BaseModel):
    is_valid: bool = Field(default=False)
    username_exists: bool = Field(default=False)
    email_exists: bool = Field(default=False)
