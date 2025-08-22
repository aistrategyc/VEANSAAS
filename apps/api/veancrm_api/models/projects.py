from __future__ import annotations
import uuid
from enum import Enum as PythonEnum
from sqlalchemy import Column, String, Text, Enum, DateTime, ForeignKey, Index, Integer, Boolean, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import relationship
from liderix_api.db import Base
from .mixins import TimestampMixin, SoftDeleteMixin, OrgFKMixin
class ProjectStatus(PythonEnum):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
class ProjectMemberRole(PythonEnum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"
class Project(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "projects"
    __table_args__ = (
        Index("ix_project_metadata_gin", "metadata", postgresql_using="gin"),
        {"extend_existing": True})
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    status = Column(Enum(ProjectStatus, native_enum=False), default=ProjectStatus.DRAFT, nullable=False)
    meta_data = Column("metadata", JSONB, nullable=True, default=lambda: {})
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    organization = relationship("Organization", lazy="selectin", overlaps="projects")
    members = relationship("ProjectMember", back_populates="project", cascade="all, delete-orphan", lazy="selectin", overlaps="project,members")
    tasks = relationship("ProjectTask", back_populates="project", cascade="all, delete-orphan", lazy="selectin", overlaps="project,tasks")
    __mapper_args__ = {"eager_defaults": True}
class ProjectTask(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "project_tasks"
    __table_args__ = (
        Index("ix_task_metadata_gin", "metadata", postgresql_using="gin"),
        Index("ix_task_status_priority", "status", "priority"),
        {"extend_existing": True})
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    project_id = Column(PG_UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(500), nullable=False, index=True)
    description = Column(Text, nullable=True)
    status = Column(Enum("todo","in_progress","review","done","cancelled", name="task_status"), default="todo", nullable=False)
    priority = Column(Enum("low","medium","high","urgent", name="task_priority"), default="medium", nullable=False)
    assignee_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    creator_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    due_date = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    estimated_hours = Column(Integer, nullable=True)
    actual_hours = Column(Integer, nullable=True)
    meta_data = Column("metadata", JSONB, nullable=True, default=lambda: {})
    project = relationship("Project", back_populates="tasks", lazy="selectin", overlaps="project,tasks")
    assignee = relationship("User", foreign_keys=[assignee_id], lazy="selectin")
    creator = relationship("User", foreign_keys=[creator_id], lazy="selectin")