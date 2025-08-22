"""
Модели задач и целей для VEANCRM
"""
from sqlalchemy import Column, String, Text, JSON, ForeignKey, Enum, DateTime, Decimal, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from .base import BaseModel


class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class Task(BaseModel):
    """Задача"""
    __tablename__ = "tasks"
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    studio_id = Column(UUID(as_uuid=True), ForeignKey("studios.id"), nullable=False)
    
    due_date = Column(DateTime(timezone=True), nullable=True)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM)
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING)
    progress = Column(Integer, default=0)  # 0-100%
    
    # Связанная сущность (необязательно)
    linked_entity_type = Column(String(50), nullable=True)  # appointment, client, etc.
    linked_entity_id = Column(UUID(as_uuid=True), nullable=True)
    
    tags = Column(JSON, nullable=True)  # теги для группировки
    
    # Связи
    assignee = relationship("Employee")
    studio = relationship("Studio")


class Goal(BaseModel):
    """Цель (OKR)"""
    __tablename__ = "goals"
    
    studio_id = Column(UUID(as_uuid=True), ForeignKey("studios.id"), nullable=False)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Метрика цели
    target_metric = Column(String(100), nullable=False)  # revenue, appointments, clients
    target_value = Column(Decimal(12, 2), nullable=False)
    current_value = Column(Decimal(12, 2), default=0)
    
    # Временные рамки
    deadline = Column(DateTime(timezone=True), nullable=False)
    
    # Владельцы цели
    owners = Column(JSON, nullable=False)  # список employee_id
    
    # Связи
    studio = relationship("Studio")


class Notification(BaseModel):
    """Уведомление"""
    __tablename__ = "notifications"
    
    # Получатель
    user_id = Column(UUID(as_uuid=True), ForeignKey("crm_users.id"), nullable=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=True)
    
    # Содержание
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    
    # Тип и канал
    notification_type = Column(String(50), nullable=False)  # reminder, alert, info
    channel = Column(String(20), nullable=False)  # push, email, sms, in_app
    
    # Статус
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    # Связанная сущность
    related_entity_type = Column(String(50), nullable=True)
    related_entity_id = Column(UUID(as_uuid=True), nullable=True)
    
    # Связи
    user = relationship("CrmUser")
    employee = relationship("Employee")