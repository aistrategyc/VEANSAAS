from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class ClientBase(BaseModel):
    name: str

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):  # ✅ для обновлений
    pass

class ClientRead(ClientBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True  # ✅ для SQLAlchemy ORM в Pydantic v2