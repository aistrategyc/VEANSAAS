from fastapi import APIRouter, Depends, Request, status
from services.service import crete_category
from sqlalchemy.ext.asyncio import AsyncSession

from shared.database import get_db
from shared.dependencies import AuthContext, get_auth_context
from shared.schemas.company_units.service import (
    ServiceCategoryCreate,
    ServiceCategoryResponse,
)
from shared.security import requires_permission

router = APIRouter(prefix='/services', tags=['Service Categories'])


@router.post(
    '/categories',
    response_model=ServiceCategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
@requires_permission('services-categories:create', scope='orgs')
async def crete_category_route(
    request: Request,
    data: ServiceCategoryCreate,
    db: AsyncSession = Depends(get_db),
    auth: AuthContext = Depends(get_auth_context),
):
    return await crete_category(request=request, data=data, db=db, auth=auth)
