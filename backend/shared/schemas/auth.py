from pydantic import BaseModel, Field


class UserAuth(BaseModel):
    username: str = Field(max_length=50)
    password: str
