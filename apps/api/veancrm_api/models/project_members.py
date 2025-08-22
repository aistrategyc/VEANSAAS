# apps/api/liderix_api/models/project_members.py

from __future__ import annotations
import uuid

from sqlalchemy import Column, String, ForeignKey, UniqueConstraint, Index
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship

from liderix_api.db import Base
from .mixins import TimestampMixin, SoftDeleteMixin, OrgFKMixin


class ProjectMember(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "project_members"

    __table_args__ = (
        UniqueConstraint("project_id", "user_id", name="uq_project_member_project_user"),
        Index("ix_project_member_role", "role"),
    )

    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False)
    project_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True)
    user_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True)
    role = Column(
        String(50),
        nullable=False)

    project = relationship(
        "Project",
        back_populates="members",
        lazy="selectin",
        overlaps="projects,members"
    )
    user = relationship(
        "User",
        back_populates="project_memberships",
        lazy="selectin",
        overlaps="project_memberships,user"
    )

    __mapper_args__ = {
        "eager_defaults": True,
    }

    def __repr__(self) -> str:
        return f"<ProjectMember id={self.id} project_id={self.project_id} user_id={self.user_id} role={self.role!r}>"