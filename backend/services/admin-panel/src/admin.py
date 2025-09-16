from sqladmin import ModelView

from shared.models.company_units.org import (
    Organization,
    OrganizationInvite,
    OrganizationMember,
)
from shared.models.company_units.studio import Studio, StudioInvite, StudioMember
from shared.models.user import User


class UserAdmin(ModelView, model=User):
    name = 'User'
    name_plural = 'Users'
    can_export = False


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


class StudioInviteAdmin(ModelView, model=StudioInvite):
    name = 'Studio invite'
    name_plural = 'Studio invites'
    can_export = False


class OrganizationInviteAdmin(ModelView, model=OrganizationInvite):
    name = 'Organization invite'
    name_plural = 'Organization invites'
    can_export = False
