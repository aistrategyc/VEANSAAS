"""
Pydantic схемы для VEANCRM API
"""
from typing import List, Optional, Dict, Any, Union
from datetime import datetime, date, time
from decimal import Decimal
from pydantic import BaseModel, Field, EmailStr
from uuid import UUID
import enum


# ===== БАЗОВЫЕ СХЕМЫ =====

class BaseResponse(BaseModel):
    """Базовый ответ API"""
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_active: bool = True


# ===== AUTH & USERS =====

class UserRole(str, enum.Enum):
    OWNER = "Owner"
    MASTER_OWNER = "MasterOwner"
    MANAGER = "Manager"
    ADMINISTRATOR = "Administrator"
    MASTER = "Master"


class UserRegister(BaseModel):
    """Регистрация пользователя"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: UserRole
    invite_token: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserLogin(BaseModel):
    """Логин пользователя"""
    email: EmailStr
    password: str


class UserResponse(BaseResponse):
    """Ответ пользователя"""
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    tz: str = "UTC"
    preferred_language: str = "en"
    avatar_url: Optional[str] = None
    is_verified: bool = False
    last_login_at: Optional[datetime] = None


# ===== ORGANIZATIONS & STUDIOS =====

class OrganizationType(str, enum.Enum):
    MULTI_STUDIO = "multi_studio"
    SINGLE_STUDIO = "single_studio"


class OrganizationCreate(BaseModel):
    """Создание организации"""
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    type: OrganizationType = OrganizationType.MULTI_STUDIO


class StudioCreate(BaseModel):
    """Создание студии"""
    org_id: UUID
    name: str = Field(..., max_length=255)
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    tz: str = "UTC"
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    working_hours: Optional[Dict[str, Dict[str, str]]] = None  # {"monday": {"start": "09:00", "end": "18:00"}}
    manager_id: Optional[UUID] = None


class StudioResponse(BaseResponse):
    """Ответ студии"""
    organization_id: UUID
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    tz: str
    working_hours: Optional[Dict[str, Dict[str, str]]] = None
    manager_id: Optional[UUID] = None


# ===== CLIENTS & LEADS =====

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


class ClientCreate(BaseModel):
    """Создание клиента"""
    full_name: str = Field(..., max_length=255)
    phone: str = Field(..., max_length=50)
    email: Optional[EmailStr] = None
    birthday: Optional[date] = None
    gender: Optional[Gender] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None


class ClientResponse(BaseResponse):
    """Ответ клиента"""
    full_name: str
    phone: str
    email: Optional[str] = None
    birthday: Optional[date] = None
    gender: Optional[Gender] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None
    loyalty_points: int = 0
    discount_percent: Decimal = Decimal('0.00')


class LeadCreate(BaseModel):
    """Создание лида"""
    source: str = Field(..., max_length=100)
    utm_params: Optional[Dict[str, Any]] = None
    responsible_id: Optional[UUID] = None
    client_id: Optional[UUID] = None
    note: Optional[str] = None


# ===== SERVICES =====

class ServiceCategory(str, enum.Enum):
    TATTOO = "tattoo"
    PIERCING = "piercing"
    BARBER = "barber"
    BEAUTY = "beauty"
    NAILS = "nails"
    MASSAGE = "massage"
    OTHER = "other"


class ServiceCreate(BaseModel):
    """Создание услуги"""
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    duration_minutes: int = Field(..., gt=0)
    base_price: Decimal = Field(..., ge=0)
    category: ServiceCategory
    studio_ids: Optional[List[UUID]] = None


class ServiceResponse(BaseResponse):
    """Ответ услуги"""
    name: str
    description: Optional[str] = None
    duration_minutes: int
    base_price: Decimal
    category: ServiceCategory


# ===== APPOINTMENTS =====

class AppointmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    RESCHEDULED = "rescheduled"
    COMPLETED = "completed"
    CANCELED = "canceled"
    NO_SHOW = "no_show"


class AppointmentCreate(BaseModel):
    """Создание записи согласно ТЗ"""
    client_id: UUID
    studio_id: UUID
    service_id: UUID
    master_id: UUID
    start_time: datetime
    notes: Optional[str] = None
    discount_percent: int = Field(default=0, ge=0, le=100)
    deposit: Optional[Dict[str, Any]] = None  # {"amount": Decimal, "method": "card|cash|online"}


class AppointmentResponse(BaseResponse):
    """Ответ записи"""
    client_id: UUID
    studio_id: UUID
    master_id: UUID
    start_time: datetime
    end_time: Optional[datetime] = None
    status: AppointmentStatus
    notes: Optional[str] = None
    discount_percent: Decimal
    deposit_amount: Optional[Decimal] = None
    deposit_method: Optional[str] = None
    total_price: Optional[Decimal] = None
    final_price: Optional[Decimal] = None


# ===== TRANSACTIONS =====

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


class PaymentMethod(str, enum.Enum):
    CASH = "cash"
    CARD = "card"
    TRANSFER = "transfer"
    POS = "pos"
    ONLINE = "online"


class TransactionCreate(BaseModel):
    """Создание транзакции согласно ТЗ"""
    studio_id: UUID
    type: TransactionType
    category: TransactionCategory
    amount: Decimal = Field(..., ge=0)
    currency: str = Field(default="USD", max_length=3)
    payment_method: PaymentMethod
    appointment_id: Optional[UUID] = None
    note: Optional[str] = None


class TransactionResponse(BaseResponse):
    """Ответ транзакции"""
    studio_id: UUID
    type: TransactionType
    category: TransactionCategory
    amount: Decimal
    currency: str
    payment_method: PaymentMethod
    appointment_id: Optional[UUID] = None
    note: Optional[str] = None


# ===== PAYROLL =====

class PayrollCalculateRequest(BaseModel):
    """Запрос расчета зарплаты согласно ТЗ"""
    studio_id: Optional[UUID] = None
    employee_id: Optional[UUID] = None
    period_from: date
    period_to: date
    include_tips: bool = True


class PayrollResponse(BaseResponse):
    """Ответ расчета зарплаты"""
    studio_id: Optional[UUID] = None
    employee_id: Optional[UUID] = None
    period_from: date
    period_to: date
    calculation_data: Dict[str, Any]
    status: str
    calculated_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None