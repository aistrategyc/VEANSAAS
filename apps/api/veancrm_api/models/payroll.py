"""
Модели зарплат и расчетов для VEANCRM
"""
from sqlalchemy import Column, String, Text, JSON, ForeignKey, Enum, DateTime, Decimal, Date, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from .base import BaseModel


class PayrollStatus(str, enum.Enum):
    DRAFT = "draft"
    CALCULATED = "calculated"
    PAID = "paid"
    CANCELLED = "cancelled"


class PayrollRule(BaseModel):
    """Правила расчета зарплаты"""
    __tablename__ = "payroll_rules"
    
    # Область применения
    studio_id = Column(UUID(as_uuid=True), ForeignKey("studios.id"), nullable=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=True)
    
    scope = Column(String(20), nullable=False)  # "studio" или "employee"
    scope_id = Column(UUID(as_uuid=True), nullable=False)
    
    # Правила расчета
    rules = Column(JSON, nullable=False)
    # Пример см. в employees.salary_scheme
    
    effective_from = Column(Date, nullable=False)
    effective_to = Column(Date, nullable=True)
    
    # Связи
    studio = relationship("Studio")
    employee = relationship("Employee")


class PayrollCalculation(BaseModel):
    """Расчет зарплаты за период"""
    __tablename__ = "payroll_calculations"
    
    studio_id = Column(UUID(as_uuid=True), ForeignKey("studios.id"), nullable=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=True)
    
    # Период расчета
    period_from = Column(Date, nullable=False)
    period_to = Column(Date, nullable=False)
    
    # Статус
    status = Column(Enum(PayrollStatus), default=PayrollStatus.DRAFT)
    
    # Расчетные данные
    calculation_data = Column(JSON, nullable=False)
    # {
    #   "base_salary": 3000,
    #   "percent_earnings": 1200,
    #   "tips": 300,
    #   "bonuses": 100,
    #   "deductions": 50,
    #   "total": 4550,
    #   "breakdown": {...}
    # }
    
    # Даты
    calculated_at = Column(DateTime(timezone=True), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    
    # Связи
    studio = relationship("Studio")
    employee = relationship("Employee")
    payroll_items = relationship("PayrollItem", back_populates="calculation")


class PayrollItem(BaseModel):
    """Элемент расчета зарплаты (детализация)"""
    __tablename__ = "payroll_items"
    
    calculation_id = Column(UUID(as_uuid=True), ForeignKey("payroll_calculations.id"), nullable=False)
    
    # Тип элемента
    item_type = Column(String(50), nullable=False)  # base, percent, tips, bonus, deduction
    description = Column(String(255), nullable=False)
    
    amount = Column(Decimal(10, 2), nullable=False)
    
    # Связанные объекты
    appointment_id = Column(UUID(as_uuid=True), ForeignKey("appointments.id"), nullable=True)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), nullable=True)
    
    # Связи
    calculation = relationship("PayrollCalculation", back_populates="payroll_items")
    appointment = relationship("Appointment")
    service = relationship("Service")


class PayrollPayout(BaseModel):
    """Выплата зарплаты"""
    __tablename__ = "payroll_payouts"
    
    calculation_id = Column(UUID(as_uuid=True), ForeignKey("payroll_calculations.id"), nullable=False)
    
    amount = Column(Decimal(10, 2), nullable=False)
    payment_method = Column(String(50), nullable=False)  # cash, transfer, card
    pay_date = Column(Date, nullable=False)
    
    note = Column(Text, nullable=True)
    
    # Связанная транзакция
    transaction_id = Column(UUID(as_uuid=True), ForeignKey("transactions.id"), nullable=True)
    
    # Связи
    calculation = relationship("PayrollCalculation")
    transaction = relationship("Transaction")