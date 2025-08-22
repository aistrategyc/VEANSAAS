"""
Appointments endpoints для VEANCRM согласно ТЗ
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal

from ..models import (
    Appointment, AppointmentService, AppointmentStatus,
    Client, Studio, Employee, Service, Transaction, TransactionType, TransactionCategory
)
from ..schemas.crm_schemas import AppointmentCreate, AppointmentResponse
from ..db import get_async_session


router = APIRouter(prefix="/v1/appointments", tags=["Appointments"])


async def calculate_appointment_price(
    service: Service, 
    discount_percent: int = 0,
    db: AsyncSession = None
) -> tuple[Decimal, Decimal]:
    """
    Расчет цены с учетом pricing-rules + скидки + промокоды/лояльность
    
    Returns: (total_price, final_price)
    """
    # Базовая цена услуги
    total_price = service.base_price
    
    # TODO: Применить правила ценообразования (ServicePricingRule)
    # TODO: Применить промокоды
    # TODO: Применить баллы лояльности
    
    # Применяем скидку
    discount_amount = total_price * Decimal(discount_percent) / Decimal(100)
    final_price = total_price - discount_amount
    
    return total_price, final_price


@router.post("", response_model=AppointmentResponse)
async def create_appointment(
    appointment_data: AppointmentCreate,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Создание записи согласно ТЗ
    
    Внутренние шаги:
    1. проверка доступности слота employees/:id/availability
    2. расчёт цены pricing-rules + скидки + промокоды/лояльность
    3. создание Appointment(status='scheduled')
    4. при депозите — создание Transaction(income, deposit) со связью
    5. уведомления клиенту/мастеру; календарные webhooks (опц)
    """
    
    # 1. Проверяем существование связанных объектов
    client_result = await db.execute(
        select(Client).where(Client.id == appointment_data.client_id)
    )
    client = client_result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    studio_result = await db.execute(
        select(Studio).where(Studio.id == appointment_data.studio_id)
    )
    studio = studio_result.scalar_one_or_none()
    if not studio:
        raise HTTPException(status_code=404, detail="Studio not found")
    
    master_result = await db.execute(
        select(Employee).where(Employee.id == appointment_data.master_id)
    )
    master = master_result.scalar_one_or_none()
    if not master:
        raise HTTPException(status_code=404, detail="Master not found")
    
    service_result = await db.execute(
        select(Service).where(Service.id == appointment_data.service_id)
    )
    service = service_result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # TODO: 1. Проверка доступности слота (employees/:id/availability)
    # В реальности здесь должна быть проверка расписания мастера
    
    # 2. Расчёт цены
    total_price, final_price = await calculate_appointment_price(
        service, 
        appointment_data.discount_percent,
        db
    )
    
    # Вычисляем время окончания записи
    end_time = appointment_data.start_time.replace(
        minute=appointment_data.start_time.minute + service.duration_minutes
    )
    
    # 3. Создание Appointment
    appointment = Appointment(
        client_id=appointment_data.client_id,
        studio_id=appointment_data.studio_id,
        master_id=appointment_data.master_id,
        start_time=appointment_data.start_time,
        end_time=end_time,
        status=AppointmentStatus.SCHEDULED,
        notes=appointment_data.notes,
        discount_percent=Decimal(appointment_data.discount_percent),
        total_price=total_price,
        final_price=final_price
    )
    
    # Обрабатываем депозит
    if appointment_data.deposit:
        deposit_amount = Decimal(str(appointment_data.deposit.get("amount", 0)))
        deposit_method = appointment_data.deposit.get("method", "card")
        
        appointment.deposit_amount = deposit_amount
        appointment.deposit_method = deposit_method
    
    db.add(appointment)
    await db.flush()  # получаем ID записи
    
    # Добавляем услугу к записи
    appointment_service = AppointmentService(
        appointment_id=appointment.id,
        service_id=appointment_data.service_id
    )
    db.add(appointment_service)
    
    # 4. При депозите создаем транзакцию
    if appointment.deposit_amount and appointment.deposit_amount > 0:
        deposit_transaction = Transaction(
            studio_id=appointment_data.studio_id,
            type=TransactionType.INCOME,
            category=TransactionCategory.DEPOSIT,
            amount=appointment.deposit_amount,
            payment_method=appointment.deposit_method,
            appointment_id=appointment.id,
            note=f"Deposit for appointment {appointment.id}"
        )
        db.add(deposit_transaction)
    
    await db.commit()
    await db.refresh(appointment)
    
    # 5. TODO: Уведомления клиенту/мастеру; календарные webhooks
    
    return AppointmentResponse(
        id=appointment.id,
        created_at=appointment.created_at,
        updated_at=appointment.updated_at,
        is_active=appointment.is_active,
        client_id=appointment.client_id,
        studio_id=appointment.studio_id,
        master_id=appointment.master_id,
        start_time=appointment.start_time,
        end_time=appointment.end_time,
        status=appointment.status,
        notes=appointment.notes,
        discount_percent=appointment.discount_percent,
        deposit_amount=appointment.deposit_amount,
        deposit_method=appointment.deposit_method,
        total_price=appointment.total_price,
        final_price=appointment.final_price
    )


