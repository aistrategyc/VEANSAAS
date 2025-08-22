from __future__ import annotations
from typing import List
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func, and_
from sqlalchemy.exc import IntegrityError
from liderix_api.db import get_async_session
from liderix_api.models.organization import Organization
from liderix_api.schemas.organization import (
    OrganizationCreate, OrganizationUpdate, OrganizationRead,
    OrganizationOnboardingRequest, OrganizationOnboardingResponse
)
from liderix_api.services.guards import tenant_guard, TenantContext, require_perm
from liderix_api.services.auth import get_current_user
from liderix_api.models.users import User
from liderix_api.models.memberships import Membership, MembershipRole, MembershipStatus
from liderix_api.services.audit import AuditLogger
from liderix_api.services.tenants import bootstrap_org
from datetime import datetime, timezone
import logging

router = APIRouter(prefix="/orgs", tags=["Organizations"])
logger = logging.getLogger(__name__)


def _convert_address_to_dict(address_obj) -> dict | None:
    """Конвертируем объект Address в dict для JSONB поля"""
    if not address_obj:
        return None
    
    address_dict = {
        "line1": address_obj.line1,
        "line2": address_obj.line2,
        "city": address_obj.city,
        "region": address_obj.region,
        "country": address_obj.country,
        "postal_code": address_obj.postal_code,
    }
    
    # Добавляем geo если есть
    if hasattr(address_obj, 'geo') and address_obj.geo:
        address_dict["geo"] = {
            "lat": address_obj.geo.lat,
            "lon": address_obj.geo.lon
        }
    
    # Убираем None значения
    return {k: v for k, v in address_dict.items() if v is not None}


def _convert_preferences_to_dict(prefs_obj) -> dict | None:
    """Конвертируем объект OrganizationPreferences в dict для JSONB поля"""
    if not prefs_obj:
        return None
    
    prefs_dict = {
        "timezone": prefs_obj.timezone,
        "currency": prefs_obj.currency,
        "locale": prefs_obj.locale,
        "week_start": prefs_obj.week_start,
    }
    
    # Убираем None значения
    return {k: v for k, v in prefs_dict.items() if v is not None}


