import aiohttp
from fastapi import HTTPException

from shared.logger import logger
from shared.security import create_service_access_token


class BaseServiceClient:
    def __init__(self, service_url: str):
        self.service_url = service_url

    async def _make_request(
        self,
        method: str,
        endpoint: str,
        payload: dict | None = None,
        params: dict | None = None,
    ) -> dict:
        token = await create_service_access_token()
        url = f'{self.service_url}/{endpoint}'
        logger.warning(url)
        async with aiohttp.ClientSession() as session:
            try:
                async with session.request(
                    method=method,
                    url=url,
                    json=payload,
                    params=params,
                    headers={'Authorization': f'Bearer {token}'},
                    timeout=aiohttp.ClientTimeout(total=60),
                ) as response:
                    if not response.ok:
                        try:
                            error_data = await response.json()

                            detail = (
                                error_data.get('error', {}).get('message')
                                or error_data.get('detail')
                                or error_data.get('message')
                                or error_data
                            )
                            logger.error(f'API error (JSON): {detail}')
                            raise HTTPException(
                                status_code=response.status,
                                detail=detail,
                            )
                        except ValueError:
                            detail = await response.text()
                            logger.error(f'API error (text): {detail}')
                            raise HTTPException(
                                status_code=response.status,
                                detail=f'Service error: {detail}',
                            )
                    if response.content_length is None or response.content_length == 0:
                        return {}

                    return await response.json()

            except aiohttp.ClientError as e:
                raise HTTPException(
                    status_code=503,
                    detail=f'Service unavailable: {str(e)}',
                )
