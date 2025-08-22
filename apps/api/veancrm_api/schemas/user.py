# apps/api/liderix_api/schemas/user.py
from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator, model_validator
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from enum import Enum as PythonEnum


class UserRole(str, PythonEnum):
    ADMIN = "admin"
    MEMBER = "member"
    GUEST = "guest"


class UserBase(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr

    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        return v.strip().lower()


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8, max_length=128)
    role: Optional[UserRole] = None
    position: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None

    @field_validator('username')
    @classmethod
    def validate_username_opt(cls, v: Optional[str]) -> Optional[str]:
        return v.strip().lower() if v else v


class UserProfileUpdate(BaseModel):
    """Schema for updating user profile"""
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    position: Optional[str] = Field(None, max_length=200)
    bio: Optional[str] = Field(None, max_length=500)
    timezone: Optional[str] = Field(None, max_length=50)
    language: Optional[str] = Field(None, max_length=10)

    @field_validator('username')
    @classmethod
    def validate_username_opt(cls, v: Optional[str]) -> Optional[str]:
        return v.strip().lower() if v else v

    @field_validator('first_name', 'last_name')
    @classmethod
    def validate_names(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if v else v


class UserPasswordChange(BaseModel):
    """Schema for password change"""
    current_password: str = Field(min_length=1)
    new_password: str = Field(min_length=8, max_length=128)
    confirm_password: str = Field(min_length=8, max_length=128)

    @model_validator(mode='after')
    def validate_passwords_match(self):
        if self.new_password != self.confirm_password:
            raise ValueError('Passwords do not match')
        return self


class UserPreferencesUpdate(BaseModel):
    """Schema for updating user preferences"""
    theme: Optional[str] = Field(None, pattern="^(light|dark|auto)$")
    language: Optional[str] = Field(None, max_length=10)
    timezone: Optional[str] = Field(None, max_length=50)
    notifications_email: Optional[bool] = None
    notifications_push: Optional[bool] = None
    dashboard_layout: Optional[Dict[str, Any]] = None
    default_page_size: Optional[int] = Field(None, ge=10, le=100)


class UserSearchResponse(BaseModel):
    """Schema for user search results"""
    id: UUID
    username: str
    email: str
    full_name: str
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class UserStatsResponse(BaseModel):
    """Schema for user statistics"""
    user_id: UUID
    username: str
    organization_count: int
    role_distribution: Dict[str, int]
    last_login: Optional[str] = None
    account_age_days: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class UserRead(UserBase):
    id: UUID
    client_id: Optional[UUID] = None
    role: UserRole
    position: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    timezone: Optional[str] = None
    language: Optional[str] = None
    last_login_at: Optional[datetime] = None
    password_changed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class UserListResponse(BaseModel):
    items: List[UserRead]
    total: int
    page: int
    page_size: int
    has_next: bool
    has_prev: bool

    model_config = ConfigDict(from_attributes=True)