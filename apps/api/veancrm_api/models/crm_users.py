"""
Модели пользователей и сотрудников для VEANCRM
"""
from sqlalchemy import Column, String, Text, JSON, ForeignKey, Enum, DateTime, Decimal, Date, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from .base import BaseModel


class UserRole(str, enum.Enum):
    OWNER = "Owner"
    MASTER_OWNER = "MasterOwner"
    MANAGER = "Manager"
    ADMINISTRATOR = "Administrator"  # Receptionist
    MASTER = "Master"  # Employee


class CrmUser(BaseModel):
    """Пользователь системы"""
    __tablename__ = "crm_users"
    
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    phone = Column(String(50), nullable=True)
    
    # Настройки пользователя
    tz = Column(String(50), default="UTC")
    preferred_language = Column(String(10), default="en")
    avatar_url = Column(String(500), nullable=True)
    
    # Статусы
    is_verified = Column(Boolean, default=False)
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    
    # Связи
    organization_memberships = relationship("OrganizationMember", back_populates="user")
    employee_records = relationship("Employee", back_populates="user")


class Employee(BaseModel):
    """Сотрудник студии (мастер, администратор и т.д.)"""
    __tablename__ = "employees"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("crm_users.id"), nullable=False)
    studio_id = Column(UUID(as_uuid=True), ForeignKey("studios.id"), nullable=False)
    
    role_in_studio = Column(Enum(UserRole), nullable=False)
    hire_date = Column(Date, nullable=True)
    
    # Схема зарплаты (JSON)
    salary_scheme = Column(JSON, nullable=True)
    
    # Связи
    user = relationship("CrmUser", back_populates="employee_records")
    studio = relationship("Studio", back_populates="employees")
    appointments = relationship("Appointment", back_populates="master")
    schedule_blocks = relationship("ScheduleBlock", back_populates="employee")


class ScheduleBlock(BaseModel):
    """Блокировки времени (отпуск, перерыв, обучение)"""
    __tablename__ = "schedule_blocks"
    
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    studio_id = Column(UUID(as_uuid=True), ForeignKey("studios.id"), nullable=False)
    
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    reason = Column(Text, nullable=True)
    block_type = Column(String(50), nullable=False)
    
    # Связи
    employee = relationship("Employee", back_populates="schedule_blocks")