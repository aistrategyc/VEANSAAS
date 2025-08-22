"""
Модели организаций и студий для VEANCRM
"""
from sqlalchemy import Column, String, Text, JSON, ForeignKey, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from .base import BaseModel


class OrganizationType(str, enum.Enum):
    MULTI_STUDIO = "multi_studio"
    SINGLE_STUDIO = "single_studio"


class Organization(BaseModel):
    """Организация (владелец может иметь несколько организаций)"""
    __tablename__ = "organizations"
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(Enum(OrganizationType), default=OrganizationType.MULTI_STUDIO)
    
    # Настройки организации
    currency = Column(String(3), default="USD")  # ISO currency code
    default_tz = Column(String(50), default="UTC")
    taxation_schema = Column(JSON, nullable=True)
    invoice_series_prefix = Column(String(10), default="INV")
    
    # Политики
    cancellation_policies = Column(JSON, nullable=True)
    booking_policies = Column(JSON, nullable=True)
    
    # Связи
    studios = relationship("Studio", back_populates="organization", cascade="all, delete-orphan")
    members = relationship("OrganizationMember", back_populates="organization", cascade="all, delete-orphan")


class Studio(BaseModel):
    """Студия (тату/пирсинг/барбершоп/бьюти)"""
    __tablename__ = "studios"
    
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    
    # Контактная информация
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    
    # Настройки расписания
    tz = Column(String(50), default="UTC")
    working_hours = Column(JSON, nullable=True)  # {"monday": {"start": "09:00", "end": "18:00"}, ...}
    
    # Менеджер студии
    manager_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=True)
    
    # Связи
    organization = relationship("Organization", back_populates="studios")
    employees = relationship("Employee", back_populates="studio", cascade="all, delete-orphan")
    services = relationship("StudioService", back_populates="studio", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="studio")


class OrganizationMember(BaseModel):
    """Участник организации (связь пользователь-организация-роль)"""
    __tablename__ = "organization_members"
    
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    role = Column(String(50), nullable=False)  # Owner, Manager, etc.
    
    # Связи
    organization = relationship("Organization", back_populates="members")
    user = relationship("User", back_populates="organization_memberships")