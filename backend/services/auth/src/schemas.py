from pydantic import BaseModel, Field, field_validator

from shared.schemas.organization import OrganizationCreateRequest
from shared.schemas.user import UserCreateRequest


class RegisterUserRequest(BaseModel):
    user: UserCreateRequest
    organization: OrganizationCreateRequest


class LoginUserRequest(BaseModel):
    username: str
    password: str

    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        v = v.lower().strip()
        return v


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = Field(default='bearer')
