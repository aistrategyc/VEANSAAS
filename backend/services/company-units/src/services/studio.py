import secrets
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from shared.config.config import settings
from shared.dependencies import AuthContext
from shared.models.company_units.studio import Studio, StudioInvite
from shared.rabbitmq import rabbitmq
from shared.schemas.company_units.common import (
    BaseInviteResponse,
)
from shared.schemas.company_units.studio import (
    StudioInviteCreateDB,
    StudioInviteCreateRequest,
    StudioUpdateRequest,
)


async def create_studio_invite(
    request: Request,
    studio_uuid: str,
    data: StudioInviteCreateRequest,
    db: AsyncSession,
    auth: AuthContext,
):
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    invite_data_db = StudioInviteCreateDB(
        email=data.email,
        token=secrets.token_hex(16),
        created_by_uuid=auth.user.uuid if auth.user else None,
        studio_uuid=studio_uuid,
        roles=data.roles,
        expires_at=expire,
    )
    db_invite = StudioInvite(**invite_data_db.model_dump())
    db.add(db_invite)
    await db.commit()

    url = f'{settings.CLIENT_URL}/signup?token={db_invite.token}'

    await rabbitmq.publish(
        routing_key='user.send_invite',
        message={'url': url, 'email': db_invite.email},
    )

    return BaseInviteResponse(
        email=db_invite.email,
        token=db_invite.token,
        url=f'{settings.CLIENT_URL}/signup?token={db_invite.token}',
    )


async def get_studio(request: Request, uuid: UUID, db: AsyncSession, auth: AuthContext):
    studio_db = await db.get(Studio, uuid)

    if not studio_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Studio not found'
        )

    return studio_db


async def update_studio(
    request: Request,
    uuid: UUID,
    data: StudioUpdateRequest,
    db: AsyncSession,
    auth: AuthContext,
):
    studio_db = await db.get(Studio, uuid)

    if not studio_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Studio not found'
        )

    update_data = data.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )
    if not update_data:
        return studio_db

    for field, value in update_data.items():
        setattr(studio_db, field, value)
    await db.commit()

    return studio_db
