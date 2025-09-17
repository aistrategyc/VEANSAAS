from sqladmin import ModelView

from shared.models.company_units.org import (
    Organization,
    OrganizationInvite,
    OrganizationMember,
)
from shared.models.company_units.service import (
    AttributeOption,
    CategoryAttribute,
    Service,
    ServiceCategory,
)
from shared.models.company_units.studio import Studio, StudioInvite, StudioMember
from shared.models.user import User


class UserAdmin(ModelView, model=User):
    category = 'Users'
    category_icon = 'fa-solid fa-users'
    icon = 'fa-solid fa-user'
    name = 'User'
    name_plural = 'Users'
    column_list = ['uuid', 'username', 'email', 'is_active', 'is_verified']
    can_export = False


class OrganizationAdmin(ModelView, model=Organization):
    category = 'Organizations'
    category_icon = 'fa-solid fa-building'
    icon = 'fa-solid fa-building'
    name = 'Organization'
    name_plural = 'Organizations'
    column_list = ['uuid', 'name', 'plan_type', 'is_active']
    can_export = False


class OrganizationMemberAdmin(ModelView, model=OrganizationMember):
    category = 'Organizations'
    icon = 'fa-solid fa-users-line'
    name = 'Organization member'
    name_plural = 'Organization members'
    column_list = ['uuid', 'user_uuid', 'organization_uuid', 'roles']
    can_export = False


class StudioAdmin(ModelView, model=Studio):
    category = 'Studios'
    category_icon = 'fa-solid fa-shop'
    icon = 'fa-solid fa-shop'
    name = 'Studio'
    name_plural = 'Studios'
    column_list = ['uuid', 'name', 'is_active', 'organization_uuid']
    can_export = False


class StudioMemberAdmin(ModelView, model=StudioMember):
    category = 'Studios'
    name = 'Studio member'
    icon = 'fa-solid fa-users-line'
    name_plural = 'Studio members'
    column_list = ['uuid', 'user_uuid', 'studio_uuid', 'roles']
    can_export = False


class StudioInviteAdmin(ModelView, model=StudioInvite):
    category = 'Studios'
    name = 'Studio invite'
    icon = 'fa-solid fa-message'
    name_plural = 'Studio invites'
    column_list = ['uuid', 'email', 'is_used', 'studio_uuid', 'roles']
    can_export = False


class OrganizationInviteAdmin(ModelView, model=OrganizationInvite):
    category = 'Organizations'
    name = 'Organization invite'
    icon = 'fa-solid fa-message'
    name_plural = 'Organization invites'
    column_list = ['uuid', 'email', 'is_used', 'organization_uuid', 'roles']
    can_export = False


class AttributeOptionAdmin(ModelView, model=AttributeOption):
    category = 'Services'
    category_icon = 'fa-solid fa-calendar'
    name = 'Attribute option'
    name_plural = 'Attribute options'
    column_list = [
        'uuid',
        'organization_uuid',
        'attribute_uuid',
        'value',
    ]
    can_export = False


class CategoryAttributeAdmin(ModelView, model=CategoryAttribute):
    category = 'Services'
    name = 'Category attribute'
    name_plural = 'Category attributes'
    column_list = ['uuid', 'organization_uuid', 'category_uuid', 'name', 'type']
    can_export = False


class ServiceAdmin(ModelView, model=Service):
    category = 'Services'
    name = 'Service'
    name_plural = 'Services'
    column_list = [
        'uuid',
        'organization_uuid',
        'category_uuid',
        'name',
        'base_price',
        'is_active',
    ]
    can_export = False


class ServiceCategoryAdmin(ModelView, model=ServiceCategory):
    category = 'Services'
    name = 'Service category'
    name_plural = 'Service categories'
    column_list = [
        'uuid',
        'organization_uuid',
        'name',
        'is_active',
    ]
    can_export = False
