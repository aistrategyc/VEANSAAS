# apps/api/liderix_api/schemas/projects.py
from __future__ import annotations

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from enum import Enum as PythonEnum


class ProjectStatus(PythonEnum):
    DRAFT = "draft"
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ProjectPriority(PythonEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class ProjectMemberRole(PythonEnum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"


class TaskStatus(PythonEnum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"
    CANCELLED = "cancelled"


class TaskPriority(PythonEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


# Base schemas
class ProjectBase(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    meta_data: Optional[Dict[str, Any]] = None


class ProjectCreate(ProjectBase):
    org_id: Optional[UUID] = None
    status: Optional[ProjectStatus] = ProjectStatus.DRAFT
    priority: Optional[ProjectPriority] = ProjectPriority.MEDIUM
    budget: Optional[float] = None
    is_public: Optional[bool] = True
    tags: Optional[List[str]] = None
    member_ids: Optional[List[UUID]] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    priority: Optional[ProjectPriority] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = None
    is_public: Optional[bool] = None
    tags: Optional[List[str]] = None
    meta_data: Optional[Dict[str, Any]] = None


class ProjectStatusUpdate(BaseModel):
    """Schema for updating project status"""
    status: ProjectStatus
    reason: Optional[str] = None


class ProjectMemberBase(BaseModel):
    user_id: UUID
    role: ProjectMemberRole = ProjectMemberRole.MEMBER


class ProjectMemberAdd(BaseModel):
    """Schema for adding members to project"""
    user_ids: List[UUID] = Field(min_items=1)
    role: Optional[str] = "member"


class ProjectMemberCreate(ProjectMemberBase):
    pass


class ProjectMemberUpdate(BaseModel):
    role: Optional[ProjectMemberRole] = None


class ProjectMemberRead(ProjectMemberBase):
    id: UUID
    project_id: UUID
    invited_by_id: Optional[UUID] = None
    joined_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectMemberResponse(BaseModel):
    """Response schema for project members"""
    id: UUID
    project_id: UUID
    user_id: UUID
    role: str
    joined_at: Optional[datetime] = None
    created_at: datetime
    user: Optional[Dict[str, Any]] = None  # User details

    model_config = ConfigDict(from_attributes=True)


class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    assignee_id: Optional[UUID] = None
    due_date: Optional[datetime] = None
    estimated_hours: Optional[int] = Field(None, ge=0)
    meta_data: Optional[Dict[str, Any]] = None


class TaskCreate(TaskBase):
    status: TaskStatus = TaskStatus.TODO


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    assignee_id: Optional[UUID] = None
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    estimated_hours: Optional[int] = Field(None, ge=0)
    actual_hours: Optional[int] = Field(None, ge=0)
    meta_data: Optional[Dict[str, Any]] = None


class TaskRead(TaskBase):
    id: UUID
    project_id: UUID
    status: TaskStatus
    creator_id: Optional[UUID] = None
    completed_at: Optional[datetime] = None
    actual_hours: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProjectRead(ProjectBase):
    id: UUID
    org_id: Optional[UUID] = None
    owner_id: UUID
    status: ProjectStatus
    priority: Optional[ProjectPriority] = None
    budget: Optional[float] = None
    is_public: Optional[bool] = None
    tags: Optional[List[str]] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class ProjectDetailResponse(ProjectRead):
    """Detailed project response with members and tasks"""
    members: List[ProjectMemberRead] = []
    tasks: List[TaskRead] = []
    member_count: int = 0
    task_count: int = 0
    completed_tasks: int = 0

    model_config = ConfigDict(from_attributes=True)


class ProjectListResponse(BaseModel):
    items: List[ProjectRead]
    total: int
    page: int
    page_size: int
    has_next: bool
    has_prev: bool

    model_config = ConfigDict(from_attributes=True)


class ProjectStatsResponse(BaseModel):
    """Project statistics"""
    project_id: UUID
    project_name: str
    status: ProjectStatus
    priority: Optional[ProjectPriority] = None
    duration_days: Optional[int] = None
    member_count: int
    task_distribution: Dict[str, int]
    total_tasks: int
    completion_percentage: float

    model_config = ConfigDict(from_attributes=True)


class TaskListResponse(BaseModel):
    items: List[TaskRead]
    total: int
    page: int
    page_size: int
    has_next: bool
    has_prev: bool

    model_config = ConfigDict(from_attributes=True)


class ProjectMemberListResponse(BaseModel):
    items: List[ProjectMemberRead]
    total: int

    model_config = ConfigDict(from_attributes=True)


class ProjectSearchResponse(BaseModel):
    """Project search results"""
    id: UUID
    name: str
    description: Optional[str] = None
    status: ProjectStatus
    member_count: int
    task_count: int

    model_config = ConfigDict(from_attributes=True)