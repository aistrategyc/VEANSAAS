from __future__ import annotations
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List, Generic, TypeVar, Literal, Dict
from uuid import UUID
from datetime import datetime
# -------------------------------------------------
# Полезные мини-DTO для expand
# -------------------------------------------------
class UserMini(BaseModel):
    id: UUID
    username: Optional[str] = None
    email: Optional[str] = None
    model_config = ConfigDict(extra="forbid")
class DepartmentMini(BaseModel):
    id: UUID
    name: str
    model_config = ConfigDict(extra="forbid")
# -------------------------------------------------
# Whitelist полей для ?fields= и expand
# -------------------------------------------------
DEPARTMENT_READ_FIELDS_WHITELIST = {
    "id", "org_id", "name", "description", "parent_id", "manager_id",
    "created_at", "updated_at", "deleted_at",
    # expand-поля:
    "parent", "manager", "stats", "path",
}
# Что разрешено в expand
DepartmentExpand = Literal["parent", "manager", "stats", "path"]
# -------------------------------------------------
# Базовые DTO
# -------------------------------------------------
class DepartmentBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: Optional[str] = None
    parent_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None
    @field_validator("name")
    @classmethod
    def _strip_name(cls, v: str) -> str:
        return v.strip()
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
class DepartmentCreate(DepartmentBase):
    pass
class DepartmentUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    description: Optional[str] = None
    parent_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None
    @field_validator("name")
    @classmethod
    def _strip_name_opt(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if isinstance(v, str) else v
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
# -------------------------------------------------
# Расширенные/агрегированные DTO
# -------------------------------------------------
class DepartmentStats(BaseModel):
    children_count: int = 0
    members_count: int = 0
    last_activity_at: Optional[datetime] = None
    model_config = ConfigDict(extra="forbid")
class DepartmentPathItem(BaseModel):
    id: UUID
    name: str
    model_config = ConfigDict(extra="forbid")
class DepartmentRead(DepartmentBase):
    id: UUID
    org_id: UUID
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None
    # expand-поля — возвращаются только если явно запрошены
    parent: Optional[DepartmentMini] = None
    manager: Optional[UserMini] = None
    stats: Optional[DepartmentStats] = None
    path: Optional[List[DepartmentPathItem]] = None # от корня до текущего
    model_config = ConfigDict(from_attributes=True, extra="forbid")
# -------------------------------------------------
# List envelope / queries
# -------------------------------------------------
T = TypeVar("T")
class DepartmentListResponse(BaseModel, Generic[T]):
    items: List[DepartmentRead]
    page: int
    page_size: int
    total: int
    next_token: Optional[str] = None
    model_config = ConfigDict(from_attributes=True, extra="forbid")
class DepartmentListQuery(BaseModel):
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=200)
    sort: Optional[str] = Field(
        default="-created_at",
        description="Comma-separated fields with :asc|:desc, e.g. 'name:asc,-created_at'",
    )
    q: Optional[str] = Field(
        default=None, max_length=200,
        description="Substring search over name (ILIKE)"
    )
    parent_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None
    include_deleted: bool = False
    fields: Optional[List[str]] = Field(
        default=None,
        description="Limit returned fields. Enforced by whitelist.",
    )
    expand: Optional[List[DepartmentExpand]] = Field(
        default=None,
        description="Expand related info: parent, manager, stats, path",
    )
    cursor: Optional[str] = Field(
        default=None,
        description="If provided, use cursor pagination; ignore page/page_size.",
    )
    @field_validator("sort")
    @classmethod
    def _validate_sort(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return v
        allowed = {"name", "created_at", "updated_at"}
        for p in [p.strip() for p in v.split(",") if p.strip()]:
            field = p.replace(":asc", "").replace(":desc", "").lstrip("+-")
            if field not in allowed:
                raise ValueError(f"Unsupported sort field: {field}")
        return v
    @field_validator("fields")
    @classmethod
    def _validate_fields(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        if not v:
            return v
        bad = [f for f in v if f not in DEPARTMENT_READ_FIELDS_WHITELIST]
        if bad:
            raise ValueError(f"Unsupported fields: {', '.join(bad)}")
        return v
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
# -------------------------------------------------
# Импорт/Экспорт
# -------------------------------------------------
class DepartmentExportRequest(BaseModel):
    format: Literal["csv", "parquet"] = "csv"
    filters: Optional[DepartmentListQuery] = None
    model_config = ConfigDict(extra="forbid")
class DepartmentImportItem(BaseModel):
    # Минимально достаточные поля для импорта
    name: str = Field(min_length=1, max_length=120)
    description: Optional[str] = None
    parent_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None
    extra: Optional[Dict[str, str]] = None # для совместимости, если нужно
    @field_validator("name")
    @classmethod
    def _strip_name(cls, v: str) -> str:
        return v.strip()
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
class DepartmentImportRequest(BaseModel):
    items: List[DepartmentImportItem]
    mode: Literal["all_or_nothing", "partial"] = "partial"
    model_config = ConfigDict(extra="forbid")
# -------------------------------------------------
# Bulk-операции
# -------------------------------------------------
class ProblemDetails(BaseModel):
    type: Optional[str] = "about:blank"
    title: str
    status: int
    detail: Optional[str] = None
    instance: Optional[str] = None
    model_config = ConfigDict(extra="forbid")
class DeptBulkCreateItem(DepartmentCreate):
    pass
class DeptBulkUpdateItem(DepartmentUpdate):
    id: UUID
class DeptBulkDeleteItem(BaseModel):
    id: UUID
    model_config = ConfigDict(extra="forbid")
class DepartmentBulkRequest(BaseModel):
    mode: Literal["all_or_nothing", "partial"] = "partial"
    create: Optional[List[DeptBulkCreateItem]] = None
    update: Optional[List[DeptBulkUpdateItem]] = None
    delete: Optional[List[DeptBulkDeleteItem]] = None
    client_trace_id: Optional[str] = Field(
        default=None, description="Idempotency/debug trace from client"
    )
    model_config = ConfigDict(extra="forbid")
class BulkFailedItem(BaseModel):
    op: Literal["create", "update", "delete"]
    id: Optional[UUID] = None
    index: Optional[int] = None
    problem: ProblemDetails
    model_config = ConfigDict(extra="forbid")
class DepartmentBulkResponse(BaseModel):
    succeeded: List[UUID] = []
    failed: List[BulkFailedItem] = []
    model_config = ConfigDict(extra="forbid")
# -------------------------------------------------
# DepartmentTreeResponse (Добавлено)
# -------------------------------------------------
class DepartmentTreeResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    manager_id: Optional[UUID] = None
    member_count: int
    child_department_count: int
    children: List['DepartmentTreeResponse'] = Field(default_factory=list)
    depth: int
    model_config = ConfigDict(from_attributes=True, extra="forbid")
# -------------------------------------------------
# DepartmentStatsResponse (Добавлено)
# -------------------------------------------------
class DepartmentStatsResponse(BaseModel):
    department_id: UUID
    department_name: str
    member_count: int
    child_department_count: int
    role_distribution: Dict[str, int]  # {role: count}
    child_departments: Optional[List[Dict]] = None  # List of dicts for child stats
    model_config = ConfigDict(from_attributes=True, extra="forbid")