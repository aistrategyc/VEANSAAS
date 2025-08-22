"""
Модели клиентов и лидов для VEANCRM
"""
from sqlalchemy import Column, String, Text, JSON, ForeignKey, Enum, DateTime, Date, Integer, Decimal
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from .base import BaseModel


class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class LeadStatus(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    BOOKED = "booked"
    WON = "won"
    LOST = "lost"


class Client(BaseModel):
    """Клиент студии"""
    __tablename__ = "clients"
    
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)  # Основной идентификатор
    email = Column(String(255), nullable=True)
    
    birthday = Column(Date, nullable=True)
    gender = Column(Enum(Gender), nullable=True)
    
    # Дополнительная информация
    tags = Column(JSON, nullable=True)  # ["VIP", "regular", "first_time"]
    notes = Column(Text, nullable=True)
    
    # Настройки лояльности
    loyalty_points = Column(Integer, default=0)
    discount_percent = Column(Decimal(5, 2), default=0)
    
    # Связи
    appointments = relationship("Appointment", back_populates="client")
    leads = relationship("Lead", back_populates="client")
    agreements = relationship("Agreement", back_populates="client")
    loyalty_adjustments = relationship("LoyaltyAdjustment", back_populates="client")


class Lead(BaseModel):
    """Лид (потенциальный клиент)"""
    __tablename__ = "leads"
    
    source = Column(String(100), nullable=False)  # instagram, google, referral, etc.
    utm_params = Column(JSON, nullable=True)
    
    responsible_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=True)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=True)
    
    status = Column(Enum(LeadStatus), default=LeadStatus.NEW)
    note = Column(Text, nullable=True)
    
    # Связи
    responsible = relationship("Employee")
    client = relationship("Client", back_populates="leads")