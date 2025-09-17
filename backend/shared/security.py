from datetime import datetime, timedelta, timezone
from functools import wraps
from typing import Callable, Literal

from fastapi import HTTPException, status
from jose import jwt

from shared.config.config import settings


async def create_service_access_token(service_name: str):
    expire = datetime.now(timezone.utc) + timedelta(minutes=5)
    data = {
        'sub': f'service_{service_name}',
        'type': 'service',
        'iss': 'iss-auth-service-vean-saas-v1',
        'exp': expire,
    }
    encoded_jwt = jwt.encode(
        data, settings.SECRET_KEY_SERVICE, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def check_permissions(
    roles_map: dict,
    studio_uuid: str,
    organization_uuid: str,
    permission: str,
    scope: Literal['orgs', 'studios'],
):
    permissions = set()
    config_roles = settings.roles['roles']
    assigned_roles = roles_map[scope]
    if scope == 'studios':
        assigned_roles = assigned_roles.get(studio_uuid, [])
    else:
        assigned_roles = assigned_roles.get(organization_uuid, [])
    for role in assigned_roles:
        if role in config_roles:
            permissions.update(config_roles[role].get('permissions', []))

    return permission in permissions


def requires_permission(
    permission: str,
    key_auth_context: str = 'auth',
    scope: Literal['orgs', 'studios'] = 'studios',
):
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            auth_context = kwargs.get(key_auth_context, None)

            if not auth_context:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail='AuthContext not found in dependencies',
                )

            if auth_context.is_service:
                return await func(*args, **kwargs)

            if not auth_context.studio_uuid and scope == 'studios':
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail='X-Studio-UUID header is required',
                )

            if not check_permissions(
                roles_map=auth_context.roles,
                studio_uuid=auth_context.studio_uuid,
                organization_uuid=auth_context.organization_uuid,
                permission=permission,
                scope=scope,
            ):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail='Access denied'
                )

            return await func(*args, **kwargs)

        return wrapper

    return decorator


def requires_resource_access(
    key_auth_context: str = 'auth',
    key_uuid: str = 'uuid',
    scope: Literal['orgs', 'studios'] = 'studios',
):
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            auth_context = kwargs.get(key_auth_context, None)

            if not auth_context:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail='AuthContext not found in dependencies',
                )

            if auth_context.is_service:
                return await func(*args, **kwargs)

            uuid = kwargs.get(key_uuid, None)

            if not uuid:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail='Access denied'
                )

            if scope == 'studios':
                if str(uuid) not in auth_context.roles['studios'].keys():
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN, detail='Access denied'
                    )
            else:
                if not uuid or auth_context.organization_uuid != str(uuid):
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN, detail='Access denied'
                    )

            return await func(*args, **kwargs)

        return wrapper

    return decorator
