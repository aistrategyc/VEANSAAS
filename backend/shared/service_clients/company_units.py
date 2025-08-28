from shared.schemas.company_units.org import (
    OrganizationCreateRequest,
    OrganizationResponse,
)
from shared.service_clients.base import BaseServiceClient


class CompanyUnitsServiceClient(BaseServiceClient):
    async def create_organization(
        self, request_data: OrganizationCreateRequest
    ) -> OrganizationResponse:
        data = await self._make_request(
            'POST',
            '',
            payload=request_data.model_dump(),
        )

        return OrganizationResponse(**data)
