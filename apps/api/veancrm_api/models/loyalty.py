"""
Модели лояльности и скидок для VEANCRM
"""
from sqlalchemy import Column, String, Text, JSON, ForeignKey, Enum, DateTime, Decimal, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from .base import BaseModel


class LoyaltyProgram(BaseModel):
    """Программа лояльности студии"""
    __tablename__ = "loyalty_programs"
    
    studio_id = Column(UUID(as_uuid=True), ForeignKey("studios.id"), nullable=False)
    name = Column(String(255), nullable=False)
    
    # Правила программы лояльности
    rules = Column(JSON, nullable=False)
    # Пример:
    # {
    #   "point_rate": 0.05,  # 5% от суммы покупки в баллах
    #   "earn_on": ["service_payment"],
    #   "redeem_rate": 0.01,  # 1 балл = 0.01 валюты
    #   "caps": {"max_earn_per_visit": 100, "max_redeem_per_visit": 50}
    # }
    
    # Связи
    studio = relationship("Studio")


class LoyaltyAdjustment(BaseModel):
    """Корректировка баллов лояльности"""
    __tablename__ = "loyalty_adjustments"
    
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    
    delta = Column(Integer, nullable=False)  # +/- баллов
    reason = Column(Text, nullable=False)
    
    # Связанная транзакция (если корректировка связана с покупкой)
    transaction_id = Column(UUID(as_uuid=True), ForeignKey("transactions.id"), nullable=True)
    
    # Связи
    client = relationship("Client", back_populates="loyalty_adjustments")


class PromoCode(BaseModel):
    """Промокод"""
    __tablename__ = "promo_codes"
    
    code = Column(String(50), unique=True, nullable=False)
    
    # Скидка
    discount_percent = Column(Decimal(5, 2), nullable=True)
    discount_amount = Column(Decimal(10, 2), nullable=True)
    
    # Период действия
    valid_from = Column(DateTime(timezone=True), nullable=False)
    valid_to = Column(DateTime(timezone=True), nullable=True)
    
    # Ограничения использования
    usage_limit = Column(Integer, nullable=True)  # общий лимит
    usage_count = Column(Integer, default=0)  # сколько раз использован
    
    # Фильтры применения
    service_ids = Column(JSON, nullable=True)  # только для определенных услуг
    client_ids = Column(JSON, nullable=True)  # только для определенных клиентов
    
    # Связи
    usages = relationship("PromoCodeUsage", back_populates="promo_code")


class PromoCodeUsage(BaseModel):
    """Использование промокода"""
    __tablename__ = "promo_code_usages"
    
    promo_code_id = Column(UUID(as_uuid=True), ForeignKey("promo_codes.id"), nullable=False)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=False)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    
    discount_applied = Column(Decimal(10, 2), nullable=False)
    
    # Связи
    promo_code = relationship("PromoCode", back_populates="usages")
    appointment = relationship("Appointment")
    client = relationship("Client")


class DiscountPolicy(BaseModel):
    """Политика скидок (студент, постоянный клиент, happy hours)"""
    __tablename__ = "discount_policies"
    
    studio_id = Column(UUID(as_uuid=True), ForeignKey("studios.id"), nullable=False)
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Условия применения
    conditions = Column(JSON, nullable=False)
    # Пример:
    # {
    #   "client_tags": ["student"],
    #   "time_range": {"start": "14:00", "end": "16:00"},
    #   "days": ["Monday", "Tuesday"],
    #   "min_visits": 5
    # }
    
    # Скидка
    discount_percent = Column(Decimal(5, 2), nullable=True)
    discount_amount = Column(Decimal(10, 2), nullable=True)
    
    # Связи
    studio = relationship("Studio")