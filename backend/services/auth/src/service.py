from fastapi import Request
from schemas import RegisterUserRequest
from security import pwd_context
from utils import (
    create_organization_with_org_service,
    create_user_with_user_service,
)

from shared.schemas.user import (
    UserCreateInternal,
)


async def register(request: Request, data: RegisterUserRequest):
    user, organization = data.user, data.organization

    hashed_password = pwd_context.hash(user.password)
    user_internal = UserCreateInternal(
        **user.model_dump(exclude={'password'}), hashed_password=hashed_password
    )
    user_created = await create_user_with_user_service(request_data=user_internal)
    organization.created_by_uuid = str(user_created.uuid)
    await create_organization_with_org_service(request_data=organization)
    return user_created
