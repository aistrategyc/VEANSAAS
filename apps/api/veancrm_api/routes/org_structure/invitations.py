from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.exc import IntegrityError

from liderix_api.db import get_async_session
from liderix_api.services.auth import get_current_user
from liderix_api.services.guards import tenant_guard, TenantContext, require_perm
from liderix_api.models.users import User
from liderix_api.models.organization import Organization
from liderix_api.models.memberships import Membership, MembershipRole, MembershipStatus
from liderix_api.models.invitations import Invitation, InvitationStatus
from liderix_api.schemas.invitations import (
    InvitationCreate,
    InvitationRead,
    InvitationPreflightRead,
    InvitationAccept,
    InvitationReject,
)

router = APIRouter(prefix="/orgs", tags=["Invitations"])


@router.post("/{org_id}/invitations", response_model=InvitationRead, status_code=status.HTTP_201_CREATED)
async def create_invitation(
    org_id: UUID,
    data: InvitationCreate,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Создать приглашение в организацию.
    Доступно для OWNER/ADMIN (пермишен org:invite → включи его в require_perm).
    """
    require_perm(ctx, "org:invite")

    # организацию проверим на существование и не удалённость
    org = await session.get(Organization, org_id)
    if not org or org.deleted_at:
        raise HTTPException(status_code=404, detail="Organization not found")

    inv = Invitation(
        org_id=org_id,
        invited_email=data.invited_email,
        role=data.role,
        department_id=data.department_id,
        invited_by_id=ctx.user_id,
        expires_at=data.expires_at,
        status=InvitationStatus.PENDING,
    )
    session.add(inv)

    try:
        await session.commit()
        await session.refresh(inv)
    except IntegrityError as e:
        await session.rollback()
        # уникальность (org_id, invited_email, status=PENDING)
        raise HTTPException(
            status_code=409,
            detail="Pending invitation for this email already exists",
        )

    # TODO: отправить письмо с ссылкой: /invitations/{token}
    return inv


@router.get("/invitations/{token}", response_model=InvitationPreflightRead)
async def preflight_invitation(
    token: str,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Префлайт по токену (публично).
    Возвращает основные сведения, чтобы фронт мог показать экран акцепта.
    """
    inv = await session.scalar(
        select(Invitation).where(
            and_(
                Invitation.token == token,
                Invitation.deleted_at.is_(None),
            )
        )
    )
    if not inv:
        raise HTTPException(status_code=404, detail="Invitation not found")

    if inv.status != InvitationStatus.PENDING:
        raise HTTPException(status_code=410, detail=f"Invitation is {inv.status.value.lower()}")

    if inv.is_expired():
        # можно тут же ставить EXPIRED, но это нарушит идемпотентность GET
        raise HTTPException(status_code=410, detail="Invitation expired")

    org = await session.get(Organization, inv.org_id)

    return InvitationPreflightRead(
        org_id=inv.org_id,
        invited_email=inv.invited_email,
        role=inv.role,
        department_id=inv.department_id,
        expires_at=inv.expires_at,
        status=inv.status.value,
        organization_name=org.name if org else None,
    )


@router.post("/invitations/{token}/accept", response_model=InvitationRead)
async def accept_invitation(
    token: str,
    _: InvitationAccept,  # на будущее
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Принять приглашение.
    Требует авторизацию. Проверяем, что email текущего пользователя совпадает с invited_email.
    """
    inv = await session.scalar(
        select(Invitation).where(
            and_(Invitation.token == token, Invitation.deleted_at.is_(None))
        )
    )
    if not inv:
        raise HTTPException(status_code=404, detail="Invitation not found")

    if inv.status != InvitationStatus.PENDING:
        raise HTTPException(status_code=410, detail=f"Invitation is {inv.status.value.lower()}")

    if inv.is_expired():
        inv.status = InvitationStatus.EXPIRED
        await session.commit()
        raise HTTPException(status_code=410, detail="Invitation expired")

    # валидация email приглашённого и текущего пользователя
    if not current_user.email or current_user.email.lower() != inv.invited_email:
        raise HTTPException(status_code=403, detail="This invitation is not for your email")

    now = datetime.now(timezone.utc)

    # апсерт Membership
    m = await session.scalar(
        select(Membership).where(
            and_(
                Membership.org_id == inv.org_id,
                Membership.user_id == current_user.id,
            )
        )
    )
    if m:
        m.role = inv.role
        m.status = MembershipStatus.ACTIVE
        m.department_id = inv.department_id
        m.deleted_at = None
        if not m.joined_at:
            m.joined_at = now
        m.updated_at = now
    else:
        m = Membership(
            user_id=current_user.id,
            org_id=inv.org_id,
            role=inv.role,
            status=MembershipStatus.ACTIVE,
            department_id=inv.department_id,
            invited_by_id=inv.invited_by_id,
            joined_at=now,
            created_at=now,
            updated_at=now,
        )
        session.add(m)

    inv.status = InvitationStatus.ACCEPTED
    await session.commit()
    await session.refresh(inv)

    return inv


@router.post("/invitations/{token}/reject", response_model=InvitationRead)
async def reject_invitation(
    token: str,
    _: InvitationReject,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Отклонить приглашение.
    Требует авторизацию. Email должен совпадать с адресатом приглашения.
    """
    inv = await session.scalar(
        select(Invitation).where(
            and_(Invitation.token == token, Invitation.deleted_at.is_(None))
        )
    )
    if not inv:
        raise HTTPException(status_code=404, detail="Invitation not found")

    if inv.status != InvitationStatus.PENDING:
        raise HTTPException(status_code=410, detail=f"Invitation is {inv.status.value.lower()}")

    if not current_user.email or current_user.email.lower() != inv.invited_email:
        raise HTTPException(status_code=403, detail="This invitation is not for your email")

    inv.status = InvitationStatus.REJECTED
    await session.commit()
    await session.refresh(inv)
    return inv