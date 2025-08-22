"""
Модели записей и встреч для VEANCRM
"""
from sqlalchemy import Column, String, Text, JSON, ForeignKey, Enum, DateTime, Decimal, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from .base import BaseModel


class AppointmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    RESCHEDULED = "rescheduled"
    COMPLETED = "completed"
    CANCELED = "canceled"
    NO_SHOW = "no_show"


class Appointment(BaseModel):
    """Запись клиента"""
    __tablename__ = "appointments"
    
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    studio_id = Column(UUID(as_uuid=True), ForeignKey("studios.id"), nullable=False)
    master_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=True)
    
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.SCHEDULED)
    
    # Дополнительная информация
    notes = Column(Text, nullable=True)
    discount_percent = Column(Decimal(5, 2), default=0)
    
    # Депозит
    deposit_amount = Column(Decimal(10, 2), nullable=True)
    deposit_method = Column(String(50), nullable=True)  # card, cash, online
    
    # Рассчитываемые поля
    total_price = Column(Decimal(10, 2), nullable=True)
    final_price = Column(Decimal(10, 2), nullable=True)  # с учетом скидок
    
    # Связи
    client = relationship("Client", back_populates="appointments")
    studio = relationship("Studio", back_populates="appointments")
    master = relationship("Employee", back_populates="appointments")
    services = relationship("AppointmentService", back_populates="appointment")
    transactions = relationship("Transaction", back_populates="appointment")
    agreements = relationship("Agreement", back_populates="appointment")


class AppointmentService(BaseModel):
    """Услуги в рамках записи (одна запись может включать несколько услуг)"""
    __tablename__ = "appointment_services"
    
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=False)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), nullable=False)
    
    # Переопределения цены/длительности для конкретной записи
    price_override = Column(Decimal(10, 2), nullable=True)
    duration_override = Column(Integer, nullable=True)  # в минутах
    
    # Связи
    appointment = relationship("Appointment", back_populates="services")
    service = relationship("Service", back_populates="appointment_services")