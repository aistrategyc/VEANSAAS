from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Union
from uuid import UUID

from config import auth_settings
from fastapi import HTTPException, status
from jose import JWTError, jwt
from security import pwd_context


async def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)


async def create_access_token(data: Dict[str, Any]) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=auth_settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    data.update(
        {
            'type': 'user',
            'iss': 'iss-auth-user-vean-saas-v1',
            'exp': expire,
        }
    )
    encoded_jwt = jwt.encode(
        data, auth_settings.SECRET_KEY, algorithm=auth_settings.ALGORITHM
    )
    return encoded_jwt


async def create_refresh_token(data: Dict[str, Any]) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        hours=auth_settings.REFRESH_TOKEN_EXPIRE_HOURS
    )
    data.update(
        {
            'type': 'refresh',
            'iss': 'iss-auth-user-vean-saas-v1',
            'exp': expire,
        }
    )

    encoded_jwt = jwt.encode(
        data, auth_settings.SECRET_KEY, algorithm=auth_settings.ALGORITHM
    )
    return encoded_jwt


async def create_verification_token(data: Dict[str, Union[str, datetime | UUID]]):
    expire = datetime.now(timezone.utc) + timedelta(hours=24)
    data.update(
        {
            'exp': expire,
        }
    )
    encoded_jwt = jwt.encode(
        data, auth_settings.VERIFICATION_SECRET_KEY, algorithm=auth_settings.ALGORITHM
    )
    return encoded_jwt


async def get_verification_token(token: str):
    try:
        payload = jwt.decode(
            token,
            auth_settings.VERIFICATION_SECRET_KEY,
            algorithms=[auth_settings.ALGORITHM],
        )

        if payload.get('type') != 'verification':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail='Invalid token type'
            )

        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid token',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token'
        )
