import aiohttp
from fastapi import HTTPException, status

from shared.config import settings
from shared.schemas.error import FieldError, ValidationError
from shared.schemas.organization import OrganizationCreateRequest, OrganizationResponse
from shared.schemas.user import (
    UserCreateInternal,
    UserResponse,
    UserUniquenessCheckRequest,
    UserUniquenessCheckResponse,
)


async def check_user_uniqueness_with_user_service(
    request_data: UserUniquenessCheckRequest,
) -> UserUniquenessCheckResponse:
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(
                url=f'{settings.USER_SERVICE_URL}/check-uniqueness-user',
                json=request_data.model_dump(),
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
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(
                url=f'{settings.USER_SERVICE_URL}',
                json=request_data.model_dump(),
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
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(
                url=f'{settings.ORG_SERVICE_URL}',
                json=request_data.model_dump(),
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
