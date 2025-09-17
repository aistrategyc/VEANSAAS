import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from shared.config.config import settings
from shared.dependencies import AuthContext
from shared.models.company_units.studio import StudioInvite
from shared.rabbitmq import rabbitmq
from shared.schemas.company_units.common import (
    BaseInviteResponse,
)
from shared.schemas.company_units.studio import (
    StudioInviteCreateDB,
    StudioInviteCreateRequest,
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
