from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from routers.invite import router as router_invite
from routers.org import router as router_organization
from routers.service import router as router_service
from routers.studio import router as router_studio

from shared.config.config import settings
from shared.exceptions import validation_exception_handler
from shared.middleware import error_handler
from shared.rabbitmq import create_lifespan

lifespan = create_lifespan(
    queue_name='company_units_service_queue',
    routing_keys=[],
    handlers={},
)


app = FastAPI(
    title='Organization/Studio',
    version='0.0.1',
    docs_url='/docs' if settings.DEBUG else None,
    redoc_url='/redoc' if settings.DEBUG else None,
    lifespan=lifespan,
)


if not settings.DEBUG:
    app.middleware('http')(error_handler)

app.add_exception_handler(RequestValidationError, validation_exception_handler)


app.include_router(router=router_organization, prefix='/api/v1')
app.include_router(router=router_studio, prefix='/api/v1')
app.include_router(router=router_invite, prefix='/api/v1')
app.include_router(router=router_service, prefix='/api/v1')


app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
