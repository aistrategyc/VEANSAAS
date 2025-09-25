from datetime import datetime, timezone

from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from shared.models.company_units.org import (
    OrganizationInvite,
)
from shared.models.company_units.studio import StudioInvite
from shared.schemas.company_units.invite import (
    BaseInviteMemberCreateRequest,
    BaseInviteValidateResponse,
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
