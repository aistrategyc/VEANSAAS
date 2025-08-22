"""
Модели финансовых операций для VEANCRM
"""
from sqlalchemy import Column, String, Text, JSON, ForeignKey, Enum, DateTime, Decimal, Date, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from .base import BaseModel


class TransactionType(str, enum.Enum):
    INCOME = "income"
    EXPENSE = "expense"


class TransactionCategory(str, enum.Enum):
    SERVICE_PAYMENT = "service_payment"
    MATERIALS = "materials"
    RENT = "rent"
    MARKETING = "marketing"
    SALARY = "salary"
    DEPOSIT = "deposit"
    REFUND = "refund"
    TIPS = "tips"


class PaymentMethod(str, enum.Enum):
    CASH = "cash"
    CARD = "card"
    TRANSFER = "transfer"
    POS = "pos"
    ONLINE = "online"


class Transaction(BaseModel):
    """Финансовая транзакция"""
    __tablename__ = "transactions"
    
    studio_id = Column(UUID(as_uuid=True), ForeignKey("studios.id"), nullable=False)
    
    type = Column(Enum(TransactionType), nullable=False)
    category = Column(Enum(TransactionCategory), nullable=False)
    
    amount = Column(Decimal(10, 2), nullable=False)
    currency = Column(String(3), default="USD")
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    
    # Связи
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)
    invoice_id = Column(UUID(as_uuid=True), ForeignKey("invoices.id"), nullable=True)
    
    note = Column(Text, nullable=True)
    
    # Связи
    appointment = relationship("Appointment", back_populates="transactions")
    invoice = relationship("Invoice", back_populates="transactions")


class Invoice(BaseModel):
    """Счет для клиента"""
    __tablename__ = "invoices"
    
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)
    
    series = Column(String(20), nullable=True)  # INV-2024-001
    number = Column(String(50), nullable=False)
    
    # Даты
    issue_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=True)
    
    # Позиции счета
    items = Column(JSON, nullable=False)  # [{"title": "Tattoo", "qty": 1, "price": 200}]
    
    # Налоги и суммы
    tax_rate = Column(Decimal(5, 2), default=0)
    subtotal = Column(Decimal(10, 2), nullable=False)
    tax_amount = Column(Decimal(10, 2), default=0)
    total = Column(Decimal(10, 2), nullable=False)
    
    # Статус
    is_paid = Column(Boolean, default=False)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    
    # Связи
    client = relationship("Client")
    appointment = relationship("Appointment")
    transactions = relationship("Transaction", back_populates="invoice")


class Refund(BaseModel):
    """Возврат средств"""
    __tablename__ = "refunds"
    
    original_transaction_id = Column(UUID(as_uuid=True), ForeignKey("transactions.id"), nullable=False)
    
    amount = Column(Decimal(10, 2), nullable=False)
    reason = Column(Text, nullable=False)
    
    # Связанная транзакция возврата
    refund_transaction_id = Column(UUID(as_uuid=True), ForeignKey("transactions.id"), nullable=True)
    
    # Связи
    original_transaction = relationship("Transaction", foreign_keys=[original_transaction_id])
    refund_transaction = relationship("Transaction", foreign_keys=[refund_transaction_id])