from admin import (
    OrganizationAdmin,
    OrganizationMemberAdmin,
    StudioAdmin,
    StudioMemberAdmin,
    UserAdmin,
)
from fastapi import FastAPI
from sqladmin import Admin

from shared.config import settings
from shared.database import engine

app = FastAPI(
    title='Admin panel',
    version='0.0.1',
    docs_url='/docs' if settings.DEBUG else None,
    redoc_url='/redoc' if settings.DEBUG else None,
)

admin = Admin(
    app=app,
    engine=engine,
)


admin.add_view(UserAdmin)
admin.add_view(OrganizationAdmin)
admin.add_view(OrganizationMemberAdmin)
admin.add_view(StudioAdmin)
admin.add_view(StudioMemberAdmin)
