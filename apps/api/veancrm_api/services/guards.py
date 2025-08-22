from __future__ import annotations
from dataclasses import dataclass
from typing import Optional, Literal, Tuple
from uuid import UUID
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from liderix_api.db import get_async_session
from liderix_api.models.organization import Organization
from liderix_api.models import Membership, ResponsibilityScope  # Изменено: Импорт из models
from liderix_api.services.auth import get_current_user # должен вернуть User (с .id)
# -----------------------------
# Роли и права
# -----------------------------
Role = Literal["owner", "admin", "manager", "member", "guest"]
# Базовые права по ролям (org-wide).
# Для объектных операций используйте check_perm/require_perm c ResponsibilityScope.
ROLE_PERMS = {
    "owner": {"org:read", "org:write", "member:manage", "dept:write"},
    "admin": {"org:read", "org:write", "member:manage", "dept:write"},
    "manager": {"org:read", "dept:write"},
    "member": {"org:read"},
    "guest": {"org:read"},
}
# Иерархия ролей (при необходимости сравнения)
ROLE_ORDER = {"guest": 0, "member": 1, "manager": 2, "admin": 3, "owner": 4}
# -----------------------------
# Модели данных для контекста
# -----------------------------
@dataclass
class TenantContext:
    org: Organization
    membership: Membership
    role: Role
    user_id: UUID
# -----------------------------
# Ошибки/ответы
# -----------------------------
def problem(status_code: int, type_: str, title: str, detail: str) -> None:
    """RFC7807-like."""
    raise HTTPException(
        status_code=status_code,
        detail={"type": type_, "title": title, "detail": detail, "status": status_code},
    )
def forbidden(detail: str = "Forbidden") -> None:
    problem(status.HTTP_403_FORBIDDEN, "urn:problem:forbidden", "Forbidden", detail)
# -----------------------------
# Загрузчики
# -----------------------------
async def _get_org(session: AsyncSession, org_id: UUID) -> Organization:
    org = await session.get(Organization, org_id)
    if not org or org.deleted_at is not None:
        problem(status.HTTP_404_NOT_FOUND, "urn:problem:not-found", "Not Found", "Organization not found")
    return org
# -----------------------------
# Guard-зависимость
# -----------------------------
async def tenant_guard(
    org_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    current_user=Depends(get_current_user),
) -> TenantContext:
    """
    Проверяет:
      - организация существует и не soft-deleted
      - у пользователя есть активное Membership в этой org
    Возвращает TenantContext.
    """
    org = await _get_org(session, org_id)
    membership = await session.scalar(
        select(Membership).where(
            Membership.org_id == org_id,
            Membership.user_id == current_user.id,
            Membership.deleted_at.is_(None),
        )
    )
    if not membership:
        forbidden("Not a member of this organization")
    # Блокируем неактивные статусы
    if membership.status in ("invited", "suspended"):
        forbidden(f"Membership is {membership.status}")
    role: Role = membership.role # type: ignore
    return TenantContext(org=org, membership=membership, role=role, user_id=current_user.id)
# -----------------------------
# Проверка прав
# -----------------------------
def _split_object_perm(perm: str) -> Optional[Tuple[str, str]]:
    """
    Превращает 'brand:read' -> ('brand', 'read'), 'location:write' -> ('location','write').
    Для 'org:read'/'member:manage' вернёт None (считаем орг-глобальными).
    """
    if ":" not in perm:
        return None
    obj, action = perm.split(":", 1)
    if obj in {"brand", "location", "metric", "bu", "department"} and action in {"read", "write"}:
        return obj, action
    return None
async def _has_scope_permission(
    session: AsyncSession,
    ctx: TenantContext,
    object_type: Optional[str],
    object_id: Optional[UUID],
    action: str,
) -> bool:
    """
    Проверяет ResponsibilityScope для заданного object_type/object_id:
      - если есть запись с нужным типом и (object_id == NULL ИЛИ совпадает),
        и permissions[action] == true -> разрешить.
    """
    if not object_type:
        return False
    stmt = (
        select(ResponsibilityScope)
        .where(
            ResponsibilityScope.org_id == ctx.org.id,
            ResponsibilityScope.user_id == ctx.user_id,
            ResponsibilityScope.object_type == object_type,
            or_(ResponsibilityScope.object_id.is_(None), ResponsibilityScope.object_id == object_id),
            ResponsibilityScope.deleted_at.is_(None),
        )
    )
    scopes = (await session.execute(stmt)).scalars().all()
    for scope in scopes:
        perms = scope.permissions or {}
        if perms.get(action) is True:
            return True
    return False
async def check_perm(
    ctx: TenantContext,
    perm: str,
    session: Optional[AsyncSession] = None,
    *,
    object_type: Optional[str] = None,
    object_id: Optional[UUID] = None,
) -> bool:
    """
    Возвращает True, если:
      - право есть у роли (ROLE_PERMS), ИЛИ
      - право объектного типа дано через ResponsibilityScope (read/write)
    Для объектных прав perm вроде 'brand:read'/'location:write' можно не передавать object_type —
    он будет распознан из perm. Если object_id не указан — проверяются wildcard-скоупы (object_id IS NULL).
    """
    role_perms = ROLE_PERMS.get(ctx.role, set())
    if perm in role_perms:
        return True
    # Для объектного доступа — проверяем ResponsibilityScope
    parsed = _split_object_perm(perm)
    if parsed:
        obj_from_perm, action = parsed
        obj_type = object_type or obj_from_perm
        if session is None:
            raise RuntimeError("check_perm: session is required for object-level permission checks")
        return await _has_scope_permission(session, ctx, obj_type, object_id, action)
    return False
async def require_perm(
    ctx: TenantContext,
    perm: str,
    session: Optional[AsyncSession] = None,
    *,
    object_type: Optional[str] = None,
    object_id: Optional[UUID] = None,
) -> None:
    ok = await check_perm(ctx, perm, session, object_type=object_type, object_id=object_id)
    if not ok:
        forbidden(f"Missing permission: {perm}")
def require_min_role(ctx: TenantContext, min_role: Role) -> None:
    """Прямая проверка уровня роли (без объектных скоупов)."""
    if ROLE_ORDER.get(ctx.role, -1) < ROLE_ORDER.get(min_role, -1):
        forbidden(f"Requires role >= {min_role}")
def ensure_same_org(entity_org_id: UUID, ctx: TenantContext) -> None:
    """Подстраховка при операциях с сущностями: проверяет, что entity.org_id == ctx.org.id."""
    if entity_org_id != ctx.org.id:
        forbidden("Entity does not belong to this organization")