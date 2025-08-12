from sqladmin import ModelView

from shared.models.user import User


class UserAdmin(ModelView, model=User):
    name = 'User'
    name_plural = 'Users'
    can_export = False
