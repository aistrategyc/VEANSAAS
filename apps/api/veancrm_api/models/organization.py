from __future__ import annotations
import re
from uuid import uuid4
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Text,
    Enum,
    ForeignKey,
    DateTime,
    Integer,
    Boolean,
    Float,
    UniqueConstraint,
    Index,
    CheckConstraint)
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import relationship
from liderix_api.db import Base

# =========================
# Mixins
# =========================
class TimestampMixin:
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

class SoftDeleteMixin:
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class OrgFKMixin:
    org_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        nullable=False,
        index=True)

# =========================
# Core: Organization
# =========================
class Organization(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "organizations"
    
    # ✅ Основные колонки ПЕРЕД __table_args__
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    owner_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    name = Column(String(150), nullable=False, index=True)
    slug = Column(String(80), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    address = Column(JSONB, nullable=True)
    industry = Column(Enum("retail", "it", "marketing", "education", "other", name="industry_type"), nullable=True)
    size = Column(Enum("small", "medium", name="company_size"), default="small", nullable=True)
    custom_fields = Column(JSONB, nullable=True)
    preferences = Column(JSONB, nullable=True)
    
    # ✅ Relationships
    owner = relationship("User", lazy="selectin", overlaps="organizations")
    brands = relationship("Brand", lazy="selectin", overlaps="organization")
    business_units = relationship("BusinessUnit", lazy="selectin", overlaps="organization")
    locations = relationship("Location", lazy="selectin", overlaps="organization")
    departments = relationship("Department", lazy="selectin", overlaps="organization")
    projects = relationship("Project", lazy="selectin", overlaps="organization")
    data_sources = relationship("DataSource", lazy="selectin", overlaps="organization")
    subscriptions = relationship("Subscription", lazy="selectin", overlaps="organization")
    notification_settings = relationship("OrgNotificationSetting", lazy="selectin", overlaps="organization")
    metric_definitions = relationship("MetricDefinition", lazy="selectin", overlaps="organization")
    compliances = relationship("OrgCompliance", lazy="selectin", overlaps="organization")
    event_logs = relationship("EventLog", cascade="all, delete-orphan", lazy="selectin", overlaps="organization")
    change_logs = relationship("ChangeLog", cascade="all, delete-orphan", lazy="selectin", overlaps="organization")
    jwt_refresh_whitelists = relationship(
        "JWTRefreshWhitelist",
        cascade="all, delete-orphan",
        lazy="selectin",
        overlaps="organization",
    )
    kpis = relationship(
        "KPI",
        cascade="all, delete-orphan",
        lazy="selectin",
        overlaps="organization",
    )
    objectives = relationship(
        "Objective",
        cascade="all, delete-orphan",
        lazy="selectin",
        overlaps="organization",
    )
    tasks = relationship(
        "Task",
        cascade="all, delete-orphan",
        lazy="selectin",
        overlaps="organization",
    )
    task_labels = relationship(
        "TaskLabel",
        cascade="all, delete-orphan",
        lazy="selectin",
        overlaps="organization",
    )
    memberships = relationship("Membership", lazy="selectin", overlaps="organization")


    # ✅ Table args ПОСЛЕ определения колонок
    __table_args__ = (
        Index("ix_org_owner_created", "owner_id", "created_at"),
        Index("ix_org_address_gin", "address", postgresql_using="gin"),
        Index("ix_org_custom_fields_gin", "custom_fields", postgresql_using="gin"),
        CheckConstraint("slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'", name="ck_organizations_slug_format"))
    
    @staticmethod
    def generate_slug(name: str) -> str:
        slug = re.sub(r"[^a-z0-9]+", "-", name.lower().strip())
        return re.sub(r"^-+|-+$", "", slug)[:80]
    
    def __repr__(self) -> str:
        return f"<Organization id={self.id} slug={self.slug!r} name={self.name!r}>"

# =========================
# Org structure: Department
# =========================
class Department(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "departments"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    parent_id = Column(PG_UUID(as_uuid=True), ForeignKey("departments.id", ondelete="SET NULL"), index=True, nullable=True)
    name = Column(String(120), nullable=False, index=True)
    description = Column(Text, nullable=True)
    manager_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    
    organization = relationship("Organization", back_populates="departments", lazy="selectin")
    parent = relationship("Department", remote_side=[id], back_populates="children", lazy="selectin")
    children = relationship("Department", back_populates="parent", lazy="selectin")
    memberships = relationship("Membership", back_populates="department", lazy="selectin")
    manager = relationship("User", back_populates="managed_departments", foreign_keys=[manager_id], lazy="selectin")
    
    __table_args__ = (
        UniqueConstraint("org_id", "name", name="uq_department_org_name"),
        Index("ix_department_parent_id", "parent_id"),
    )

# =========================
# Brand
# =========================
class Brand(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "brands"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    name = Column(String(120), nullable=False, index=True)
    slug = Column(String(80), nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    meta_data = Column("metadata", JSONB, nullable=True)
    
    organization = relationship("Organization", back_populates="brands", lazy="selectin")
    business_units = relationship("BusinessUnit", back_populates="brand", lazy="selectin")
    locations = relationship("Location", back_populates="brand", lazy="selectin")
    
    __table_args__ = (
        UniqueConstraint("org_id", "slug", name="uq_brand_org_slug"),
        CheckConstraint("slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'", name="ck_brands_slug_format"),
        Index("ix_brand_metadata_gin", "metadata", postgresql_using="gin"),
    )

# =========================
# BusinessUnit
# =========================
class BusinessUnit(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "business_units"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    brand_id = Column(PG_UUID(as_uuid=True), ForeignKey("brands.id", ondelete="SET NULL"), index=True, nullable=True)
    name = Column(String(120), nullable=False, index=True)
    description = Column(Text, nullable=True)
    meta_data = Column("metadata", JSONB, nullable=True)
    
    organization = relationship("Organization", back_populates="business_units", lazy="selectin")
    brand = relationship("Brand", back_populates="business_units", lazy="selectin")
    locations = relationship("Location", back_populates="business_unit", lazy="selectin")
    
    __table_args__ = (
        UniqueConstraint("org_id", "name", name="uq_bu_org_name"),
        Index("ix_bu_metadata_gin", "metadata", postgresql_using="gin"),
    )

# =========================
# Location
# =========================
class Location(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "locations"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    brand_id = Column(PG_UUID(as_uuid=True), ForeignKey("brands.id", ondelete="SET NULL"), index=True, nullable=True)
    bu_id = Column(PG_UUID(as_uuid=True), ForeignKey("business_units.id", ondelete="SET NULL"), index=True, nullable=True)
    name = Column(String(120), nullable=False, index=True)
    address = Column(JSONB, nullable=True)
    timezone = Column(String(64), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    meta_data = Column("metadata", JSONB, nullable=True)
    
    organization = relationship("Organization", back_populates="locations", lazy="selectin")
    brand = relationship("Brand", back_populates="locations", lazy="selectin")
    business_unit = relationship("BusinessUnit", back_populates="locations", lazy="selectin")
    
    __table_args__ = (
        UniqueConstraint("org_id", "name", name="uq_location_org_name"),
        Index("ix_location_address_gin", "address", postgresql_using="gin"),
        Index("ix_location_metadata_gin", "metadata", postgresql_using="gin"),
    )

# =========================
# DataSource & OAuthCredential
# =========================
class DataSource(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "data_sources"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    type = Column(Enum("facebook_ads", "google_ads", "tiktok_ads", "ga4", "telegram_bot", "custom", name="data_source_type"), nullable=False)
    name = Column(String(120), nullable=True)
    config = Column(JSONB, nullable=True)
    status = Column(Enum("disconnected", "connected", "error", name="data_source_status"), default="disconnected", nullable=False)
    
    organization = relationship("Organization", lazy="selectin")
    
    __table_args__ = (
        Index("ix_ds_type_status", "type", "status"),
        Index("ix_ds_config_gin", "config", postgresql_using="gin"),
        )

class OAuthCredential(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "oauth_credentials"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    data_source_id = Column(PG_UUID(as_uuid=True), ForeignKey("data_sources.id", ondelete="CASCADE"), index=True, nullable=False)
    access_token_enc = Column(Text, nullable=False)
    refresh_token_enc = Column(Text, nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    meta_data = Column("metadata", JSONB, nullable=True)
    
    __table_args__ = (
        Index("ix_oauth_metadata_gin", "metadata", postgresql_using="gin"),
        )

# =========================
# AdAccount, TelegramIntegration, WebhookEndpoint
# =========================
class AdAccount(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "ad_accounts"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    data_source_id = Column(PG_UUID(as_uuid=True), ForeignKey("data_sources.id", ondelete="CASCADE"), index=True, nullable=False)
    external_id = Column(String(120), nullable=False)
    name = Column(String(200), nullable=True)
    currency = Column(String(3), nullable=True)
    config = Column(JSONB, nullable=True)
    
    __table_args__ = (
        UniqueConstraint("org_id", "data_source_id", "external_id", name="uq_ad_account_external"),
        Index("ix_ad_config_gin", "config", postgresql_using="gin"),
        )

class TelegramIntegration(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "telegram_integrations"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    bot_token_enc = Column(Text, nullable=False)
    webhook_url = Column(Text, nullable=True)
    status = Column(Enum("inactive", "active", "error", name="integration_status"), default="inactive", nullable=False)
    settings = Column(JSONB, nullable=True)
    
    __table_args__ = (
        Index("ix_tg_settings_gin", "settings", postgresql_using="gin")),

class WebhookEndpoint(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "webhook_endpoints"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    target_url = Column(Text, nullable=False)
    secret_enc = Column(Text, nullable=False)
    enabled = Column(Boolean, default=True, nullable=False)
    events = Column(JSONB, nullable=True)
    
    __table_args__ = (
        Index("ix_webhook_enabled", "enabled"),
        Index("ix_webhook_events_gin", "events", postgresql_using="gin"),
        )

# =========================
# FileAsset & NotificationSetting
# =========================
class FileAsset(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "file_assets"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    owner_id = Column(PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True)
    bucket = Column(String(120), nullable=False)
    object_key = Column(String(500), nullable=False)
    mime_type = Column(String(120), nullable=True)
    size_bytes = Column(Integer, nullable=True)
    sha256_hex = Column(String(64), nullable=True)
    status = Column(Enum("queued", "scanned", "infected", "ready", name="file_status"), default="queued", nullable=False)
    meta_data = Column("metadata", JSONB, nullable=True)

    owner = relationship("User", back_populates="file_assets")
    
    __table_args__ = (
        Index("ix_file_org_owner", "org_id", "owner_id"),
        Index("ix_file_status", "status"),
        Index("ix_file_meta_data_gin", "metadata", postgresql_using="gin"))

class OrgNotificationSetting(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "org_notification_settings"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    defaults = Column(JSONB, nullable=True)
    rules = Column(JSONB, nullable=True)
    
    organization = relationship("Organization", lazy="selectin")
    
    __table_args__ = (
        Index("ix_org_notif_defaults_gin", "defaults", postgresql_using="gin"),
        Index("ix_org_notif_rules_gin", "rules", postgresql_using="gin"))

# =========================
# Plan & Subscription
# =========================
class Plan(Base, TimestampMixin):
    __tablename__ = "plans"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(120), nullable=False)
    features = Column(JSONB, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    __table_args__ = (
        Index("ix_plan_features_gin", "features", postgresql_using="gin"),
        )

class Subscription(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "subscriptions"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    plan_id = Column(PG_UUID(as_uuid=True), ForeignKey("plans.id", ondelete="RESTRICT"), index=True, nullable=False)
    provider = Column(Enum("stripe", "paddle", "manual", name="billing_provider"), nullable=False)
    external_id = Column(String(120), nullable=True, index=True)
    status = Column(Enum("trialing", "active", "past_due", "canceled", "incomplete", name="subscription_status"), default="active", nullable=False)
    period_start = Column(DateTime(timezone=True), nullable=True)
    period_end = Column(DateTime(timezone=True), nullable=True)
    limits_override = Column(JSONB, nullable=True)
    
    organization = relationship("Organization", lazy="selectin")
    
    __table_args__ = (
        Index("ix_subscription_limits_override_gin", "limits_override", postgresql_using="gin"),
        )

# =========================
# MetricDefinition
# =========================
class MetricDefinition(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "metric_definitions"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    name = Column(String(120), nullable=False, index=True)
    description = Column(Text, nullable=True)
    unit = Column(String(50), nullable=True)
    formula = Column(Text, nullable=True)
    aggregation = Column(Enum("sum", "avg", "count", "max", "min", name="aggregation_type"), nullable=True)
    meta_data = Column("metadata", JSONB, nullable=True)
    
    organization = relationship("Organization", lazy="selectin")
    targets = relationship("MetricTarget", lazy="selectin", overlaps="metric_definition")
    
    __table_args__ = (
        UniqueConstraint("org_id", "name", name="uq_metric_def_org_name"),
        Index("ix_metric_meta_gin", "metadata", postgresql_using="gin"))

# =========================
# MetricTarget
# =========================
class MetricTarget(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "metric_targets"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    metric_def_id = Column(PG_UUID(as_uuid=True), ForeignKey("metric_definitions.id", ondelete="CASCADE"), nullable=False, index=True)
    target_value = Column(Float, nullable=False)
    period_start = Column(DateTime(timezone=True), nullable=False)
    period_end = Column(DateTime(timezone=True), nullable=False)
    status = Column(Enum("on_track", "at_risk", "off_track", name="target_status"), default="on_track", nullable=False)
    meta_data = Column("metadata", JSONB, nullable=True)
    
    metric_definition = relationship("MetricDefinition", lazy="selectin", overlaps="targets")
    
    __table_args__ = (
        UniqueConstraint("org_id", "metric_def_id", "period_start", name="uq_metric_target_period"),
        Index("ix_target_period", "period_start", "period_end"),
        Index("ix_target_meta_gin", "metadata", postgresql_using="gin"))




# =========================
# OrgCompliance
# =========================
class OrgCompliance(Base, OrgFKMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "org_compliances"
    
    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4, nullable=False)
    type = Column(Enum("legal", "financial", "environmental", "data_protection", name="compliance_type"), nullable=False)
    status = Column(Enum("compliant", "non_compliant", "pending", name="compliance_status"), default="pending", nullable=False)
    documents = Column(JSONB, nullable=True)
    last_audit_date = Column(DateTime(timezone=True), nullable=True)
    meta_data = Column("metadata", JSONB, nullable=True)
    
    organization = relationship("Organization", lazy="selectin")
    
    __table_args__ = (
        UniqueConstraint("org_id", "type", name="uq_org_compliance_type"),
        Index("ix_compliance_documents_gin", "documents", postgresql_using="gin"),
        Index("ix_compliance_meta_gin", "metadata", postgresql_using="gin"))