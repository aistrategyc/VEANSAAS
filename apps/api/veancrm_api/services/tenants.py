# apps/api/liderix_api/services/tenants.py
from __future__ import annotations

import logging
from typing import Sequence, Tuple, List, Optional
from uuid import UUID, uuid4
from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from liderix_api.models.organization import Organization, Department
from liderix_api.models.memberships import Membership, MembershipRole, MembershipStatus

logger = logging.getLogger(__name__)

__all__ = [
    "bootstrap_org",
    "generate_unique_slug",
    "create_default_departments",
]


async def generate_unique_slug(
    session: AsyncSession,
    base_slug: str,
    *,
    max_tries: int = 50,
) -> str:
    """
    Находит свободный slug. Если base_slug занят — добавляет -1, -2, ...,
    а при исчерпании попыток — случайный суффикс.
    Учитывает только не удалённые организации (deleted_at IS NULL).
    """
    slug = base_slug

    async def _exists(s: str) -> bool:
        q = (
            select(Organization.id)
            .where(
                and_(
                    Organization.slug == s,
                    Organization.deleted_at.is_(None),
                )
            )
            .limit(1)
        )
        return (await session.scalar(q)) is not None

    if not await _exists(slug):
        return slug

    for i in range(1, max_tries + 1):
        candidate = f"{base_slug}-{i}"
        if not await _exists(candidate):
            return candidate

    # Фоллбек: уникальный суффикс
    rnd = uuid4().hex[:8]
    return f"{base_slug}-{rnd}"


async def create_default_departments(
    session: AsyncSession,
    org_id: UUID,
    names: Sequence[str] | None = None,
) -> List[Department]:
    """
    Создаёт набор стандартных департаментов в рамках организации.
    Возвращает список созданных Department (без commit, с flush).
    """
    if not names:
        names = ("General", "Sales", "Marketing", "Engineering", "HR")

    departments: List[Department] = []
    for name in names:
        departments.append(
            Department(
                id=uuid4(),
                org_id=org_id,
                name=name,
            )
        )

    session.add_all(departments)
    # flush, чтобы появились id (но без commit — оставляем транзакцию на вызывающего)
    await session.flush()
    return departments


async def bootstrap_org(
    session: AsyncSession,
    *,
    owner_user_id: UUID,
    name: str,
    slug: Optional[str] = None,
    address: Optional[dict] = None,
    preferences: Optional[dict] = None,
    custom_fields: Optional[dict] = None,
    create_defaults: bool = True,
    default_department_names: Sequence[str] | None = None,
    enforce_unique_slug: bool = True,
) -> Tuple[Organization, Membership, List[Department]]:
    """
    Атомарно создаёт организацию, membership владельца (OWNER, ACTIVE)
    и (опционально) дефолтные департаменты. Предполагается вызов внутри:

        async with session.begin():
            org, owner_m, deps = await bootstrap_org(...)

    Никаких commit внутри этой функции не делается — только flush.

    :param session: AsyncSession
    :param owner_user_id: пользователь-владелец → станет OWNER
    :param name: название организации
    :param slug: желаемый slug (если None — будет сгенерирован из name)
    :param address: dict для JSONB address
    :param preferences: dict для JSONB preferences
    :param custom_fields: dict для JSONB кастомных полей
    :param create_defaults: создавать ли дефолтные департаменты
    :param default_department_names: список имён департаментов (если None — стандартный набор)
    :param enforce_unique_slug: если True — подберём свободный slug (test, test-1, ...)
    :return: (Organization, Membership владельца, [Department])
    """
    now = datetime.now(timezone.utc)

    # 1) Определяем slug
    base_slug = slug or Organization.generate_slug(name)
    final_slug = (
        await generate_unique_slug(session, base_slug)
        if enforce_unique_slug
        else base_slug
    )

    # 2) Организация
    org = Organization(
        id=uuid4(),
        owner_id=owner_user_id,
        name=name,
        slug=final_slug,
        description=None,
        address=address or None,
        preferences=preferences or None,
        custom_fields=custom_fields or {},
        # created_at/updated_at проставятся сервером через server_default/func.now()
    )
    session.add(org)

    # Flush, чтобы id организации стал доступен для FK
    await session.flush()

    # 3) Membership владельца
    owner_membership = Membership(
        id=uuid4(),
        user_id=owner_user_id,
        org_id=org.id,
        role=MembershipRole.OWNER,
        status=MembershipStatus.ACTIVE,
        invited_by_id=owner_user_id,
        joined_at=now,
        created_at=now,
        updated_at=now,
    )
    session.add(owner_membership)

    # 4) Дефолтные департаменты
    departments: List[Department] = []
    if create_defaults:
        departments = await create_default_departments(
            session,
            org_id=org.id,
            names=default_department_names,
        )

    # Финальный flush — удостоверяемся, что всё записываемо
    await session.flush()

    logger.info(
        "Bootstrap org done: org_id=%s owner=%s slug=%s deps=%s",
        org.id,
        owner_user_id,
        org.slug,
        [d.name for d in departments],
    )

    return org, owner_membership, departments