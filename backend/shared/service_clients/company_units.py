from uuid import UUID

from shared.schemas.company_units.common import (
    BaseInviteMemberCreateRequest,
    BaseInviteValidateResponse,
)
from shared.schemas.company_units.org import (
    OrganizationCreateRequest,
    OrganizationResponse,
)
from shared.service_clients.base import BaseServiceClient


class CompanyUnitsOrganizationServiceClient(BaseServiceClient):
    async def create_organization(
        self, request_data: OrganizationCreateRequest
    ) -> OrganizationResponse:
        data = await self._make_request(
            'POST',
            '',
            payload=request_data.model_dump(),
        )

        return OrganizationResponse(**data)


class CompanyUnitsInviteServiceClient(BaseServiceClient):
    async def validate(self, invite_token: str) -> BaseInviteValidateResponse:
        data = await self._make_request(
            method='GET',
            endpoint=f'{invite_token}/validate',
        )

        return BaseInviteValidateResponse(**data)

    async def create_members(
        self, uuid: str | UUID, request_data: BaseInviteMemberCreateRequest
    ):
        await self._make_request(
            method='POST',
            endpoint=f'{uuid}/members',
            payload=request_data.model_dump(),
        )
