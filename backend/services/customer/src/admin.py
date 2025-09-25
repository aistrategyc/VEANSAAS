from models import Customer
from sqladmin import ModelView


class CustomerAdmin(ModelView, model=Customer):
    pass
