"""
Transactions, Payments & Payroll endpoints для VEANCRM согласно ТЗ
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from uuid import UUID
from datetime import date, datetime
from decimal import Decimal

from ..models import (
    Transaction, Invoice, Refund, PayrollCalculation, PayrollItem,
    TransactionType, TransactionCategory, PaymentMethod, PayrollStatus
)
from ..schemas.crm_schemas import (
    TransactionCreate, TransactionResponse,
    PayrollCalculateRequest, PayrollResponse
)
from ..db import get_async_session


router = APIRouter(tags=["Transactions & Payroll"])


# ===== TRANSACTIONS =====

@router.post("/v1/transactions", response_model=TransactionResponse)
async def create_transaction(
    transaction_data: TransactionCreate,
    db: AsyncSession = Depends(get_async_session)
):
    """Создание финансовой транзакции согласно ТЗ"""
    
    transaction = Transaction(
        studio_id=transaction_data.studio_id,
        type=transaction_data.type,
        category=transaction_data.category,
        amount=transaction_data.amount,
        currency=transaction_data.currency,
        payment_method=transaction_data.payment_method,
        appointment_id=transaction_data.appointment_id,
        note=transaction_data.note
    )
    
    db.add(transaction)
    await db.commit()
    await db.refresh(transaction)
    
    return TransactionResponse(
        id=transaction.id,
        created_at=transaction.created_at,
        updated_at=transaction.updated_at,
        is_active=transaction.is_active,
        studio_id=transaction.studio_id,
        type=transaction.type,
        category=transaction.category,
        amount=transaction.amount,
        currency=transaction.currency,
        payment_method=transaction.payment_method,
        appointment_id=transaction.appointment_id,
        note=transaction.note
    )


@router.get("/v1/transactions", response_model=List[TransactionResponse])
async def get_transactions(
    studio_id: Optional[UUID] = Query(None),
    type: Optional[TransactionType] = Query(None),
    category: Optional[TransactionCategory] = Query(None),
    from_date: Optional[datetime] = Query(None, alias="from"),
    to_date: Optional[datetime] = Query(None, alias="to"),
    payment_method: Optional[PaymentMethod] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_async_session)
):
    """Получение списка транзакций с фильтрами"""
    
    query = select(Transaction)
    
    if studio_id:
        query = query.where(Transaction.studio_id == studio_id)
    if type:
        query = query.where(Transaction.type == type)
    if category:
        query = query.where(Transaction.category == category)
    if from_date:
        query = query.where(Transaction.created_at >= from_date)
    if to_date:
        query = query.where(Transaction.created_at <= to_date)
    if payment_method:
        query = query.where(Transaction.payment_method == payment_method)
    
    # Пагинация и сортировка
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)
    query = query.order_by(Transaction.created_at.desc())
    
    result = await db.execute(query)
    transactions = result.scalars().all()
    
    return [
        TransactionResponse(
            id=transaction.id,
            created_at=transaction.created_at,
            updated_at=transaction.updated_at,
            is_active=transaction.is_active,
            studio_id=transaction.studio_id,
            type=transaction.type,
            category=transaction.category,
            amount=transaction.amount,
            currency=transaction.currency,
            payment_method=transaction.payment_method,
            appointment_id=transaction.appointment_id,
            note=transaction.note
        )
        for transaction in transactions
    ]


# ===== INVOICES =====

@router.post("/v1/invoices", response_model=dict)
async def create_invoice(
    invoice_data: dict,
    db: AsyncSession = Depends(get_async_session)
):
    """Выставление счета клиенту/юр.лицу"""
    
    # Вычисляем суммы
    items = invoice_data["items"]
    subtotal = Decimal(0)
    
    for item in items:
        item_total = Decimal(str(item["qty"])) * Decimal(str(item["price"]))
        subtotal += item_total
    
    tax_rate = Decimal(str(invoice_data.get("tax_rate", 0)))
    tax_amount = subtotal * tax_rate / Decimal(100)
    total = subtotal + tax_amount
    
    invoice = Invoice(
        client_id=UUID(invoice_data["client_id"]),
        appointment_id=UUID(invoice_data["appointment_id"]) if invoice_data.get("appointment_id") else None,
        series=invoice_data.get("series"),
        number=invoice_data["number"] if "number" in invoice_data else f"INV-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
        issue_date=datetime.fromisoformat(invoice_data["issue_date"]).date() if "issue_date" in invoice_data else date.today(),
        due_date=datetime.fromisoformat(invoice_data["due_date"]).date() if invoice_data.get("due_date") else None,
        items=items,
        tax_rate=tax_rate,
        subtotal=subtotal,
        tax_amount=tax_amount,
        total=total
    )
    
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)
    
    return {
        "id": str(invoice.id),
        "number": invoice.number,
        "total": float(invoice.total),
        "issue_date": invoice.issue_date,
        "created_at": invoice.created_at
    }


@router.post("/v1/payments/capture", response_model=dict)
async def capture_payment(
    payment_data: dict,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Проведение оплаты по счету/записи
    
    Side-effects: Transaction(income), закрытие invoice, обновление статуса appointment
    """
    
    invoice_id = payment_data.get("invoice_id")
    appointment_id = payment_data.get("appointment_id")
    amount = Decimal(str(payment_data["amount"]))
    method = payment_data["method"]
    
    # Находим студию (через invoice или appointment)
    studio_id = None
    
    if invoice_id:
        result = await db.execute(select(Invoice).where(Invoice.id == UUID(invoice_id)))
        invoice = result.scalar_one_or_none()
        if invoice:
            # Получаем studio_id через appointment
            if invoice.appointment_id:
                from ..models import Appointment
                appt_result = await db.execute(select(Appointment).where(Appointment.id == invoice.appointment_id))
                appointment = appt_result.scalar_one_or_none()
                if appointment:
                    studio_id = appointment.studio_id
            
            # Отмечаем invoice как оплаченный
            invoice.is_paid = True
            invoice.paid_at = datetime.utcnow()
    
    if appointment_id:
        from ..models import Appointment
        result = await db.execute(select(Appointment).where(Appointment.id == UUID(appointment_id)))
        appointment = result.scalar_one_or_none()
        if appointment:
            studio_id = appointment.studio_id
    
    if not studio_id:
        raise HTTPException(status_code=400, detail="Cannot determine studio_id")
    
    # Создаем транзакцию дохода
    transaction = Transaction(
        studio_id=studio_id,
        type=TransactionType.INCOME,
        category=TransactionCategory.SERVICE_PAYMENT,
        amount=amount,
        currency="USD",
        payment_method=PaymentMethod(method),
        appointment_id=UUID(appointment_id) if appointment_id else None,
        invoice_id=UUID(invoice_id) if invoice_id else None,
        note=f"Payment capture for {'invoice' if invoice_id else 'appointment'}"
    )
    
    db.add(transaction)
    await db.commit()
    
    return {
        "transaction_id": str(transaction.id),
        "amount": float(amount),
        "status": "captured",
        "created_at": transaction.created_at
    }


