"""
Clients & Leads endpoints для VEANCRM согласно ТЗ
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from uuid import UUID
from datetime import date

from ..models import Client, Lead, LeadStatus
from ..schemas.crm_schemas import (
    ClientCreate, ClientResponse, LeadCreate,
    LeadStatus as LeadStatusEnum
)
from ..db import get_async_session


router = APIRouter(prefix="/v1/clients", tags=["Clients"])


@router.post("", response_model=ClientResponse)
async def create_client(
    client_data: ClientCreate,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Создание клиента
    
    Dedup: по телефону/email; merge-логика (опционально force=true)
    """
    
    # Проверяем дубликаты по телефону
    result = await db.execute(select(Client).where(Client.phone == client_data.phone))
    existing_client = result.scalar_one_or_none()
    
    if existing_client:
        # В реальности здесь должна быть merge-логика
        raise HTTPException(
            status_code=409, 
            detail=f"Client with phone {client_data.phone} already exists"
        )
    
    # Проверяем дубликаты по email (если указан)
    if client_data.email:
        result = await db.execute(select(Client).where(Client.email == client_data.email))
        existing_client = result.scalar_one_or_none()
        
        if existing_client:
            raise HTTPException(
                status_code=409, 
                detail=f"Client with email {client_data.email} already exists"
            )
    
    # Создаем клиента
    client = Client(
        full_name=client_data.full_name,
        phone=client_data.phone,
        email=client_data.email,
        birthday=client_data.birthday,
        gender=client_data.gender,
        tags=client_data.tags,
        notes=client_data.notes
    )
    
    db.add(client)
    await db.commit()
    await db.refresh(client)
    
    return ClientResponse(
        id=client.id,
        created_at=client.created_at,
        updated_at=client.updated_at,
        is_active=client.is_active,
        full_name=client.full_name,
        phone=client.phone,
        email=client.email,
        birthday=client.birthday,
        gender=client.gender,
        tags=client.tags,
        notes=client.notes,
        loyalty_points=client.loyalty_points,
        discount_percent=client.discount_percent
    )


@router.get("", response_model=List[ClientResponse])
async def get_clients(
    studio_id: Optional[UUID] = Query(None),
    q: Optional[str] = Query(None, description="Full-text search"),
    tag: Optional[str] = Query(None),
    birthday_from: Optional[date] = Query(None),
    birthday_to: Optional[date] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Получение списка клиентов с фильтрами
    
    Фильтры: ?studio_id=&q=&tag=&birthday_from=&birthday_to=
    """
    
    query = select(Client)
    
    # Фильтр по full-text поиску
    if q:
        query = query.where(
            Client.full_name.ilike(f"%{q}%") |
            Client.phone.ilike(f"%{q}%") |
            Client.email.ilike(f"%{q}%")
        )
    
    # Фильтр по тегам
    if tag:
        query = query.where(Client.tags.contains([tag]))
    
    # Фильтр по дню рождения
    if birthday_from:
        query = query.where(Client.birthday >= birthday_from)
    if birthday_to:
        query = query.where(Client.birthday <= birthday_to)
    
    # Пагинация
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)
    
    # Сортировка по дате создания
    query = query.order_by(Client.created_at.desc())
    
    result = await db.execute(query)
    clients = result.scalars().all()
    
    return [
        ClientResponse(
            id=client.id,
            created_at=client.created_at,
            updated_at=client.updated_at,
            is_active=client.is_active,
            full_name=client.full_name,
            phone=client.phone,
            email=client.email,
            birthday=client.birthday,
            gender=client.gender,
            tags=client.tags,
            notes=client.notes,
            loyalty_points=client.loyalty_points,
            discount_percent=client.discount_percent
        )
        for client in clients
    ]


@router.put("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: UUID,
    client_data: ClientCreate,
    db: AsyncSession = Depends(get_async_session)
):
    """Обновление профайла клиента, дисконт, лояльность"""
    
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Обновляем поля
    client.full_name = client_data.full_name
    client.phone = client_data.phone
    client.email = client_data.email
    client.birthday = client_data.birthday
    client.gender = client_data.gender
    client.tags = client_data.tags
    client.notes = client_data.notes
    
    await db.commit()
    await db.refresh(client)
    
    return ClientResponse(
        id=client.id,
        created_at=client.created_at,
        updated_at=client.updated_at,
        is_active=client.is_active,
        full_name=client.full_name,
        phone=client.phone,
        email=client.email,
        birthday=client.birthday,
        gender=client.gender,
        tags=client.tags,
        notes=client.notes,
        loyalty_points=client.loyalty_points,
        discount_percent=client.discount_percent
    )


# ===== LEADS =====

@router.post("/leads", response_model=dict)
async def create_lead(
    lead_data: LeadCreate,
    db: AsyncSession = Depends(get_async_session)
):
    """Создание лида"""
    
    lead = Lead(
        source=lead_data.source,
        utm_params=lead_data.utm_params,
        responsible_id=lead_data.responsible_id,
        client_id=lead_data.client_id,
        note=lead_data.note,
        status=LeadStatus.NEW
    )
    
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    
    return {
        "id": str(lead.id),
        "source": lead.source,
        "status": lead.status,
        "created_at": lead.created_at
    }


@router.get("/leads", response_model=List[dict])
async def get_leads(
    status: Optional[LeadStatusEnum] = Query(None),
    responsible_id: Optional[UUID] = Query(None),
    from_date: Optional[date] = Query(None, alias="from"),
    to_date: Optional[date] = Query(None, alias="to"),
    q: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_async_session)
):
    """Получение списка лидов с фильтрами"""
    
    query = select(Lead)
    
    if status:
        query = query.where(Lead.status == status)
    if responsible_id:
        query = query.where(Lead.responsible_id == responsible_id)
    if from_date:
        query = query.where(Lead.created_at >= from_date)
    if to_date:
        query = query.where(Lead.created_at <= to_date)
    
    # Пагинация
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)
    query = query.order_by(Lead.created_at.desc())
    
    result = await db.execute(query)
    leads = result.scalars().all()
    
    return [
        {
            "id": str(lead.id),
            "source": lead.source,
            "status": lead.status,
            "responsible_id": str(lead.responsible_id) if lead.responsible_id else None,
            "client_id": str(lead.client_id) if lead.client_id else None,
            "note": lead.note,
            "created_at": lead.created_at
        }
        for lead in leads
    ]


@router.put("/leads/{lead_id}/status", response_model=dict)
async def update_lead_status(
    lead_id: UUID,
    status_data: dict,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Обновление статуса лида
    
    Side-effects: при booked/won — создаётся Appointment черновик или полноценная
    """
    
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = result.scalar_one_or_none()
    
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    new_status = status_data.get("status")
    reason = status_data.get("reason")
    
    if new_status not in [status.value for status in LeadStatus]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    lead.status = LeadStatus(new_status)
    
    # Side-effects для booked/won
    if new_status in ["booked", "won"]:
        # TODO: Создание Appointment черновика
        # Здесь должна быть логика создания записи
        pass
    
    await db.commit()
    
    return {
        "id": str(lead.id),
        "status": lead.status,
        "updated_at": lead.updated_at
    }