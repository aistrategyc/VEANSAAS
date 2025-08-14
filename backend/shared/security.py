from datetime import datetime, timedelta, timezone

from jose import jwt

from shared.config import settings


async def create_service_access_token(service_name: str | None = ''):
    expire = datetime.now(timezone.utc) + timedelta(minutes=5)
    data = {
        'sub': 'service',
        'iss': 'iss-auth-service-vean-saas-v1',
        'exp': expire,
    }
    encoded_jwt = jwt.encode(
        data, settings.SECRET_KEY_SERVICE, algorithm=settings.ALGORITHM
    )
    return encoded_jwt
