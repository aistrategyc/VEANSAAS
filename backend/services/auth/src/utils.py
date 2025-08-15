from datetime import datetime, timedelta, timezone
from typing import Dict, Union
from uuid import UUID

from config import auth_settings
from jose import jwt
from security import pwd_context


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
