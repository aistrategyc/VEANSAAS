from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import secrets

from liderix_api.db import get_async_session
from liderix_api.models.users import User
from liderix_api.schemas.user import UserRead
from liderix_api.services.auth import generate_jwt_token
from liderix_api.security.password import get_password_hash
from sqlalchemy import select, update

from .utils import now_utc, sha256_hex, normalize_email

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/verify-email", response_model=dict)
async def verify_email(token: str, email: str, session: AsyncSession = Depends(get_async_session)):
    """
    ✅ Подтверждение email по токену и email
    """
    normalized_email = normalize_email(email)
    token_hash = sha256_hex(token)

    result = await session.execute(
        select(User).where(User.email == normalized_email)
    )
    user = result.scalar_one_or_none()

    if not user or not user.verification_token_hash or not secrets.compare_digest(user.verification_token_hash, token_hash):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid token or email")

    if user.verification_token_expires_at and user.verification_token_expires_at < now_utc():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token expired")

    if user.is_verified:
        return {"message": "Email is already verified"}

    now = now_utc()
    await session.execute(
        update(User)
        .where(User.id == user.id)
        .values(
            is_verified=True,
            verification_token_hash=None,
            verification_token_expires_at=None,
            verified_at=now,
            updated_at=now,
        )
    )

    await session.commit()

    return {"message": "Email verified successfully"}