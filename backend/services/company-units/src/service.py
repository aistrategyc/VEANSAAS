import secrets
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from shared.config import settings
from shared.dependencies import AuthContext
from shared.models.company_units.org import (
    Organization,
    OrganizationInvite,
    OrganizationMember,
)
from shared.models.company_units.studio import Studio, StudioInvite, StudioMember
from shared.rabbitmq import rabbitmq
from shared.schemas.company_units.common import (
    BaseInviteMemberCreateRequest,
    BaseInviteResponse,
    BaseInviteValidateResponse,
)
from shared.schemas.company_units.org import (
    OrganizationCreateRequest,
    OrganizationMemberCreateRequest,
    OrganizationPlanType,
    OrganizationResponse,
    OrganizationRole,
)
from shared.schemas.company_units.studio import (
    StudioInviteCreateDB,
    StudioInviteCreateRequest,
    StudioMemberCreateRequest,
    StudioResponse,
    StudioRole,
)


async def create_organization(
    request: Request, data: OrganizationCreateRequest, db: AsyncSession
):
    async with db.begin():
        created_by_uuid = data.created_by_uuid

        organization_data = data.model_dump(exclude={'studio'})
        db_organization = Organization(**organization_data)
        db.add(db_organization)
        await db.flush()

        studio_data = data.studio.model_copy(
            update={
                'organization_uuid': db_organization.uuid,
                'created_by_uuid': created_by_uuid,
            }
        )
        db_studio = Studio(**studio_data.model_dump())
        db.add(db_studio)
        await db.flush()

        organization_member_data = OrganizationMemberCreateRequest(
            user_uuid=created_by_uuid,
            organization_uuid=db_organization.uuid,
            created_by_uuid=created_by_uuid,
            roles=[OrganizationRole.OWNER],
        )

        studio_member_data = StudioMemberCreateRequest(
            user_uuid=created_by_uuid,
            studio_uuid=db_studio.uuid,
            created_by_uuid=created_by_uuid,
            roles=[StudioRole.STUDIO_OWNER]
            if data.plan_type == OrganizationPlanType.SOLO
            else [StudioRole.MASTER, StudioRole.STUDIO_OWNER],
        )
        db_organization_member = OrganizationMember(
            **organization_member_data.model_dump()
        )
        db_studio_member = StudioMember(**studio_member_data.model_dump())
        db.add(db_organization_member)
        db.add(db_studio_member)

        await db.commit()

        organization_response = OrganizationResponse.model_validate(db_organization)
        studio_response = StudioResponse.model_validate(db_studio)
        organization_response.studio = studio_response
        return organization_response


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


async def invite_validate(request: Request, token: str, db: AsyncSession):
    db_organization_invite = await db.execute(
        select(OrganizationInvite).filter(
            OrganizationInvite.token == token,
            OrganizationInvite.is_cancelled.is_(False),
            OrganizationInvite.is_used.is_(False),
        )
    )

    db_organization_invite = db_organization_invite.scalar_one_or_none()

    db_studio_invite = await db.execute(
        select(StudioInvite).filter(
            StudioInvite.token == token,
            StudioInvite.is_cancelled.is_(False),
            StudioInvite.is_used.is_(False),
        )
    )

    db_studio_invite = db_studio_invite.scalar_one_or_none()

    if db_organization_invite:
        if db_organization_invite.expires_at < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The invitation has expired. Ask the administrator to send you a new invitation.',
            )
        return BaseInviteValidateResponse(
            uuid=db_organization_invite.uuid,
            email=db_organization_invite.email,
            type='organization',
        )

    if db_studio_invite:
        if db_studio_invite.expires_at < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The invitation has expired. Ask the administrator to send you a new invitation.',
            )
        return BaseInviteValidateResponse(
            uuid=db_studio_invite.uuid,
            email=db_studio_invite.email,
            type='studio',
        )

    if not db_organization_invite and not db_studio_invite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Invite not found'
        )


async def invite_create_members(
    request: Request,
    uuid: str,
    data: BaseInviteMemberCreateRequest,
    db: AsyncSession,
):
    async with db.begin():
        _model = OrganizationInvite if data.type == 'organization' else StudioInvite
        invite_member = await db.get(_model, uuid)
        if not invite_member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail='Invite is not found'
            )
        await invite_member.crete_member(db=db, user_uuid=data.user_uuid)
        invite_member.is_used = True
        await db.commit()
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={'status': 'success', 'message': 'Member created successfully'},
    )