@router.post("/v1/refunds", response_model=dict)
async def create_refund(
    refund_data: dict,
    db: AsyncSession = Depends(get_async_session)
):
    """Создание возврата (частичного/полного)"""
    
    original_transaction_id = UUID(refund_data["transaction_id"])
    amount = Decimal(str(refund_data["amount"]))
    reason = refund_data["reason"]
    
    # Находим оригинальную транзакцию
    result = await db.execute(select(Transaction).where(Transaction.id == original_transaction_id))
    original_transaction = result.scalar_one_or_none()
    
    if not original_transaction:
        raise HTTPException(status_code=404, detail="Original transaction not found")
    
    if amount > original_transaction.amount:
        raise HTTPException(status_code=400, detail="Refund amount cannot exceed original amount")
    
    # Создаем транзакцию возврата
    refund_transaction = Transaction(
        studio_id=original_transaction.studio_id,
        type=TransactionType.EXPENSE,
        category=TransactionCategory.REFUND,
        amount=amount,
        currency=original_transaction.currency,
        payment_method=original_transaction.payment_method,
        note=f"Refund for transaction {original_transaction_id}: {reason}"
    )
    
    db.add(refund_transaction)
    await db.flush()
    
    # Создаем запись возврата
    refund = Refund(
        original_transaction_id=original_transaction_id,
        amount=amount,
        reason=reason,
        refund_transaction_id=refund_transaction.id
    )
    
    db.add(refund)
    await db.commit()
    
    return {
        "refund_id": str(refund.id),
        "refund_transaction_id": str(refund_transaction.id),
        "amount": float(amount),
        "reason": reason,
        "created_at": refund.created_at
    }


# ===== PAYROLL =====

