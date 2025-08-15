from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from routers.org import router as router_organization

from shared.config import settings
from shared.exceptions import validation_exception_handler
from shared.middleware import error_handler

app = FastAPI(
    title='Organization/Studio',
    version='0.0.1',
    docs_url='/docs' if settings.DEBUG else None,
    redoc_url='/redoc' if settings.DEBUG else None,
)


if not settings.DEBUG:
    app.middleware('http')(error_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)


app.include_router(router=router_organization, prefix='/api/v1')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
