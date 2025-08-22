# apps/api/liderix_api/schemas/membership.py
from __future__ import annotations

from pydantic import BaseModel, Field, ConfigDict, field_validator, EmailStr
from typing import Optional, List, Literal, Generic, TypeVar, Dict
from uuid import UUID
from datetime import datetime

# --------------------------------------
# Enums (синхронны с БД ENUM)
# --------------------------------------

Role = Literal["owner", "admin", "manager", "member", "guest"]
Status = Literal["active", "invited", "suspended"]

# Что можно отдавать через ?fields=...
MEMBERSHIP_READ_FIELDS_WHITELIST = {
    "id", "org_id", "user_id", "role", "department_id", "title",
    "status", "created_at", "updated_at", "deleted_at",
    # expand-поля:
    "user", "department",
}

# --------------------------------------
# Mini DTOs для expand
# --------------------------------------

class UserMini(BaseModel):
    id: UUID
    username: Optional[str] = None
    email: Optional[str] = None

    model_config = ConfigDict(extra="forbid")


class DepartmentMini(BaseModel):
    id: UUID
    name: str

    model_config = ConfigDict(extra="forbid")


# --------------------------------------
# Base DTOs
# --------------------------------------

class MembershipBase(BaseModel):
    user_id: UUID
    role: Optional[Role] = "member"
    department_id: Optional[UUID] = None
    title: Optional[str] = Field(default=None, max_length=120)

    @field_validator("title")
    @classmethod
    def _title_strip(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if isinstance(v, str) else v

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class MembershipCreate(MembershipBase):
    """Создание/реактивация membership."""
    pass


class MembershipUpdate(BaseModel):
    role: Optional[Role] = None
    department_id: Optional[UUID] = None
    title: Optional[str] = Field(default=None, max_length=120)
    status: Optional[Status] = None

    @field_validator("title")
    @classmethod
    def _title_strip(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if isinstance(v, str) else v

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class MembershipRead(MembershipBase):
    id: UUID
    org_id: UUID
    status: Status = "active"
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

    # expand-поля (возвращаются только при ?expand=user,department)
    user: Optional[UserMini] = None
    department: Optional[DepartmentMini] = None

    model_config = ConfigDict(from_attributes=True, extra="forbid")


# --------------------------------------
# List envelope / queries
# --------------------------------------

T = TypeVar("T")


class MembershipListResponse(BaseModel, Generic[T]):
    items: List[MembershipRead]
    page: int
    page_size: int
    total: int

    model_config = ConfigDict(from_attributes=True, extra="forbid")


class MembershipListQuery(BaseModel):
    """Опционально: если хочешь прокидывать в Depends() в list-роуте."""
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=200)
    role: Optional[Role] = None
    status: Optional[Status] = None
    user_id: Optional[UUID] = None
    fields: Optional[List[str]] = Field(
        default=None,
        description="Limit returned fields; whitelist enforced."
    )
    expand: Optional[List[Literal["user", "department"]]] = None

    @field_validator("fields")
    @classmethod
    def _validate_fields(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        if not v:
            return v
        bad = [f for f in v if f not in MEMBERSHIP_READ_FIELDS_WHITELIST]
        if bad:
            raise ValueError(f"Unsupported fields: {', '.join(bad)}")
        return v

    model_config = ConfigDict(extra="forbid")


# --------------------------------------
# Дополнительные DTO для новых роутов
# --------------------------------------

class MembershipInviteRequest(BaseModel):
    """Опционально, если используем отдельный инвайт-эндпоинт."""
    email: EmailStr
    role: Role = "member"
    department_id: Optional[UUID] = None
    title: Optional[str] = Field(default=None, max_length=120)

    @field_validator("title")
    @classmethod
    def _title_strip(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if isinstance(v, str) else v

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class MembershipBulkCreateItem(BaseModel):
    """Элемент для пакетного создания (идентичен MembershipCreate, но без наследования для явности)."""
    user_id: UUID
    role: Optional[Role] = "member"
    department_id: Optional[UUID] = None
    title: Optional[str] = Field(default=None, max_length=120)

    @field_validator("title")
    @classmethod
    def _title_strip(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if isinstance(v, str) else v

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class MembershipBulkCreateRequest(BaseModel):
    memberships: List[MembershipBulkCreateItem] = Field(..., min_items=1, max_items=100)

    model_config = ConfigDict(extra="forbid")


class MembershipBulkInviteItem(BaseModel):
    """Элемент для пакетного приглашения по email."""
    email: EmailStr
    role: Optional[Role] = "member"
    department_id: Optional[UUID] = None
    title: Optional[str] = Field(default=None, max_length=120)

    @field_validator("title")
    @classmethod
    def _title_strip(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if isinstance(v, str) else v


class MembershipBulkInviteRequest(BaseModel):
    memberships: List[MembershipBulkInviteItem] = Field(..., min_items=1, max_items=100)

    model_config = ConfigDict(extra="forbid")


class MembershipStatsResponse(BaseModel):
    total_members: int
    role_distribution: Dict[str, int] = Field(default_factory=dict)
    status_distribution: Dict[str, int] = Field(default_factory=dict)
    department_distribution: Dict[str, int] = Field(default_factory=dict)
    recent_joins_30d: int

    model_config = ConfigDict(extra="forbid")


__all__ = [
    "Role",
    "Status",
    "UserMini",
    "DepartmentMini",
    "MembershipBase",
    "MembershipCreate",
    "MembershipUpdate",
    "MembershipRead",
    "MembershipListResponse",
    "MembershipListQuery",
    "MembershipInviteRequest",
    "MembershipBulkCreateItem",
    "MembershipBulkInviteItem",
    "MembershipBulkInviteRequest",
    "MembershipBulkCreateRequest",
    "MembershipStatsResponse",
]