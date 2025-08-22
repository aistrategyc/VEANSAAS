from __future__ import annotations

import uuid
import enum
from datetime import datetime

from sqlalchemy import Column, String, Boolean, Enum, Text, DateTime, Index
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import relationship

from liderix_api.db import Base
from .mixins import TimestampMixin, SoftDeleteMixin

class UserRole(enum.Enum):
    """
    Роли пользователей приложения.
    """
    admin = "admin"
    member = "member"
    guest = "guest"

class User(Base, TimestampMixin, SoftDeleteMixin):
    """
    Модель для пользователя.
    """
    __tablename__ = "users"

    id = Column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False)
    username = Column(
        String(50),
        unique=True,
        index=True,
        nullable=False)
    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False)
    first_name = Column(
        String(100),
        nullable=True)
    last_name = Column(
        String(100),
        nullable=True)
    full_name = Column(
        String(255),
        nullable=True)
    hashed_password = Column(
        String(255),
        nullable=False)
    is_active = Column(
        Boolean,
        default=True,
        nullable=False)
    is_verified = Column(
        Boolean,
        default=False,
        nullable=False)
    verified_at = Column(
        DateTime(timezone=True),
        nullable=True)
    role = Column(
        String(6),  # ✅ ИСПРАВЛЕНО: использовать String вместо Enum
        default="member",
        nullable=False)
    position = Column(
        String(200),
        nullable=True)
    bio = Column(
        Text,
        nullable=True)
    avatar_url = Column(
        String(500),
        nullable=True)
    timezone = Column(
        String(50),
        nullable=True)
    language = Column(
        String(10),
        nullable=True)
    preferences = Column(
        JSONB,
        nullable=True,
        default=lambda: {})
    last_login_at = Column(
        DateTime(timezone=True),
        nullable=True)
    password_changed_at = Column(
        DateTime(timezone=True),
        nullable=True)
    is_admin = Column(
        Boolean,
        default=False,
        nullable=False)

    client_id = Column(
        PG_UUID(as_uuid=True),
        nullable=True)
    
    # === Новое: поля для email-верификации ===
    verification_token_hash = Column(String(255), nullable=True, index=True)
    verification_token_expires_at = Column(DateTime(timezone=True), nullable=True)

    # API ключи
    api_keys = relationship(
        "APIKey",
        cascade="all, delete-orphan",
        back_populates="user",
        lazy="selectin")
    
    # Клиенты
    clients = relationship(
        "Client",
        cascade="all, delete-orphan",
        back_populates="user",
        lazy="selectin")
    
    # Логи событий
    event_logs = relationship(
        "EventLog",
        cascade="all, delete-orphan",
        back_populates="user",
        lazy="selectin")
    
    # Логи изменений
    change_logs = relationship(
        "ChangeLog",
        cascade="all, delete-orphan",
        back_populates="user",
        lazy="selectin")
    
    # Организации (владелец)
    organizations = relationship(
        "Organization",
        foreign_keys="Organization.owner_id",
        back_populates="owner",
        lazy="selectin")
    
    # Членство в организациях
    memberships = relationship(
        "Membership",
        foreign_keys="Membership.user_id",
        back_populates="user",
        lazy="selectin")
    
    # JWT токены
    jwt_refresh_whitelists = relationship(
        "JWTRefreshWhitelist",
        cascade="all, delete-orphan",
        back_populates="user",
        lazy="selectin")
    
    # Уведомления
    notifications = relationship(
        "Notification",
        cascade="all, delete-orphan",
        back_populates="user",
        lazy="selectin")
    
    # Членство в проектах
    project_memberships = relationship(
        "ProjectMember",
        cascade="all, delete-orphan",
        back_populates="user",
        lazy="selectin")
    
    # Сессии
    sessions = relationship(
        "Session",
        cascade="all, delete-orphan",
        back_populates="user",
        lazy="selectin")
    
    # Области ответственности
    responsibility_scopes = relationship(
        "ResponsibilityScope",
        cascade="all, delete-orphan",
        back_populates="user",
        lazy="selectin")
    
    # Исключения безопасности
    security_exceptions = relationship(
        "SecurityException",
        cascade="all, delete-orphan",
        back_populates="user",
        lazy="selectin")
    
    # Загрузки файлов
    uploads = relationship(
        "Upload",
        cascade="all, delete-orphan",
        back_populates="user",
        lazy="selectin")
    
    # Задачи (разные роли)
    tasks_assigned = relationship(
        "Task",
        foreign_keys="Task.assignee_id",
        back_populates="assignee",
        lazy="selectin")
    
    tasks_created = relationship(
        "Task",
        foreign_keys="Task.creator_id",
        back_populates="creator",
        lazy="selectin")
    
    tasks_reported = relationship(
        "Task",
        foreign_keys="Task.reporter_id",
        back_populates="reporter",
        lazy="selectin")
    
    # Комментарии к задачам
    task_comments = relationship(
        "TaskComment",
        cascade="all, delete-orphan",
        back_populates="user",
        lazy="selectin")
    
    # Задачи проектов (разные роли)
    project_tasks_assigned = relationship(
        "ProjectTask",
        foreign_keys="ProjectTask.assignee_id",
        back_populates="assignee",
        lazy="selectin")
    
    project_tasks_created = relationship(
        "ProjectTask",
        foreign_keys="ProjectTask.creator_id",
        back_populates="creator",
        lazy="selectin")
    
    # Файловые активы (владелец)
    file_assets = relationship(
    "FileAsset",
    back_populates="owner",
    cascade="all, delete-orphan",
    lazy="selectin",
    foreign_keys="FileAsset.owner_id",)
    
    # Менеджер департаментов
    managed_departments = relationship(
        "Department",
        foreign_keys="Department.manager_id",
        back_populates="manager",
        lazy="selectin")
    
    # Прикрепления задач
    task_attachments = relationship(
        "TaskAttachment",
        foreign_keys="TaskAttachment.uploaded_by_id",
        back_populates="uploaded_by",
        lazy="selectin")
    
    # Временные логи задач
    task_time_logs = relationship(
        "TaskTimeLog",
        cascade="all, delete-orphan",
        back_populates="user",
        lazy="selectin")
    
    def __repr__(self) -> str:
        return f"<User id={self.id} username={self.username!r} email={self.email!r} role={self.role!r}>"