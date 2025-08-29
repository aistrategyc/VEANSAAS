from pydantic import BaseModel, Field, field_validator

from shared.schemas.company_units.org import OrganizationCreateRequest
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
    refresh_token: str | None = Field(default=None)
    token_type: str = Field(default='bearer')
