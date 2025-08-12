from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from router import router

from shared.config import settings
from shared.exceptions import validation_exception_handler
from shared.middleware import error_handler

app = FastAPI(
    title='Auth',
    version='0.0.1',
    docs_url='/docs' if settings.DEBUG else None,
    redoc_url='/redoc' if settings.DEBUG else None,
)
if not settings.DEBUG:
    app.middleware('http')(error_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


app.include_router(router=router, prefix='/api/v1')
