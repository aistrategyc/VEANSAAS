from __future__ import annotations
import uuid
#
# NOTE: OrgFKMixin already provides the org_id column for Objective.
#
from enum import Enum as PyEnum
from sqlalchemy import (
    Column,
    String,
    Text,
    DateTime,
    Enum,
    Float,
    ForeignKey)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from liderix_api.db import Base
from .mixins import TimestampMixin, SoftDeleteMixin, OrgFKMixin
class ObjectiveStatus(PyEnum):
    """
    Статусы для целей.
    """
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"
class Objective(Base, TimestampMixin, SoftDeleteMixin, OrgFKMixin):
    """
    Модель для целей (Objectives) по методологии OKR.
    """
    __tablename__ = "objectives"
    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False)
    title = Column(
        String(255),
        nullable=False)
    description = Column(
        Text,
        nullable=True)
    status = Column(
        Enum(ObjectiveStatus, native_enum=False),
        default=ObjectiveStatus.DRAFT,
        nullable=False)
    start_date = Column(
        DateTime(timezone=True),
        nullable=True)
    due_date = Column(
        DateTime(timezone=True),
        nullable=True)

    organization = relationship(
        "Organization",
        lazy="selectin",
        back_populates="objectives",
        overlaps="objectives"
    )

    # Связь к ключевым результатам
    key_results = relationship(
        "KeyResult",
        cascade="all, delete-orphan",
        lazy="selectin",
        back_populates="objective",
        overlaps="objective,key_results"
    )

    __mapper_args__ = {
        "eager_defaults": True,
    }
class KeyResult(Base, TimestampMixin, SoftDeleteMixin):
    """
    Модель для хранения ключевых результатов (Key Results) цели.
    """
    __tablename__ = "key_results"
    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False)
    objective_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("objectives.id", ondelete="CASCADE"),
        nullable=False,
        index=True)
    description = Column(
        String(255),
        nullable=False)
    start_value = Column(
        Float,
        default=0.0,
        nullable=False)
    target_value = Column(
        Float,
        nullable=False)
    current_value = Column(
        Float,
        default=0.0,
        nullable=False)
    unit = Column(
        String(50),
        nullable=True)
    # Ссылка обратно на цель
    objective = relationship(
        "Objective",
        lazy="selectin",
        back_populates="key_results",
        overlaps="objective,key_results"
    )

    __mapper_args__ = {
        "eager_defaults": True,
    }
# Добавлено для совместимости с роутом (OKR как объединённая модель)
class OKR(Objective):
    """
    Объединённая модель OKR для совместимости с роутом (наследует от Objective).
    """
    __tablename__ = None  # Не создаёт новую таблицу, использует objectives