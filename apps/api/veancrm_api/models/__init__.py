"""
VEANCRM Models - CRM система для студий красоты
"""

# Базовые модели
from .base import Base, BaseModel, TimestampMixin, SoftDeleteMixin

# Организации и студии
from .organizations import Organization, Studio, OrganizationMember, OrganizationType

# Пользователи и сотрудники
from .crm_users import CrmUser, Employee, ScheduleBlock, UserRole

# Клиенты и лиды
from .clients import Client, Lead, Gender, LeadStatus

# Услуги и ценообразование
from .services import Service, StudioService, ServicePricingRule, ServiceCategory

# Записи и встречи
from .appointments import Appointment, AppointmentService, AppointmentStatus

# Финансы и транзакции
from .transactions import (
    Transaction, Invoice, Refund,
    TransactionType, TransactionCategory, PaymentMethod
)

# Лояльность и скидки
from .loyalty import (
    LoyaltyProgram, LoyaltyAdjustment, PromoCode, PromoCodeUsage, DiscountPolicy
)

# Соглашения и файлы
from .agreements import (
    AgreementTemplate, Agreement, FileAsset,
    AgreementType, SignatureMethod
)

# Зарплаты и расчеты
from .payroll import (
    PayrollRule, PayrollCalculation, PayrollItem, PayrollPayout,
    PayrollStatus
)

# Задачи и цели
from .tasks_goals import (
    Task, Goal, Notification,
    TaskStatus, TaskPriority
)

__all__ = [
    # Базовые
    'Base', 'BaseModel', 'TimestampMixin', 'SoftDeleteMixin',
    
    # Организации
    'Organization', 'Studio', 'OrganizationMember', 'OrganizationType',
    
    # Пользователи
    'CrmUser', 'Employee', 'ScheduleBlock', 'UserRole',
    
    # Клиенты
    'Client', 'Lead', 'Gender', 'LeadStatus',
    
    # Услуги
    'Service', 'StudioService', 'ServicePricingRule', 'ServiceCategory',
    
    # Записи
    'Appointment', 'AppointmentService', 'AppointmentStatus',
    
    # Финансы
    'Transaction', 'Invoice', 'Refund',
    'TransactionType', 'TransactionCategory', 'PaymentMethod',
    
    # Лояльность
    'LoyaltyProgram', 'LoyaltyAdjustment', 'PromoCode', 'PromoCodeUsage', 'DiscountPolicy',
    
    # Соглашения
    'AgreementTemplate', 'Agreement', 'FileAsset',
    'AgreementType', 'SignatureMethod',
    
    # Зарплаты
    'PayrollRule', 'PayrollCalculation', 'PayrollItem', 'PayrollPayout',
    'PayrollStatus',
    
    # Задачи
    'Task', 'Goal', 'Notification',
    'TaskStatus', 'TaskPriority',
]