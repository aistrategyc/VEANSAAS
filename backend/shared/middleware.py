from fastapi import Request, status
from fastapi.responses import JSONResponse

from shared.logger import logger
from shared.schemas.base import ErrorResponse


async def error_handler(request: Request, call_next) -> JSONResponse:
    try:
        return await call_next(request)
    except Exception as e:
        error_response = ErrorResponse(
            error='Internal Server Error', details=str(e)
        ).model_dump()

        logger.error(error_response)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=error_response,
        )
