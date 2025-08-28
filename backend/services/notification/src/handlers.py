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


handlers = {'user.verification_email': send_verification_email}
