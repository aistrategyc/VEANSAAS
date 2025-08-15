from fastapi import APIRouter, Depends, Request, status
from service import create_organization
from sqlalchemy.ext.asyncio import AsyncSession

from shared.database import get_db
from shared.schemas.company_units.org import (
    OrganizationCreateRequest,
    OrganizationResponse,
)

router = APIRouter(prefix='/orgs', tags=['Orgs'])


@router.post(
    '/', response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED
)
async def create_organization_route(
    request: Request,
    data: OrganizationCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    return await create_organization(request=request, data=data, db=db)
