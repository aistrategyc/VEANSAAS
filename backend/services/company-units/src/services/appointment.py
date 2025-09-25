from uuid import UUID

from fastapi import HTTPException, Request, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from shared.dependencies import AuthContext
from shared.enums.appointment import AppointmentStatusEnum
from shared.models.company_units.appointment import Appointment
from shared.schemas.company_units.appointment import (
    AppointmentCreate,
    AppointmentListResponse,
    AppointmentResponse,
    AppointmentStatusCreate,
)
from shared.schemas.mixins import PaginationResponse


async def list_appointments(
    request: Request, offset: int, limit: int, db: AsyncSession, auth: AuthContext
):
    query = select(
        Appointment,
    ).filter(Appointment.studio_uuid == auth.studio_uuid)

    count_query = (
        select(func.count())
        .where(Appointment.studio_uuid == auth.studio_uuid)
        .select_from(Appointment)
    )

    query_result = await db.execute(query.offset(offset).limit(limit))

    db_appointments = query_result.scalars().all()

    total_count = await db.scalar(count_query) or 0

    return AppointmentListResponse(
        items=[
            AppointmentResponse.model_validate(appointment)
            for appointment in db_appointments
        ],
        pagination=PaginationResponse(
            count=total_count,
            offset=offset,
            limit=limit,
            has_more=(offset + limit) < total_count,
        ),
    )


async def create_appointment(
    request: Request, data: AppointmentCreate, db: AsyncSession, auth: AuthContext
):
    appointment_data = data.model_dump()

    db_appointment = Appointment(
        **appointment_data, studio_uuid=auth.studio_uuid, created_by_uuid=auth.user.uuid
    )

    db.add(db_appointment)
    await db.flush()
    db_status = await db_appointment.create_status(
        created_by_uuid=auth.user.uuid,
        data=AppointmentStatusCreate(status=AppointmentStatusEnum.CONFIRMED),
    )
    db.add(db_status)

    await db.commit()
    return db_appointment


async def change_status(
    request: Request,
    uuid: UUID,
    data: AppointmentStatusCreate,
    db: AsyncSession,
    auth: AuthContext,
):
    print(auth.studio_uuid, 'auth.studio_uuid')
    result = await db.execute(
        select(Appointment).where(
            Appointment.uuid == uuid, Appointment.studio_uuid == auth.studio_uuid
        )
    )

    db_appointment = result.scalar_one_or_none()

    if not db_appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Appointment not found'
        )

    db_status = await db_appointment.create_status(
        data=data,
        created_by_uuid=auth.user.uuid,
    )
    db.add(db_status)
    await db.commit()

    return db_status
