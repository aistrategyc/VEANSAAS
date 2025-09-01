from pydantic import BaseModel, EmailStr


class BaseInviteCreate(BaseModel):
    email: EmailStr