@router.get("", response_model=List[AppointmentResponse])
async def get_appointments(
    studio_id: Optional[UUID] = Query(None),
    master_id: Optional[UUID] = Query(None),
    client_id: Optional[UUID] = Query(None),
    status: Optional[str] = Query(None),
    from_date: Optional[datetime] = Query(None, alias="from"),
    to_date: Optional[datetime] = Query(None, alias="to"),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_async_session)
):
    """Получение списка записей с фильтрами"""
    
    query = select(Appointment)
    
    if studio_id:
        query = query.where(Appointment.studio_id == studio_id)
    if master_id:
        query = query.where(Appointment.master_id == master_id)
    if client_id:
        query = query.where(Appointment.client_id == client_id)
    if status:
        query = query.where(Appointment.status == status)
    if from_date:
        query = query.where(Appointment.start_time >= from_date)
    if to_date:
        query = query.where(Appointment.start_time <= to_date)
    
    # Пагинация и сортировка
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)
    query = query.order_by(Appointment.start_time.asc())
    
    result = await db.execute(query)
    appointments = result.scalars().all()
    
    return [
        AppointmentResponse(
            id=appointment.id,
            created_at=appointment.created_at,
            updated_at=appointment.updated_at,
            is_active=appointment.is_active,
            client_id=appointment.client_id,
            studio_id=appointment.studio_id,
            master_id=appointment.master_id,
            start_time=appointment.start_time,
            end_time=appointment.end_time,
            status=appointment.status,
            notes=appointment.notes,
            discount_percent=appointment.discount_percent,
            deposit_amount=appointment.deposit_amount,
            deposit_method=appointment.deposit_method,
            total_price=appointment.total_price,
            final_price=appointment.final_price
        )
        for appointment in appointments
    ]


