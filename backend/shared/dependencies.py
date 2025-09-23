from typing import List
from uuid import UUID

from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel

from shared.config.config import settings
from shared.service_clients.company_units import (
    CompanyUnitsInviteServiceClient,
    CompanyUnitsOrganizationServiceClient,
)
from shared.service_clients.user import UserServiceClient

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')


class UserInfo(BaseModel):
    uuid: UUID | str
    is_active: bool
    is_verified: bool


class AuthContext:
    def __init__(self, payload: dict):
        self._payload = payload
        self._type = payload.get('type')

    @property
    def is_service(self) -> bool:
        return self._type == 'service'

    @property
    def is_user(self) -> bool:
        return self._type == 'user'

    @property
    def user(self) -> UserInfo | None:
        self._user_info = UserInfo(
            uuid=self._payload.get('user_uuid'),
            is_active=self._payload.get('is_active', False),
            is_verified=self._payload.get('is_verified', False),
        )
        return self._user_info

    @property
    def raw_payload(self):
        return self._payload

    @property
    def organization_uuid(self) -> str | UUID | None:
        return self._payload.get('organization_uuid', None)

    @property
    def studio_uuid(self) -> str | UUID | None:
        return self._payload.get('studio_uuid', None)

    @property
    def studios_uuid(self) -> List[str | UUID]:
        roles_data = self._payload.get('roles', {}).get('studios', {})
        return list(roles_data.keys())

    @property
    def roles(self) -> set:
        roles_data = self._payload.get('roles', {})
        unique_roles = set()
        for category in roles_data.values():
            if isinstance(category, dict):
                for roles_list in category.values():
                    unique_roles.update(roles_list)

        return self._payload.get('roles', {})


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    studio_uuid: str | None = Header(None, alias='X-Studio-UUID'),
) -> AuthContext:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        if payload.get('type') != 'user':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail='Invalid token type'
            )
        user_uuid = payload.get('user_uuid')
        is_active = payload.get('is_active', False)
        is_verified = payload.get('is_verified', False)
        if not user_uuid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token payload'
            )

        if not user_uuid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found'
            )

        if not is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='User account is deactivated',
            )

        if not is_verified:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='User account is not verified',
            )

        return AuthContext(
            payload={
                **payload,
                'studio_uuid': studio_uuid,
            }
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid user token',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token'
        )


async def get_service_token(token: str = Depends(oauth2_scheme)) -> AuthContext:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY_SERVICE,
            algorithms=[settings.ALGORITHM],
        )

        if payload.get('type') != 'service':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail='Invalid token type'
            )
        return AuthContext(payload=payload)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid service token',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token type'
        )


async def get_auth_context(
    token: str = Depends(oauth2_scheme),
    studio_uuid: str | None = Header(None, alias='X-Studio-UUID'),
) -> AuthContext:
    try:
        return await get_service_token(token=token)
    except HTTPException:
        pass

    try:
        return await get_current_user(token=token, studio_uuid=studio_uuid)
    except HTTPException:
        pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='No valid authentication token provided',
    )


async def get_user_service():
    return UserServiceClient(
        service_url=settings.USER_SERVICE_URL, service_name=' user'
    )


async def get_company_units_organization_service():
    return CompanyUnitsOrganizationServiceClient(
        service_url=settings.COMPANY_UNITS_SERVICE_ORGANIZATION_URL,
        service_name='company_units_organization',
    )


async def get_company_units_invite_service():
    return CompanyUnitsInviteServiceClient(
        service_url=settings.COMPANY_UNITS_SERVICE_INVITE_URL,
        service_name='company_units_invite',
    )
