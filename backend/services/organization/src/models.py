from uuid import UUID

from sqlalchemy import JSON, Boolean, ForeignKey, String, Text, Uuid, true
from sqlalchemy.orm import Mapped, mapped_column

from services.organization.src.schemas import (
    OrganizationPlanType,
    OrganizationRole,
    StudioRole,
)
from shared.database import Base
from shared.models import created_at, created_by_uuid, updated_at, uuid_primary_key


class Organization(Base):
    __tablename__ = 'organizations'
    __table_args__ = {'schema': 'organization_service', 'extend_existing': True}

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


class Studio(Base):
    __tablename__ = 'studios'
    __table_args__ = {'schema': 'organization_service', 'extend_existing': True}

    uuid: Mapped[uuid_primary_key]
    name: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, server_default=true())
    organization_uuid: Mapped[UUID | None] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.organizations.uuid', ondelete='SET NULL'),
        nullable=True,
    )
    created_by_uuid: Mapped[created_by_uuid]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]

    def __str__(self) -> str:
        return self.name


class StudioMember(Base):
    __tablename__ = 'studio_members'
    __table_args__ = {'schema': 'organization_service', 'extend_existing': True}
    uuid: Mapped[uuid_primary_key]
    user_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('user_service.users.uuid', ondelete='CASCADE'),
    )
    studio_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.studios.uuid', ondelete='CASCADE'),
    )
    roles: Mapped[list[StudioRole]] = mapped_column(JSON)
    created_by_uuid: Mapped[created_by_uuid]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class OrganizationMember(Base):
    __tablename__ = 'organization_members'
    __table_args__ = {'schema': 'organization_service', 'extend_existing': True}
    uuid: Mapped[uuid_primary_key]
    user_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('user_service.users.uuid', ondelete='CASCADE'),
    )
    organization_uuid: Mapped[UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('organization_service.organizations.uuid', ondelete='CASCADE'),
    )
    roles: Mapped[list[OrganizationRole]] = mapped_column(JSON)
    created_by_uuid: Mapped[created_by_uuid]
    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]
