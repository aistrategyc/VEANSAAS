from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from shared.dependencies import AuthContext
from shared.models.company_units.org import Organization, OrganizationMember
from shared.models.company_units.studio import Studio, StudioMember
from shared.schemas.company_units.org import (
    OrganizationCreateRequest,
    OrganizationMemberCreateRequest,
    OrganizationPlanType,
    OrganizationResponse,
    OrganizationRole,
)
from shared.schemas.company_units.studio import (
    StudioInviteCreate,
    StudioMemberCreateRequest,
    StudioResponse,
    StudioRole,
)


async def create_organization(
    request: Request, data: OrganizationCreateRequest, db: AsyncSession
):
    async with db.begin():
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
            roles=[StudioRole.STUDIO_OWNER]
            if data.plan_type == OrganizationPlanType.SOLO
            else [StudioRole.MASTER, StudioRole.STUDIO_OWNER],
        )
        db_organization_member = OrganizationMember(
            **organization_member_data.model_dump()
        )
        db_studio_member = StudioMember(**studio_member_data.model_dump())
        db.add(db_organization_member)
        db.add(db_studio_member)

        await db.commit()

        organization_response = OrganizationResponse.model_validate(db_organization)
        studio_response = StudioResponse.model_validate(db_studio)
        organization_response.studio = studio_response
        return organization_response


async def create_studio_invite(
    request: Request,
    studio_uuid: str,
    data: StudioInviteCreate,
    db: AsyncSession,
    auth: AuthContext,
):
    print(auth.user, 'auth')
    print(data, 'data')
    print(studio_uuid, 'studio_uuid')