@router.post("/", response_model=OrganizationRead, status_code=status.HTTP_201_CREATED)
@router.post("", response_model=OrganizationRead, status_code=status.HTTP_201_CREATED, include_in_schema=False)
async def create_organization(
    data: OrganizationCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Создать новую организацию.
    
    Автоматически устанавливает текущего пользователя как владельца
    и создает соответствующий Membership с ролью 'owner'.
    """
    # Конвертируем вложенные объекты в dict для JSONB полей
    address_dict = _convert_address_to_dict(data.address)
    preferences_dict = _convert_preferences_to_dict(data.preferences)

    # Атомарно создаём организацию + OWNER membership + дефолтные департаменты
    try:
        # В проде избегаем вложенной транзакции: работаем вручную
        org, owner_m, deps = await bootstrap_org(
            session,
            owner_user_id=current_user.id,
            name=data.name,
            slug=data.slug,
            address=address_dict,
            preferences=preferences_dict,
            custom_fields=data.custom_fields,
            create_defaults=True,
            default_department_names=None,
            enforce_unique_slug=True,
        )

        # Явно фиксируем изменения
        await session.flush()
        await session.commit()

    except IntegrityError as e:
        # Конфликт целостности (дубли, гонки и т.п.)
        await session.rollback()
        logger.error(f"Failed to bootstrap organization (integrity): {e}", exc_info=True)
        raise HTTPException(
            status_code=409,
            detail={
                "type": "urn:problem:integrity-error",
                "title": "Data Integrity Error",
                "detail": "Failed to create organization due to data constraint violation",
                "status": 409,
            },
        )
    except Exception as e:
        # Любая иная ошибка при создании
        await session.rollback()
        logger.error(f"Failed to bootstrap organization: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "type": "urn:problem:org-create-failed",
                "title": "Organization Create Failed",
                "detail": "Unexpected error while creating organization",
                "status": 500,
            },
        )

    logger.info(
        f"Created organization: id={org.id}, name={org.name}, slug={org.slug}, "
        f"owner_id={current_user.id}, membership_id={owner_m.id}, "
        f"industry={org.industry}, size={org.size}"
    )

    # Логируем событие для аудита
    await AuditLogger.log_event(
        session,
        current_user.id,
        "org.create",
        True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "org_id": str(org.id),
            "membership_id": str(owner_m.id),
            "slug": org.slug,
            "industry": org.industry,
            "size": org.size,
            "has_address": bool(address_dict),
            "has_preferences": bool(preferences_dict),
            "has_custom_fields": bool(data.custom_fields),
            "created_default_departments": [d.name for d in deps],
        },
    )

    return org


@router.get("/", response_model=List[OrganizationRead])
@router.get("", response_model=List[OrganizationRead], include_in_schema=False)
async def list_organizations(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Получить список организаций, в которых пользователь является участником.
    
    Возвращает только организации с активным membership.
    """
    # from sqlalchemy import and_  # already imported at top

    stmt = (
        select(Organization)
        .join(Membership, Membership.org_id == Organization.id)
        .where(
            and_(
                Membership.user_id == current_user.id,
                Membership.deleted_at.is_(None),
                Membership.status == MembershipStatus.ACTIVE,
                Organization.deleted_at.is_(None),
            )
        )
        .order_by(Organization.created_at.desc())
    )
    
    items = (await session.execute(stmt)).scalars().all()
    
    logger.info(f"User {current_user.id} listed {len(items)} organizations")
    
    return items


@router.get("/{org_id}", response_model=OrganizationRead)
async def get_organization(
    org_id: UUID,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Получить организацию по ID.
    
    Требует права org:read в рамках организации.
    """
    require_perm(ctx, "org:read")
    
    org = await session.get(Organization, org_id)
    if not org or org.deleted_at:
        raise HTTPException(
            status_code=404,
            detail={
                "type": "urn:problem:org-not-found",
                "title": "Organization Not Found",
                "detail": f"Organization with ID {org_id} not found",
                "status": 404,
            }
        )
    
    return org


@router.patch("/{org_id}", response_model=OrganizationRead)
async def update_organization(
    org_id: UUID,
    data: OrganizationUpdate,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Обновить организацию.
    
    Требует права org:write в рамках организации.
    Поддерживает частичное обновление всех полей.
    """
    require_perm(ctx, "org:write")
    
    org = await session.get(Organization, org_id)
    if not org or org.deleted_at:
        raise HTTPException(
            status_code=404,
            detail={
                "type": "urn:problem:org-not-found",
                "title": "Organization Not Found",
                "detail": f"Organization with ID {org_id} not found",
                "status": 404,
            }
        )
    
    # Получаем только переданные поля
    update_data = data.model_dump(exclude_unset=True)
    
    # Обрабатываем специальные поля
    if "address" in update_data:
        if update_data["address"]:
            # Конвертируем объект Address в dict
            address_dict = _convert_address_to_dict(data.address)
            update_data["address"] = address_dict
        else:
            # Если передан None, очищаем адрес
            update_data["address"] = None
    
    if "preferences" in update_data:
        if update_data["preferences"]:
            # Конвертируем объект Preferences в dict
            prefs_dict = _convert_preferences_to_dict(data.preferences)
            update_data["preferences"] = prefs_dict
        else:
            # Если передан None, очищаем предпочтения
            update_data["preferences"] = None
    
    # Применяем изменения
    changes = {}
    for field, value in update_data.items():
        old_value = getattr(org, field, None)
        if old_value != value:
            changes[field] = {"old": old_value, "new": value}
            setattr(org, field, value)
    
    # Обновляем timestamp
    org.updated_at = datetime.now(timezone.utc)
    
    try:
        await session.commit()
        await session.refresh(org)
    except IntegrityError as e:
        await session.rollback()
        logger.error(f"Failed to update organization {org_id}: {e}")
        
        if "slug" in str(e):
            raise HTTPException(
                status_code=409,
                detail={
                    "type": "urn:problem:duplicate-slug",
                    "title": "Slug Already Exists",
                    "detail": "An organization with this slug already exists",
                    "status": 409,
                }
            )
        
        raise HTTPException(
            status_code=409,
            detail={
                "type": "urn:problem:integrity-error",
                "title": "Data Integrity Error",
                "detail": "Failed to update organization due to data constraint violation",
                "status": 409,
            }
        )
    
    logger.info(f"Updated organization {org_id}: {changes}")
    
    # Логируем событие для аудита
    await AuditLogger.log_event(
        session,
        ctx.user_id,
        "org.update",
        True,
        "unknown",  # request не передается в tenant_guard
        "unknown",
        {
            "org_id": str(org_id),
            "changes": changes,
            "fields_updated": list(changes.keys())
        }
    )
    
    return org


@router.delete("/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_organization(
    org_id: UUID,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Мягко удалить организацию (soft delete).
    
    Требует права org:delete или роль owner.
    Организация помечается как удаленная, но остается в базе.
    """
    require_perm(ctx, "org:delete")
    
    org = await session.get(Organization, org_id)
    if not org or org.deleted_at:
        raise HTTPException(
            status_code=404,
            detail={
                "type": "urn:problem:org-not-found",
                "title": "Organization Not Found",
                "detail": f"Organization with ID {org_id} not found",
                "status": 404,
            }
        )
    
    # Проверяем, что это не последняя организация владельца
    # (опционально, зависит от бизнес-логики)
    owner_orgs_count = await session.scalar(
        select(func.count(Organization.id)).where(
            and_(
                Organization.owner_id == org.owner_id,
                Organization.deleted_at.is_(None)
            )
        )
    )
    
    if owner_orgs_count <= 1:
        logger.warning(f"Attempting to delete last organization {org_id} for owner {org.owner_id}")
        # Можно разрешить или запретить - зависит от требований
    
    # Мягкое удаление
    org.deleted_at = datetime.now(timezone.utc)
    
    # Опционально: деактивируем все membership
    await session.execute(
        update(Membership)
        .where(
            and_(
                Membership.org_id == org_id,
                Membership.deleted_at.is_(None)
            )
        )
        .values(
            status=MembershipStatus.INACTIVE,
            deleted_at=datetime.now(timezone.utc)
        )
    )
    
    await session.commit()
    
    logger.info(f"Soft deleted organization {org_id} by user {ctx.user_id}")
    
    # Логируем событие для аудита
    await AuditLogger.log_event(
        session,
        ctx.user_id,
        "org.delete",
        True,
        "unknown",
        "unknown",
        {
            "org_id": str(org_id),
            "org_name": org.name,
            "org_slug": org.slug,
            "owner_id": str(org.owner_id)
        }
    )


# Дополнительные полезные эндпоинты

@router.get("/{org_id}/slug-available", response_model=dict)
async def check_slug_availability(
    org_id: UUID,
    slug: str,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Проверить доступность slug для организации.
    """
    require_perm(ctx, "org:read")
    
    existing = await session.scalar(
        select(Organization.id).where(
            and_(
                Organization.slug == slug.lower(),
                Organization.id != org_id,  # исключаем текущую организацию
                Organization.deleted_at.is_(None)
            )
        )
    )
    
    return {"slug": slug.lower(), "available": existing is None}


@router.post("/{org_id}/generate-slug", response_model=dict)
async def generate_slug_for_name(
    org_id: UUID,
    name: str,
    ctx: TenantContext = Depends(tenant_guard),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Сгенерировать slug из названия и проверить его доступность.
    """
    require_perm(ctx, "org:read")
    
    base_slug = Organization.generate_slug(name)
    slug = base_slug
    counter = 1
    
    # Ищем свободный slug
    while True:
        existing = await session.scalar(
            select(Organization.id).where(
                and_(
                    Organization.slug == slug,
                    Organization.id != org_id,
                    Organization.deleted_at.is_(None)
                )
            )
        )
        
        if not existing:
            break
            
        slug = f"{base_slug}-{counter}"
        counter += 1
        
        # Защита от бесконечного цикла
        if counter > 100:
            slug = f"{base_slug}-{uuid4().hex[:8]}"
            break
    
    return {"name": name, "suggested_slug": slug, "available": True}


@router.post("/onboarding", response_model=OrganizationOnboardingResponse, status_code=status.HTTP_201_CREATED)
async def complete_onboarding(
    data: OrganizationOnboardingRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    """
    Complete onboarding in a single atomic transaction:
    - Create organization
    - Create departments 
    - Send invitations
    """
    from liderix_api.models import Department
    from liderix_api.models.invitations import Invitation
    from liderix_api.services.mailer import send_invitation_email
    from fastapi import BackgroundTasks
    import secrets
    
    # Convert nested objects to dict for JSONB fields
    address_dict = _convert_address_to_dict(data.organization.address)
    preferences_dict = _convert_preferences_to_dict(data.organization.preferences)
    
    errors = []
    departments_created = []
    invites_sent = []
    
    async with session.begin():
        try:
            # 1. Create organization with bootstrap
            org, owner_m, default_deps = await bootstrap_org(
                session,
                owner_user_id=current_user.id,
                name=data.organization.name,
                slug=data.organization.slug,
                description=data.organization.description,
                industry=data.organization.industry,
                size=data.organization.size,
                address=address_dict,
                preferences=preferences_dict,
                custom_fields=data.organization.custom_fields,
                create_defaults=True,
                default_department_names=None,
                enforce_unique_slug=True,
            )
            
            # 2. Create additional departments
            for dept_data in data.departments or []:
                try:
                    department = Department(
                        id=uuid4(),
                        org_id=org.id,
                        name=dept_data.name.strip(),
                        description=dept_data.description.strip() if dept_data.description else None,
                        created_at=datetime.now(timezone.utc),
                        updated_at=datetime.now(timezone.utc),
                    )
                    session.add(department)
                    departments_created.append({
                        "id": str(department.id),
                        "name": department.name,
                        "description": department.description
                    })
                except Exception as e:
                    errors.append({
                        "type": "department_creation",
                        "data": dept_data.model_dump(),
                        "error": str(e)
                    })
            
            # 3. Create invitations
            for invite_data in data.invites or []:
                try:
                    # Check if user already exists
                    from liderix_api.models.users import User as UserModel
                    existing_user = await session.scalar(
                        select(UserModel).where(UserModel.email == invite_data.email.lower())
                    )
                    
                    if existing_user:
                        # Check if already a member
                        existing_membership = await session.scalar(
                            select(Membership).where(
                                and_(
                                    Membership.org_id == org.id,
                                    Membership.user_id == existing_user.id,
                                    Membership.deleted_at.is_(None)
                                )
                            )
                        )
                        if existing_membership:
                            errors.append({
                                "type": "invitation_creation",
                                "data": invite_data.model_dump(),
                                "error": "User is already a member"
                            })
                            continue
                    
                    # Check for existing invitation
                    existing_invitation = await session.scalar(
                        select(Invitation).where(
                            and_(
                                Invitation.org_id == org.id,
                                Invitation.email == invite_data.email.lower(),
                                Invitation.status == "pending"
                            )
                        )
                    )
                    
                    if existing_invitation:
                        errors.append({
                            "type": "invitation_creation",
                            "data": invite_data.model_dump(),
                            "error": "Invitation already pending"
                        })
                        continue
                    
                    # Create invitation
                    invitation = Invitation(
                        id=uuid4(),
                        org_id=org.id,
                        email=invite_data.email.lower(),
                        role=invite_data.role or "member",
                        department_id=invite_data.department_id,
                        invited_by_id=current_user.id,
                        token=secrets.token_urlsafe(32),
                        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
                        status="pending",
                        created_at=datetime.now(timezone.utc),
                        updated_at=datetime.now(timezone.utc),
                    )
                    
                    session.add(invitation)
                    invites_sent.append({
                        "invitation_id": str(invitation.id),
                        "email": invite_data.email,
                        "role": invite_data.role or "member"
                    })
                    
                    # Note: Email sending will be done after commit
                    
                except Exception as e:
                    logger.error(f"Failed to create invitation for {invite_data.email}: {e}")
                    errors.append({
                        "type": "invitation_creation",
                        "data": invite_data.model_dump(),
                        "error": str(e)
                    })
            
            # If we get here, transaction will be committed automatically
            
        except IntegrityError as e:
            logger.error(f"Failed to complete onboarding (integrity): {e}", exc_info=True)
            raise HTTPException(
                status_code=409,
                detail={
                    "type": "urn:problem:onboarding-integrity-error",
                    "title": "Onboarding Data Integrity Error",
                    "detail": "Failed to complete onboarding due to data constraint violation",
                    "status": 409,
                },
            )
        except Exception as e:
            logger.error(f"Failed to complete onboarding: {e}", exc_info=True)
            raise HTTPException(
                status_code=500,
                detail={
                    "type": "urn:problem:onboarding-failed",
                    "title": "Onboarding Failed",
                    "detail": "Unexpected error while completing onboarding",
                    "status": 500,
                },
            )
    
    # Send invitation emails in background after successful commit
    # TODO: Implement background task sending
    
    # Log successful onboarding
    await AuditLogger.log_event(
        session,
        current_user.id,
        "org.onboarding_complete",
        True,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "unknown"),
        {
            "org_id": str(org.id),
            "departments_count": len(departments_created),
            "invites_count": len(invites_sent),
            "errors_count": len(errors),
        },
    )
    
    logger.info(
        f"Completed onboarding for user {current_user.id}: org={org.id}, "
        f"departments={len(departments_created)}, invites={len(invites_sent)}, errors={len(errors)}"
    )
    
    return OrganizationOnboardingResponse(
        organization=org,
        departments_created=departments_created,
        invites_sent=invites_sent,
        errors=errors
    )