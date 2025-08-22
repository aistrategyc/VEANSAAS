# apps/api/liderix_api/schemas/kpi.py
from __future__ import annotations
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from enum import Enum as PythonEnum

class KPIPeriod(PythonEnum):
    day = "day"
    week = "week"
    month = "month"
    quarter = "quarter"
    year = "year"

class KPIStatus(PythonEnum):
    on_track = "on_track"
    off_track = "off_track"
    unknown = "unknown"

class KPIBase(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    target_value: float = Field(ge=0)
    current_value: Optional[float] = Field(None, ge=0)
    period: KPIPeriod = KPIPeriod.month
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None
    status: KPIStatus = KPIStatus.unknown
    tags: Optional[List[str]] = None
    owner_id: Optional[UUID] = None
    org_id: Optional[UUID] = None
    project_id: Optional[UUID] = None

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

class KPICreate(KPIBase):
    pass

class KPIUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    target_value: Optional[float] = Field(None, ge=0)
    current_value: Optional[float] = Field(None, ge=0)
    period: Optional[KPIPeriod] = None
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None
    status: Optional[KPIStatus] = None
    tags: Optional[List[str]] = None
    owner_id: Optional[UUID] = None
    org_id: Optional[UUID] = None
    project_id: Optional[UUID] = None

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

class KPIRead(KPIBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, extra="forbid")

class KPIListResponse(BaseModel):
    items: List[KPIRead]
    total: int
    page: int
    page_size: int

    model_config = ConfigDict(from_attributes=True, extra="forbid")