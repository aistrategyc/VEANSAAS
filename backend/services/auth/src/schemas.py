from pydantic import BaseModel, Field

from shared.schemas.organization import OrganizationCreateRequest
from shared.schemas.user import UserCreateRequest, UserResponse


class RegisterUserRequest(BaseModel):
    user: UserCreateRequest
    organization: OrganizationCreateRequest


class LoginUserRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = Field(default='bearer')
    user: UserResponse
