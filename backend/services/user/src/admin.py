from models import User
from sqladmin import ModelView


class UserAdmin(ModelView, model=User):
    name = 'User'
    name_plural = 'Users'
    can_export = False