@router.get("/{appointment_id}", response_model=dict)
async def get_appointment(
    appointment_id: UUID,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Получение детальной информации о записи
    
    Включает: фин.операции, историю статусов, прикреплённые файлы, согласия
    """
    
    result = await db.execute(
        select(Appointment)
        .options(
            selectinload(Appointment.services),
            selectinload(Appointment.transactions),
            selectinload(Appointment.agreements)
        )
        .where(Appointment.id == appointment_id)
    )
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    return {
        "id": str(appointment.id),
        "client_id": str(appointment.client_id),
        "studio_id": str(appointment.studio_id),
        "master_id": str(appointment.master_id),
        "start_time": appointment.start_time,
        "end_time": appointment.end_time,
        "status": appointment.status,
        "notes": appointment.notes,
        "total_price": float(appointment.total_price) if appointment.total_price else None,
        "final_price": float(appointment.final_price) if appointment.final_price else None,
        "services": [
            {
                "service_id": str(service.service_id),
                "price_override": float(service.price_override) if service.price_override else None,
                "duration_override": service.duration_override
            }
            for service in appointment.services
        ],
        "transactions": [
            {
                "id": str(transaction.id),
                "type": transaction.type,
                "category": transaction.category,
                "amount": float(transaction.amount),
                "payment_method": transaction.payment_method,
                "created_at": transaction.created_at
            }
            for transaction in appointment.transactions
        ],
        "agreements": [
            {
                "id": str(agreement.id),
                "template_id": str(agreement.template_id),
                "signed_at": agreement.signed_at,
                "signature_method": agreement.signature_method
            }
            for agreement in appointment.agreements
        ]
    }


@router.patch("/{appointment_id}/status", response_model=dict)
async def update_appointment_status(
    appointment_id: UUID,
    status_data: dict,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Обновление статуса записи
    
    Side-effects:
    - canceled → политика удержания депозита (частично/полностью)
    - completed → возможность закрыть чек/пробить оплату; триггер расчёта зарплаты
    """
    
    result = await db.execute(
        select(Appointment).where(Appointment.id == appointment_id)
    )
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    new_status = status_data.get("status")
    reason = status_data.get("reason")
    
    if new_status not in [status.value for status in AppointmentStatus]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    old_status = appointment.status
    appointment.status = AppointmentStatus(new_status)
    
    # Side-effects
    if new_status == "canceled":
        # TODO: Политика удержания депозита
        # Здесь должна быть логика возврата депозита согласно политике студии
        pass
    
    elif new_status == "completed":
        # TODO: Триггер расчёта зарплаты
        # Здесь должна быть логика добавления к расчету зарплаты мастера
        pass
    
    await db.commit()
    
    return {
        "id": str(appointment.id),
        "status": appointment.status,
        "previous_status": old_status,
        "updated_at": appointment.updated_at,
        "reason": reason
    }


@router.post("/{appointment_id}/add-service", response_model=dict)
async def add_service_to_appointment(
    appointment_id: UUID,
    service_data: dict,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Добавление доп.услуг (апселл)
    
    Side-effects: пролонгация слота, перерасчёт
    """
    
    result = await db.execute(
        select(Appointment).where(Appointment.id == appointment_id)
    )
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    service_id = UUID(service_data["service_id"])
    price_override = service_data.get("price_override")
    duration_override = service_data.get("duration_override")
    
    # Проверяем существование услуги
    service_result = await db.execute(
        select(Service).where(Service.id == service_id)
    )
    service = service_result.scalar_one_or_none()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Добавляем услугу к записи
    appointment_service = AppointmentService(
        appointment_id=appointment_id,
        service_id=service_id,
        price_override=Decimal(str(price_override)) if price_override else None,
        duration_override=duration_override
    )
    
    db.add(appointment_service)
    
    # TODO: Пролонгация слота (обновление end_time)
    if duration_override:
        additional_minutes = duration_override
    else:
        additional_minutes = service.duration_minutes
    
    if appointment.end_time:
        new_end_time = appointment.end_time.replace(
            minute=appointment.end_time.minute + additional_minutes
        )
        appointment.end_time = new_end_time
    
    # TODO: Перерасчёт цены
    if price_override:
        additional_price = Decimal(str(price_override))
    else:
        additional_price = service.base_price
    
    if appointment.total_price:
        appointment.total_price += additional_price
    if appointment.final_price:
        appointment.final_price += additional_price
    
    await db.commit()
    
    return {
        "appointment_id": str(appointment_id),
        "service_added": str(service_id),
        "new_end_time": appointment.end_time,
        "new_total_price": float(appointment.total_price) if appointment.total_price else None
    }