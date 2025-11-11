from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserAuth(BaseModel):
    username: str = Field(max_length=50)
    password: str


class AuthUserResponse(BaseModel):
    uuid: UUID | str
    username: str
    is_active: bool
    is_verified: bool
    email: EmailStr | str
    hashed_password: str

    class Config:
        from_attributes = True
