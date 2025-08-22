"""
Модели услуг и ценообразования для VEANCRM
"""
from sqlalchemy import Column, String, Text, JSON, ForeignKey, Enum, Integer, Decimal, Date, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from .base import BaseModel


class ServiceCategory(str, enum.Enum):
    TATTOO = "tattoo"
    PIERCING = "piercing"
    BARBER = "barber"
    BEAUTY = "beauty"
    NAILS = "nails"
    MASSAGE = "massage"
    OTHER = "other"


class Service(BaseModel):
    """Услуга"""
    __tablename__ = "services"
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=False)
    base_price = Column(Decimal(10, 2), nullable=False)
    category = Column(Enum(ServiceCategory), nullable=False)
    
    # Связи
    studio_services = relationship("StudioService", back_populates="service")
    pricing_rules = relationship("ServicePricingRule", back_populates="service")
    appointment_services = relationship("AppointmentService", back_populates="service")


class StudioService(BaseModel):
    """Связь услуга-студия (услуга может быть доступна в нескольких студиях)"""
    __tablename__ = "studio_services"
    
    studio_id = Column(UUID(as_uuid=True), ForeignKey("studios.id"), nullable=False)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), nullable=False)
    
    # Переопределения для конкретной студии
    custom_price = Column(Decimal(10, 2), nullable=True)
    custom_duration = Column(Integer, nullable=True)
    is_published = Column(Boolean, default=True)
    
    # Связи
    studio = relationship("Studio", back_populates="services")
    service = relationship("Service", back_populates="studio_services")


class ServicePricingRule(BaseModel):
    """Правила ценообразования для услуг"""
    __tablename__ = "service_pricing_rules"
    
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), nullable=False)
    studio_id = Column(UUID(as_uuid=True), ForeignKey("studios.id"), nullable=False)
    
    effective_from = Column(Date, nullable=False)
    effective_to = Column(Date, nullable=True)
    
    # Правила ценообразования (JSON)
    rules = Column(JSON, nullable=False)
    # Пример:
    # [
    #   {"days": ["Fri","Sat"], "time_range":"12:00-20:00", "price": 350},
    #   {"tag":"senior_master", "modifier_percent": 15},
    #   {"tag":"junior_master", "modifier_percent": -10}
    # ]
    
    # Связи
    service = relationship("Service", back_populates="pricing_rules")