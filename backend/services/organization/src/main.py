from admin import (
    OrganizationAdmin,
    OrganizationMemberAdmin,
    StudioAdmin,
    StudioMemberAdmin,
)
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from router.organization import router as router_organization
from sqladmin import Admin

from shared.config import settings
from shared.database import engine
from shared.exceptions import validation_exception_handler
from shared.middleware import error_handler

app = FastAPI(
    title='Organization/Studio',
    version='0.0.1',
    docs_url='/docs' if settings.DEBUG else None,
    redoc_url='/redoc' if settings.DEBUG else None,
)


app.middleware('http')(error_handler)
app.include_router(router=router_organization, prefix='/api/v1')
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


admin = Admin(
    app=app,
    engine=engine,
)


admin.add_view(OrganizationAdmin)
admin.add_view(OrganizationMemberAdmin)
admin.add_view(StudioAdmin)
admin.add_view(StudioMemberAdmin)
