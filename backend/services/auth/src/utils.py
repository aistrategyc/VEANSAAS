from datetime import datetime, timedelta, timezone
from typing import Dict, Union
from uuid import UUID

import aiohttp
from config import auth_settings
from fastapi import HTTPException, status
from jose import jwt
from security import pwd_context

from shared.config import settings
from shared.schemas.error import FieldError, ValidationError
from shared.schemas.organization import OrganizationCreateRequest, OrganizationResponse
from shared.schemas.user import (
    AuthUser,
    UserCreateInternal,
    UserResponse,
    UserUniquenessCheckRequest,
    UserUniquenessCheckResponse,
)
from shared.security import create_service_access_token


async def check_user_uniqueness_with_user_service(
    request_data: UserUniquenessCheckRequest,
) -> UserUniquenessCheckResponse:
    token = await create_service_access_token()
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(
                url=f'{settings.USER_SERVICE_URL}/check-uniqueness-user',
                json=request_data.model_dump(),
                headers={'Authorization': f'Bearer {token}'},
                timeout=aiohttp.ClientTimeout(total=10),
            ) as response:
                if response.status != 200:
                    error = await response.text()
                    raise HTTPException(
                        status_code=response.status,
                        detail=f'User service error: {error}',
                    )
                data = await response.json()
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

        except aiohttp.ClientError as e:
            raise HTTPException(
                status_code=503, detail=f'Service unavailable: {str(e)}'
            )


async def create_user_with_user_service(
    request_data: UserCreateInternal,
) -> UserResponse:
    token = await create_service_access_token()

    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(
                url=f'{settings.USER_SERVICE_URL}',
                json=request_data.model_dump(),
                headers={'Authorization': f'Bearer {token}'},
                timeout=aiohttp.ClientTimeout(total=10),
            ) as response:
                if response.status == 400:
                    error = await response.json()
                    raise HTTPException(
                        status_code=response.status,
                        detail=error.get('detail'),
                    )
                elif response.status != 201:
                    error = await response.text()
                    raise HTTPException(
                        status_code=response.status,
                        detail=f'User service error: {error}',
                    )

                data = await response.json()
                return UserResponse(**data)

        except aiohttp.ClientError as e:
            raise HTTPException(
                status_code=503, detail=f'Service unavailable: {str(e)}'
            )


async def create_organization_with_org_service(
    request_data: OrganizationCreateRequest,
) -> OrganizationResponse:
    token = await create_service_access_token()

    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(
                url=f'{settings.ORG_SERVICE_URL}',
                json=request_data.model_dump(),
                headers={'Authorization': f'Bearer {token}'},
                timeout=aiohttp.ClientTimeout(total=10),
            ) as response:
                if response.status != 201:
                    error = await response.text()
                    raise HTTPException(
                        status_code=response.status,
                        detail=f'Organization service error: {error}',
                    )
                data = await response.json()
                return OrganizationResponse(**data)

        except aiohttp.ClientError as e:
            raise HTTPException(
                status_code=503, detail=f'Service unavailable: {str(e)}'
            )


async def get_user_for_auth(
    username: str,
) -> AuthUser:
    token = await create_service_access_token()
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(
                url=f'{settings.USER_SERVICE_URL}/{username}/auth',
                timeout=aiohttp.ClientTimeout(total=10),
                headers={'Authorization': f'Bearer {token}'},
            ) as response:
                if not response.ok:
                    error_data = await response.json()
                    raise HTTPException(
                        status_code=response.status,
                        detail=f'User service error: {error_data}',
                    )

                data = await response.json()
                return AuthUser(**data)

        except aiohttp.ClientError as e:
            raise HTTPException(
                status_code=503, detail=f'Service unavailable: {str(e)}'
            )


async def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)


async def create_access_token(data: Dict[str, Union[str, datetime | UUID]]):
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=auth_settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    data.update(
        {
            'iss': 'iss-auth-user-vean-saas-v1',
            'exp': expire,
        }
    )
    encoded_jwt = jwt.encode(
        data, auth_settings.SECRET_KEY, algorithm=auth_settings.ALGORITHM
    )
    return encoded_jwt
