from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request, status
from services.appointment import (
    change_status,
    create_appointment,
    get_appointment,
    list_appointments,
)
from sqlalchemy.ext.asyncio import AsyncSession

from shared.database import get_db
from shared.dependencies import AuthContext, get_auth_context
from shared.schemas.company_units.appointment import (
    AppointmentCreate,
    AppointmentListResponse,
    AppointmentResponse,
    AppointmentStatusCreate,
    AppointmentStatusResponse,
)

router = APIRouter(prefix='/appointments', tags=['Appointments'])


@router.get(
    '/{uuid}',
    response_model=AppointmentResponse,
    status_code=status.HTTP_200_OK,
)
async def get_appointment_route(
    request: Request,
    uuid: UUID,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await get_appointment(request=request, uuid=uuid, db=db, auth=auth)


@router.get('', response_model=AppointmentListResponse, status_code=status.HTTP_200_OK)
async def list_appointments_route(
    request: Request,
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await list_appointments(
        request=request, offset=offset, limit=limit, db=db, auth=auth
    )


@router.post(
    '', response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED
)
async def create_appointment_route(
    request: Request,
    data: AppointmentCreate,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await create_appointment(request=request, data=data, db=db, auth=auth)


@router.post(
    '/{uuid}/status',
    response_model=AppointmentStatusResponse,
    status_code=status.HTTP_200_OK,
)
async def change_status_route(
    request: Request,
    uuid: UUID,
    data: AppointmentStatusCreate,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await change_status(request=request, uuid=uuid, data=data, db=db, auth=auth)
