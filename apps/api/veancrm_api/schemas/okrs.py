# apps/api/liderix_api/schemas/okr.py
from __future__ import annotations
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from enum import Enum as PythonEnum

class OKRTimeframe(PythonEnum):
    q = "q"
    h1 = "h1"
    h2 = "h2"
    y = "y"

class OKRStatus(PythonEnum):
    draft = "draft"
    active = "active"
    done = "done"
    canceled = "canceled"

class OKRBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    timeframe: OKRTimeframe = OKRTimeframe.q
    status: OKRStatus = OKRStatus.draft
    owner_id: Optional[UUID] = None
    project_id: Optional[UUID] = None

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

class OKRCreate(OKRBase):
    pass

class OKRUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    timeframe: Optional[OKRTimeframe] = None
    status: Optional[OKRStatus] = None
    owner_id: Optional[UUID] = None
    project_id: Optional[UUID] = None

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

class OKRRead(OKRBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, extra="forbid")

class OKRListResponse(BaseModel):
    items: List[OKRRead]
    total: int
    page: int
    page_size: int

    model_config = ConfigDict(from_attributes=True, extra="forbid")