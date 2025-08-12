from sqladmin import ModelView

from shared.models.organization import Organization, OrganizationMember
from shared.models.studio import Studio, StudioMember


class OrganizationAdmin(ModelView, model=Organization):
    name = 'Organization'
    name_plural = 'Organizations'
    can_export = False


class OrganizationMemberAdmin(ModelView, model=OrganizationMember):
    name = 'Organization member'
    name_plural = 'Organization members'
    can_export = False


class StudioAdmin(ModelView, model=Studio):
    name = 'Studio'
    name_plural = 'Studios'
    can_export = False


class StudioMemberAdmin(ModelView, model=StudioMember):
    name = 'Studio member'
    name_plural = 'Studio members'
    can_export = False
