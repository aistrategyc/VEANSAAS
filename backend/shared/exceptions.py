from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from shared.logger import logger
from shared.schemas.base import ErrorResponse


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    errors = exc.errors()

    error_details = []
    for error in errors:
        error_details.append(
            {'field': error['loc'][-1], 'message': error['msg'], 'type': error['type']}
        )
    error_response = ErrorResponse(
        error='Validation Error', details=error_details
    ).model_dump()
    logger.error(error_response)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=error_response,
    )
