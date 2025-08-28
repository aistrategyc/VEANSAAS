from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from shared.config import settings
from shared.service_clients.company_units import CompanyUnitsServiceClient
from shared.service_clients.user import UserServiceClient

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid user token',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid token type'
        )


async def get_service_token(token: str = Depends(oauth2_scheme)):
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

        return payload
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


async def get_current_principal(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        service_payload = await get_service_token(token)
        return service_payload
    except HTTPException:
        pass

    try:
        user_payload = await get_current_user(token)
        return user_payload
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


async def get_company_units_service():
    return CompanyUnitsServiceClient(
        service_url=settings.COMPANY_UNITS_SERVICE_URL, service_name='company_units'
    )
