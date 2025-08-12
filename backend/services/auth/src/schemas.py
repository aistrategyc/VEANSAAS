from pydantic import BaseModel

from shared.schemas.organization import OrganizationCreateRequest
from shared.schemas.user import UserCreateRequest


class RegisterUserRequest(BaseModel):
    user: UserCreateRequest
    organization: OrganizationCreateRequest
