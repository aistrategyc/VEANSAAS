# apps/api/liderix_api/schemas/organization.py
from __future__ import annotations
from pydantic import BaseModel, Field, ConfigDict, field_validator, EmailStr
from typing import Optional, Dict, Any, List, Literal, Generic, TypeVar
from uuid import UUID
from datetime import datetime
import re

# --------------------------------------
# Enums / Literals (должны совпадать с БД)
# --------------------------------------
Industry = Literal["retail", "it", "marketing", "education", "other"]
CompanySize = Literal["small", "medium"]
SortDir = Literal["asc", "desc"]
OrgSortField = Literal["name", "slug", "created_at", "updated_at"]
OrgExpand = Literal["owner", "stats", "categories"]  # при наличии M2M категорий
WeekStart = Literal["monday", "sunday"]
CurrencyCode = Literal["PLN", "USD", "EUR"]  # при желании расширь
LocaleCode = Literal["pl-PL", "en-US", "ru-RU"]  # при желании расширь

# для валидации ?fields=
ORG_READ_FIELDS_WHITELIST = {
    "id", "slug", "owner_id", "name", "description", "address", "industry",
    "size", "custom_fields", "preferences", "created_at", "updated_at", "deleted_at",
    # expand-поля (если запросили expand)
    "owner", "stats", "categories",
}

# --------------------------------------
# Value Objects
# --------------------------------------
class GeoPoint(BaseModel):
    lat: float = Field(ge=-90.0, le=90.0)
    lon: float = Field(ge=-180.0, le=180.0)

    model_config = ConfigDict(extra="forbid")

class Address(BaseModel):
    line1: Optional[str] = None
    line2: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None
    country: Optional[str] = Field(
        default=None,
        description="ISO 3166-1 alpha-2, e.g. 'PL', 'US', 'DE'",
        min_length=2,
        max_length=2,
    )
    postal_code: Optional[str] = Field(default=None, max_length=32)
    geo: Optional[GeoPoint] = None

    @field_validator("country")
    @classmethod
    def _country_upper(cls, v: Optional[str]) -> Optional[str]:
        return v.upper() if v else v

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

class OrganizationPreferences(BaseModel):
    timezone: Optional[str] = Field(default="Europe/Warsaw", max_length=64)
    currency: Optional[CurrencyCode] = "PLN"
    locale: Optional[LocaleCode] = "pl-PL"
    week_start: Optional[WeekStart] = "monday"
    # место для расширения: формат дат, единицы измерения и т.п.

    model_config = ConfigDict(extra="allow")  # допускаем расширение без падений

# --------------------------------------
# Base DTOs
# --------------------------------------
class OrganizationBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    description: Optional[str] = None
    address: Optional[Address] = None
    industry: Optional[Industry] = None
    size: Optional[CompanySize] = "small"
    custom_fields: Optional[Dict[str, Any]] = None
    preferences: Optional[OrganizationPreferences] = None

    @field_validator("name")
    @classmethod
    def _strip_name(cls, v: str) -> str:
        return v.strip()

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

class OrganizationCreate(OrganizationBase):
    # Обычно slug генерится на бекенде; оставляем опционально для админ-кейсов
    slug: Optional[str] = Field(
        default=None,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
        description="Optional custom slug; lowercase letters/digits and dashes",
        max_length=80,
    )

    @field_validator("slug")
    @classmethod
    def _slug_lower(cls, v: Optional[str]) -> Optional[str]:
        return v.lower() if v else v

class OrganizationUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=150)
    description: Optional[str] = None
    address: Optional[Address] = None
    industry: Optional[Industry] = None
    size: Optional[CompanySize] = None
    custom_fields: Optional[Dict[str, Any]] = None
    preferences: Optional[OrganizationPreferences] = None
    # редкий кейс: изменить slug
    slug: Optional[str] = Field(
        default=None,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
        max_length=80,
        description="Change with care; must be unique",
    )

    @field_validator("name")
    @classmethod
    def _strip_name_opt(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if isinstance(v, str) else v

    @field_validator("slug")
    @classmethod
    def _slug_lower(cls, v: Optional[str]) -> Optional[str]:
        return v.lower() if v else v

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

class OrganizationStats(BaseModel):
    users_count: int = 0
    brands_count: int = 0
    business_units_count: int = 0
    locations_count: int = 0
    last_activity_at: Optional[datetime] = None

    model_config = ConfigDict(extra="forbid")

class OwnerMini(BaseModel):
    id: UUID
    username: Optional[str] = None
    email: Optional[str] = None

    model_config = ConfigDict(extra="forbid")

class OrganizationRead(OrganizationBase):
    id: UUID
    slug: str
    owner_id: UUID
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None
    # расширяемые поля (возвращаются при ?expand=...)
    owner: Optional[OwnerMini] = None
    stats: Optional[OrganizationStats] = None
    categories: Optional[List[str]] = None  # при наличии связи

    model_config = ConfigDict(from_attributes=True, extra="forbid")

# --------------------------------------
# List envelope / common responses
# --------------------------------------
T = TypeVar("T")

class ListResponse(BaseModel, Generic[T]):
    items: List[T]
    page: int
    page_size: int
    total: int
    next_token: Optional[str] = None

    model_config = ConfigDict(from_attributes=True, extra="forbid")

class OrganizationListResponse(ListResponse[OrganizationRead]):
    pass

# --------------------------------------
# Query DTOs (list)
# --------------------------------------
class OrganizationListQuery(BaseModel):
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=200)
    sort: Optional[str] = Field(
        default="-created_at",
        description="Comma-separated fields with :asc|:desc, e.g. 'name:asc,-created_at'",
    )
    q: Optional[str] = Field(
        default=None,
        description="Full-text search over `name`/`slug` (если реализовано)",
        max_length=200,
    )
    industry: Optional[Industry] = None
    size: Optional[CompanySize] = None
    created_from: Optional[datetime] = None
    created_to: Optional[datetime] = None
    include_deleted: bool = False
    fields: Optional[List[str]] = Field(
        default=None,
        description="Limit returned fields. Whitelist enforced in router.",
    )
    expand: Optional[List[OrgExpand]] = Field(
        default=None,
        description="Expand related info, e.g. owner, stats, categories",
    )
    cursor: Optional[str] = Field(
        default=None,
        description="Use cursor pagination if provided; `page` is ignored.",
    )

    @field_validator("sort")
    @classmethod
    def _validate_sort(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return v
        allowed = {"name", "slug", "created_at", "updated_at"}
        parts = [p.strip() for p in v.split(",") if p.strip()]
        for p in parts:
            field = p.replace(":asc", "").replace(":desc", "").lstrip("+-")
            if field not in allowed:
                raise ValueError(f"Unsupported sort field: {field}")
        return v

    @field_validator("fields")
    @classmethod
    def _validate_fields(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        if not v:
            return v
        bad = [f for f in v if f not in ORG_READ_FIELDS_WHITELIST]
        if bad:
            raise ValueError(f"Unsupported fields: {', '.join(bad)}")
        return v

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

# --------------------------------------
# Extra DTOs
# --------------------------------------
class SlugPreviewRequest(BaseModel):
    name: str = Field(min_length=1, max_length=150)

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

class SlugPreviewResponse(BaseModel):
    slug: str
    is_available: bool

    model_config = ConfigDict(extra="forbid")

class OrganizationExportRequest(BaseModel):
    format: Literal["csv", "parquet"] = "csv"
    filters: Optional[OrganizationListQuery] = None

    model_config = ConfigDict(extra="forbid")

class OrganizationImportItem(BaseModel):
    # минимальный набор полей для импорта
    name: str
    slug: Optional[str] = Field(default=None, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    description: Optional[str] = None
    address: Optional[Address] = None
    industry: Optional[Industry] = None
    size: Optional[CompanySize] = None
    custom_fields: Optional[Dict[str, Any]] = None
    preferences: Optional[OrganizationPreferences] = None

    @field_validator("slug")
    @classmethod
    def _slug_lower(cls, v: Optional[str]) -> Optional[str]:
        return v.lower() if v else v

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

class OrganizationImportRequest(BaseModel):
    items: List[OrganizationImportItem]
    mode: Literal["all_or_nothing", "partial"] = "partial"

    model_config = ConfigDict(extra="forbid")

class ProblemDetails(BaseModel):
    type: Optional[str] = "about:blank"
    title: str
    status: int
    detail: Optional[str] = None
    instance: Optional[str] = None

    model_config = ConfigDict(extra="forbid")

# --------------------------------------
# Bulk operations
# --------------------------------------
class OrgBulkCreateItem(OrganizationCreate):
    pass

class OrgBulkUpdateItem(OrganizationUpdate):
    id: UUID

class OrgBulkDeleteItem(BaseModel):
    id: UUID

    model_config = ConfigDict(extra="forbid")

class OrganizationBulkRequest(BaseModel):
    mode: Literal["all_or_nothing", "partial"] = "partial"
    create: Optional[List[OrgBulkCreateItem]] = None
    update: Optional[List[OrgBulkUpdateItem]] = None
    delete: Optional[List[OrgBulkDeleteItem]] = None
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

class OrganizationBulkResponse(BaseModel):
    succeeded: List[UUID] = []
    failed: List[BulkFailedItem] = []

    model_config = ConfigDict(extra="forbid")

# --------------------------------------
# Search (если делаешь полнотекст)
# --------------------------------------
class SearchHighlight(BaseModel):
    field: str
    snippet: str

    model_config = ConfigDict(extra="forbid")

class OrganizationSearchResult(BaseModel):
    entity_type: Literal["organization"] = "organization"
    entity_id: UUID
    score: float
    highlights: List[SearchHighlight] = []
    data: OrganizationRead

    model_config = ConfigDict(extra="forbid")


# --------------------------------------
# Onboarding Schemas
# --------------------------------------
class OnboardingDepartment(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    description: Optional[str] = Field(default=None, max_length=500)

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class OnboardingInvite(BaseModel):
    email: EmailStr
    role: Optional[str] = "member"
    department_id: Optional[UUID] = None

    model_config = ConfigDict(extra="forbid")


class OrganizationOnboardingRequest(BaseModel):
    """Complete onboarding request with organization, departments, and invites."""
    # Organization data
    organization: OrganizationCreate
    
    # Optional initial departments
    departments: Optional[List[OnboardingDepartment]] = Field(default_factory=list)
    
    # Optional initial invites
    invites: Optional[List[OnboardingInvite]] = Field(default_factory=list)

    model_config = ConfigDict(extra="forbid")


class OrganizationOnboardingResponse(BaseModel):
    """Response for complete onboarding."""
    organization: OrganizationRead
    departments_created: List[Dict[str, Any]] = Field(default_factory=list)
    invites_sent: List[Dict[str, Any]] = Field(default_factory=list)
    errors: List[Dict[str, Any]] = Field(default_factory=list)

    model_config = ConfigDict(extra="forbid")