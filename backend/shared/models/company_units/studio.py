from uuid import UUID

from sqlalchemy import JSON, Boolean, ForeignKey, String, Uuid, true
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
from shared.schemas.company_units.studio import StudioRole


class Studio(Base):
    __tablename__ = 'studios'
    __table_args__ = {'schema': 'organization_service'}

    uuid: Mapped[uuid_primary_key]
    name: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, server_default=true())
    organization_uuid: Mapped[UUID | None] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.organizations.uuid', ondelete='SET NULL'),
        nullable=True,
    )
    studio_memberships: Mapped[list['StudioMember']] = relationship(
        back_populates='studio',
        lazy='noload',
        foreign_keys='StudioMember.studio_uuid',
        cascade='all, delete',
    )
    created_by_uuid: Mapped[created_by_uuid]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    def __str__(self) -> str:
        return self.name


class StudioMember(Base):
    __tablename__ = 'studio_members'
    __table_args__ = {'schema': 'organization_service'}
    uuid: Mapped[uuid_primary_key]
    user_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('user_service.users.uuid', ondelete='CASCADE'),
    )
    user: Mapped['User'] = relationship(
        back_populates='studio_memberships',
        foreign_keys=[user_uuid],
    )
    studio_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.studios.uuid', ondelete='CASCADE'),
    )
    studio: Mapped['Studio'] = relationship(
        back_populates='studio_memberships', foreign_keys=[studio_uuid]
    )

    roles: Mapped[list[StudioRole]] = mapped_column(JSON)
    created_by_uuid: Mapped[created_by_uuid]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class StudioInvite(BaseInvite):
    __tablename__ = 'studio_invites'
    __table_args__ = {'schema': 'organization_service'}

    studio_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.studios.uuid', ondelete='CASCADE'),
        nullable=False,
    )
    roles: Mapped[list[StudioRole]] = mapped_column(JSON)

    async def crete_member(self, db: AsyncSession, user_uuid: UUID | str):
        db_member = StudioMember(
            user_uuid=user_uuid,
            studio_uuid=self.studio_uuid,
            roles=self.roles,
            created_by_uuid=self.created_by_uuid,
        )
        db.add(db_member)

        return db_member
