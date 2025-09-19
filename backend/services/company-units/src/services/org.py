from uuid import UUID

from fastapi import HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from shared.dependencies import AuthContext
from shared.models.company_units.org import (
    Organization,
    OrganizationMember,
)
from shared.models.company_units.studio import Studio, StudioMember
from shared.schemas.company_units.org import (
    OrganizationCreateRequest,
    OrganizationMemberCreateRequest,
    OrganizationPlanType,
    OrganizationResponse,
    OrganizationRole,
    OrganizationUpdateRequest,
)
from shared.schemas.company_units.studio import (
    StudioMemberCreateRequest,
    StudioResponse,
    StudioRole,
)


async def create_organization(
    request: Request, data: OrganizationCreateRequest, db: AsyncSession
):
    created_by_uuid = data.created_by_uuid

    organization_data = data.model_dump(exclude={'studio'})
    db_organization = Organization(**organization_data)
    db.add(db_organization)
    await db.flush()

    studio_data = data.studio.model_copy(
        update={
            'organization_uuid': db_organization.uuid,
            'created_by_uuid': created_by_uuid,
        }
    )
    db_studio = Studio(**studio_data.model_dump())
    db.add(db_studio)
    await db.flush()

    organization_member_data = OrganizationMemberCreateRequest(
        user_uuid=created_by_uuid,
        organization_uuid=db_organization.uuid,
        created_by_uuid=created_by_uuid,
        roles=[OrganizationRole.OWNER],
    )

    studio_member_data = StudioMemberCreateRequest(
        user_uuid=created_by_uuid,
        studio_uuid=db_studio.uuid,
        created_by_uuid=created_by_uuid,
        roles=[StudioRole.STUDIO_OWNER, StudioRole.MASTER]
        if data.plan_type == OrganizationPlanType.SOLO
        else [StudioRole.STUDIO_OWNER],
    )
    db_organization_member = OrganizationMember(**organization_member_data.model_dump())
    db_studio_member = StudioMember(**studio_member_data.model_dump())
    db.add(db_organization_member)
    db.add(db_studio_member)

    await db.commit()

    organization_response = OrganizationResponse.model_validate(db_organization)
    studio_response = StudioResponse.model_validate(db_studio)
    organization_response.studio = studio_response
    return organization_response


async def get_organization(
    request: Request, uuid: UUID, db: AsyncSession, auth: AuthContext
):
    organization_db = await db.get(Organization, uuid)

    if not organization_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Organization not found'
        )

    return organization_db


async def update_organization(
    request: Request,
    uuid: UUID,
    data: OrganizationUpdateRequest,
    db: AsyncSession,
    auth: AuthContext,
):
    organization_db = await db.get(Organization, uuid)

    if not organization_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail='Organization not found'
        )

    update_data = data.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )
    if not update_data:
        return organization_db

    for field, value in update_data.items():
        setattr(organization_db, field, value)
    await db.commit()

    return organization_db
