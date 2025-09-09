from typing import Any, Dict

from config import notification_settings
from fastapi import HTTPException, status
from utils import send_email

from shared.logger import logger


async def send_verification_email(data: Dict[str, Any]):
    logger.info('Send verification email')
    token = data.get('token')
    email = data.get('email')
    if not token:
        logger.error('Token is required for email verification')
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Token is required for email verification',
        )
    if not email:
        logger.error('Email is required for email verification')
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Email is required for email verification',
        )
    await send_email(
        subject='Verification email',
        email_to=email,
        html=f'''
        <a href="{notification_settings.CLIENT_URL}/verify-email?token={token}" class="button">
            Подтвердить Email
        </a>''',
    )


async def send_invite(data: Dict[str, Any]):
    logger.info('Send invite email')
    url = data.get('url')
    email = data.get('email')
    if not url:
        logger.error('Url is required for register')
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Url is required for email register',
        )
    if not email:
        logger.error('Email is required for email register')
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Email is required for email register',
        )
    await send_email(
        subject='Invite',
        email_to=email,
        html=f'''
        <a href="{url}" class="button">
            Создать аккаунт
        </a>''',
    )


handlers = {
    'user.verification_email': send_verification_email,
    'user.send_invite': send_invite,
}
