import secrets
from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import HTTPException, Request, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from shared.config.config import settings
from shared.dependencies import AuthContext
from shared.models.company_units.studio import Studio, StudioInvite, StudioMember
from shared.models.user import User
from shared.rabbitmq import rabbitmq
from shared.schemas.common import PaginationResponse
from shared.schemas.company_units.common import (
    BaseInviteResponse,
)
from shared.schemas.company_units.studio import (
    StudioFilter,
    StudioInviteCreateDB,
    StudioInviteCreateRequest,
    StudioListResponse,
    StudioResponse,
    StudioUpdateRequest,
    StudioWithMembersResponse,
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


async def get_list_studios(
    request: Request,
    offset: int,
    limit: int,
    filters: StudioFilter,
    db: AsyncSession,
    auth: AuthContext,
) -> StudioListResponse:
    query = (
        select(
            Studio,
            func.count(StudioMember.uuid)
            .filter(User.is_active.is_(True))
            .label('members_count'),
        )
        .filter(Studio.uuid.in_(auth.studios_uuid), Studio.is_active.is_(True))
        .outerjoin(Studio.studio_memberships)
        .outerjoin(StudioMember.user)
        .group_by(Studio.uuid)
    )
    count_query = (
        select(func.count())
        .where(Studio.uuid.in_(auth.studios_uuid))
        .select_from(Studio)
    )

    if filters.name:
        query = query.where(Studio.name.ilike(f'%{filters.name}%'))
        count_query = count_query.where(Studio.name.ilike(f'%{filters.name}%'))

    query_result = await db.execute(query.offset(offset).limit(limit))

    studios_rows = query_result.all()
    total_count = await db.scalar(count_query) or 0

    return StudioListResponse(
        items=[
            StudioWithMembersResponse.model_validate(
                {
                    **StudioResponse.model_validate(studio).model_dump(),
                    'members_count': members_count,
                }
            )
            for studio, members_count in studios_rows
        ],
        pagination=PaginationResponse(
            count=total_count,
            offset=offset,
            limit=limit,
            has_more=(offset + limit) < total_count,
        ),
    )


async def get_studio_select_options(
    request: Request, db: AsyncSession, auth: AuthContext
):
    query_result = await db.execute(
        select(Studio).filter(
            Studio.uuid.in_(auth.studios_uuid), Studio.is_active.is_(True)
        )
    )
    studios = query_result.scalars().all()

    return studios
