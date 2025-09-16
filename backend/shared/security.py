from datetime import datetime, timedelta, timezone
from functools import wraps
from typing import Callable

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


def check_permissions(user_roles: list, permission_code: str):
    required_permissions = set()
    config_roles = settings.roles['roles']
    for role in user_roles:
        if role in config_roles:
            role_perms = config_roles[role].get('permissions', [])
            required_permissions.update(role_perms)

    return permission_code in required_permissions


def requires_permission(permission_code: str, key: str = 'auth'):
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            auth_context = kwargs.get(key, None)

            if not auth_context:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail='AuthContext not found in dependencies',
                )

            if auth_context.is_service:
                return await func(*args, **kwargs)

            if not check_permissions(auth_context.roles, permission_code):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail='Access denied'
                )

            return await func(*args, **kwargs)

        return wrapper

    return decorator
