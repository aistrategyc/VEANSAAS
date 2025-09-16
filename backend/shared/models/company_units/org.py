from uuid import UUID

from sqlalchemy import JSON, Boolean, ForeignKey, String, Text, Uuid, true
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship

from shared.database import Base
from shared.models.base import (
    created_at,
    created_by_uuid,
    updated_at,
    uuid_primary_key,
)
from shared.models.company_units.common import BaseInvite
from shared.schemas.company_units.org import OrganizationPlanType, OrganizationRole


class Organization(Base):
    __tablename__ = 'organizations'
    __table_args__ = {'schema': 'organization_service'}

    uuid: Mapped[uuid_primary_key]
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    plan_type: Mapped[OrganizationPlanType]
    is_active: Mapped[bool] = mapped_column(Boolean, server_default=true())
    created_by_uuid: Mapped[created_by_uuid]

    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    def __str__(self) -> str:
        return self.name


class OrganizationMember(Base):
    __tablename__ = 'organization_members'
    __table_args__ = {'schema': 'organization_service'}
    uuid: Mapped[uuid_primary_key]

    user_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('user_service.users.uuid', ondelete='CASCADE'),
    )
    user: Mapped['User'] = relationship(
        back_populates='organization_memberships',
        foreign_keys=[user_uuid],
    )
    organization_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.organizations.uuid', ondelete='CASCADE'),
    )
    roles: Mapped[list[OrganizationRole]] = mapped_column(JSON)
    created_by_uuid: Mapped[created_by_uuid]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class OrganizationInvite(BaseInvite):
    __tablename__ = 'organization_invites'
    __table_args__ = {'schema': 'organization_service'}
    organization_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.organizations.uuid', ondelete='CASCADE'),
    )

    roles: Mapped[list[OrganizationRole]] = mapped_column(JSON)

    async def crete_member(self, db: AsyncSession, user_uuid: UUID | str):
        db_member = OrganizationMember(
            user_uuid=user_uuid,
            organization_uuid=self.organization_uuid,
            roles=self.roles,
            created_by_uuid=self.created_by_uuid,
        )
        db.add(db_member)

        return db_member
