import enum


class StudioRole(str, enum.Enum):
    STUDIO_OWNER = 'studio_owner'
    MANAGER = 'studio_manager'
    MASTER = 'master'
    ADMINISTRATOR = 'administrator'


class OrganizationRole(str, enum.Enum):
    OWNER = 'owner'


class OrganizationPlanType(str, enum.Enum):
    SOLO = 'solo'
    NETWORK = 'network'


class AttributeType(str, enum.Enum):
    TEXT = 'text'
    NUMBER = 'number'
    SELECT = 'select'
    CHECKBOX = 'checkbox'
    TEXTAREA = 'textarea'