@router.post("/v1/payroll/calculate", response_model=dict)
async def calculate_payroll(
    payroll_data: PayrollCalculateRequest,
    db: AsyncSession = Depends(get_async_session)
):
    """Расчёт зарплаты за период согласно ТЗ"""
    
    # TODO: Реализовать сложную логику расчета зарплаты
    # согласно salary_scheme из Employee модели
    
    calculation = PayrollCalculation(
        studio_id=payroll_data.studio_id,
        employee_id=payroll_data.employee_id,
        period_from=payroll_data.period_from,
        period_to=payroll_data.period_to,
        status=PayrollStatus.CALCULATED,
        calculation_data={
            "base_salary": 3000,
            "percent_earnings": 1200,
            "tips": 300 if payroll_data.include_tips else 0,
            "bonuses": 100,
            "deductions": 50,
            "total": 4550,
            "breakdown": {
                "appointments_count": 15,
                "total_revenue": 3000,
                "commission_rate": 40
            }
        },
        calculated_at=datetime.utcnow()
    )
    
    db.add(calculation)
    await db.commit()
    await db.refresh(calculation)
    
    return {
        "calculation_id": str(calculation.id),
        "period_from": calculation.period_from,
        "period_to": calculation.period_to,
        "total_amount": calculation.calculation_data.get("total", 0),
        "breakdown": calculation.calculation_data,
        "status": calculation.status,
        "calculated_at": calculation.calculated_at
    }


@router.post("/v1/payroll/close", response_model=dict)
async def close_payroll(
    payroll_data: dict,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Фиксация и выплата зарплаты
    
    Side-effects: Transaction(expense, category=salary)
    """
    
    payroll_id = UUID(payroll_data["payroll_id"])
    pay_date = datetime.fromisoformat(payroll_data["pay_date"]).date()
    method = payroll_data["method"]
    note = payroll_data.get("note")
    
    # Находим расчет зарплаты
    result = await db.execute(select(PayrollCalculation).where(PayrollCalculation.id == payroll_id))
    calculation = result.scalar_one_or_none()
    
    if not calculation:
        raise HTTPException(status_code=404, detail="Payroll calculation not found")
    
    if calculation.status != PayrollStatus.CALCULATED:
        raise HTTPException(status_code=400, detail="Payroll must be calculated first")
    
    # Получаем сумму к выплате
    total_amount = Decimal(str(calculation.calculation_data.get("total", 0)))
    
    # Создаем транзакцию расхода
    salary_transaction = Transaction(
        studio_id=calculation.studio_id,
        type=TransactionType.EXPENSE,
        category=TransactionCategory.SALARY,
        amount=total_amount,
        currency="USD",
        payment_method=PaymentMethod(method),
        note=f"Salary payment for calculation {payroll_id}"
    )
    
    db.add(salary_transaction)
    await db.flush()
    
    # Создаем запись выплаты
    from ..models import PayrollPayout
    payout = PayrollPayout(
        calculation_id=payroll_id,
        amount=total_amount,
        payment_method=method,
        pay_date=pay_date,
        note=note,
        transaction_id=salary_transaction.id
    )
    
    db.add(payout)
    
    # Обновляем статус расчета
    calculation.status = PayrollStatus.PAID
    calculation.paid_at = datetime.utcnow()
    
    await db.commit()
    
    return {
        "payout_id": str(payout.id),
        "calculation_id": str(payroll_id),
        "amount": float(total_amount),
        "pay_date": pay_date,
        "transaction_id": str(salary_transaction.id),
        "status": "paid"
    }


@router.get("/v1/payroll/{calculation_id}", response_model=dict)
async def get_payroll(
    calculation_id: UUID,
    db: AsyncSession = Depends(get_async_session)
):
    """Детализация расчета зарплаты по сотруднику/студии"""
    
    result = await db.execute(
        select(PayrollCalculation).where(PayrollCalculation.id == calculation_id)
    )
    calculation = result.scalar_one_or_none()
    
    if not calculation:
        raise HTTPException(status_code=404, detail="Payroll calculation not found")
    
    return {
        "id": str(calculation.id),
        "studio_id": str(calculation.studio_id) if calculation.studio_id else None,
        "employee_id": str(calculation.employee_id) if calculation.employee_id else None,
        "period_from": calculation.period_from,
        "period_to": calculation.period_to,
        "status": calculation.status,
        "calculation_data": calculation.calculation_data,
        "calculated_at": calculation.calculated_at,
        "paid_at": calculation.paid_at
    }