import admin as admin_view
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


admin.add_view(admin_view.UserAdmin)
admin.add_view(admin_view.OrganizationAdmin)
admin.add_view(admin_view.OrganizationMemberAdmin)
admin.add_view(admin_view.StudioAdmin)
admin.add_view(admin_view.StudioMemberAdmin)
admin.add_view(admin_view.OrganizationInviteAdmin)
admin.add_view(admin_view.StudioInviteAdmin)
