import re
from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, field_validator

from shared.schemas.company_units.studio import StudioMemberRoles
from shared.schemas.mixins import PaginationResponse


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
    hashed_password: str


class UserCreateRequest(UserBase):
    username: str
    password: str

    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        v = v.lower().strip()

        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters long')
        if len(v) > 32:
            raise ValueError('Username must be less than 32 characters long')

        if not re.match(r'^[a-z0-9_]+$', v):
            raise ValueError(
                'Username can only contain lowercase letters, numbers, and underscores'
            )

        return v

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        errors = []
        if len(v) < 8:
            errors.append('be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            errors.append('contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            errors.append('contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            errors.append('contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            errors.append('contain at least one special character')

        if errors:
            raise ValueError(f'Password must: {", ".join(errors)}')
        return v


class UserUpdate(BaseModel):
    email: EmailStr | None = Field(max_length=255)
    first_name: str | None = Field(max_length=255)
    last_name: str | None = Field(max_length=255)
    phone_number: str | None = Field(max_length=24)
    is_active: bool = Field(default=True)


class UserUniquenessCheckRequest(BaseModel):
    username: str
    email: str
    phone_number: str | None = Field(default=None)


class UserUniquenessCheckResponse(BaseModel):
    is_valid: bool = Field(default=False)
    username_exists: bool = Field(default=False)
    email_exists: bool = Field(default=False)
    phone_number_exists: bool = Field(default=False)


class UserVerificationEmail(BaseModel):
    user_uuid: UUID | str
    email: str


class UserWitchMemberResponse(UserResponse):
    studio_membership: StudioMemberRoles | None = Field(default=None)


class UserListResponse(BaseModel):
    items: List[UserWitchMemberResponse]
    pagination: PaginationResponse
