from uuid import UUID

from fastapi import HTTPException, status

from shared.schemas.auth import AuthUserResponse
from shared.schemas.error import FieldError, ValidationError
from shared.schemas.user import (
    UserCreateInternal,
    UserResponse,
    UserUniquenessCheckRequest,
    UserUniquenessCheckResponse,
)
from shared.service_clients.base import BaseServiceClient


class UserServiceClient(BaseServiceClient):
    async def check_uniqueness(
        self, request_data: UserUniquenessCheckRequest
    ) -> UserUniquenessCheckResponse:
        data = await self._make_request(
            'POST',
            'check-uniqueness-user',
            payload=request_data.model_dump(),
        )
        uniqueness_result = UserUniquenessCheckResponse(**data)

        if not uniqueness_result.is_valid:
            errors = {}
            if uniqueness_result.username_exists:
                errors['username'] = FieldError(
                    code='username_exists',
                    message='Username already taken',
                )

            if uniqueness_result.email_exists:
                errors['email'] = FieldError(
                    code='email_exists',
                    message='Email already registered',
                )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ValidationError(errors=errors).model_dump(),
            )

        return uniqueness_result

    async def create_user(self, request_data: UserCreateInternal) -> UserResponse:
        data = await self._make_request(
            'POST',
            '',
            payload=request_data.model_dump(),
        )
        return UserResponse(**data)

    async def get_user_for_auth(self, username: str) -> AuthUserResponse:
        data = await self._make_request(
            method='GET',
            endpoint=f'{username}/auth',
        )
        return AuthUserResponse(**data)

    async def delete_user(self, user_uuid: UUID):
        await self._make_request(method='DELETE', endpoint=str(user_uuid))
