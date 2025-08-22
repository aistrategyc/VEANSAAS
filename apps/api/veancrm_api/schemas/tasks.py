# apps/api/liderix_api/schemas/tasks.py
from __future__ import annotations

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from enum import Enum as PythonEnum


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


class TaskType(PythonEnum):
    TASK = "task"
    BUG = "bug"
    FEATURE = "feature"
    IMPROVEMENT = "improvement"
    RESEARCH = "research"


# Base schemas
class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    task_type: TaskType = TaskType.TASK
    assignee_id: Optional[UUID] = None
    due_date: Optional[datetime] = None
    start_date: Optional[datetime] = None
    estimated_hours: Optional[float] = Field(None, ge=0)
    story_points: Optional[int] = Field(None, ge=0, le=100)
    tags: Optional[List[str]] = None
    custom_fields: Optional[Dict[str, Any]] = None


class TaskCreate(TaskBase):
    project_id: Optional[UUID] = None
    parent_task_id: Optional[UUID] = None
    status: TaskStatus = TaskStatus.TODO


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    task_type: Optional[TaskType] = None
    assignee_id: Optional[UUID] = None
    due_date: Optional[datetime] = None
    start_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    estimated_hours: Optional[float] = Field(None, ge=0)
    actual_hours: Optional[float] = Field(None, ge=0)
    story_points: Optional[int] = Field(None, ge=0, le=100)
    progress_percentage: Optional[int] = Field(None, ge=0, le=100)
    tags: Optional[List[str]] = None
    custom_fields: Optional[Dict[str, Any]] = None


class TaskStatusUpdate(BaseModel):
    """Schema for updating task status"""
    status: TaskStatus
    comment: Optional[str] = None
    notify_assignee: bool = True


class TaskAssignmentUpdate(BaseModel):
    """Schema for assigning/reassigning tasks"""
    assignee_id: Optional[UUID] = None
    comment: Optional[str] = None
    notify_assignee: bool = True


# Comment schemas
class TaskCommentBase(BaseModel):
    content: str = Field(min_length=1)
    content_type: str = "text"
    is_internal: bool = False


class TaskCommentCreate(TaskCommentBase):
    parent_comment_id: Optional[UUID] = None


class TaskCommentUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1)
    is_internal: Optional[bool] = None


class TaskCommentRead(TaskCommentBase):
    id: UUID
    task_id: UUID
    user_id: Optional[UUID] = None
    parent_comment_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    user: Optional[Dict[str, Any]] = None
    replies: Optional[List["TaskCommentRead"]] = None

    model_config = ConfigDict(from_attributes=True)


# Attachment schemas
class TaskAttachmentBase(BaseModel):
    filename: str
    description: Optional[str] = None
    is_public: bool = False


class TaskAttachmentCreate(TaskAttachmentBase):
    pass


class TaskAttachmentRead(TaskAttachmentBase):
    id: UUID
    task_id: UUID
    uploaded_by_id: Optional[UUID] = None
    original_filename: str
    file_url: Optional[str] = None
    content_type: Optional[str] = None
    file_size: Optional[int] = None
    created_at: datetime
    uploaded_by: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)


# Time log schemas
class TaskTimeLogBase(BaseModel):
    hours_spent: float = Field(gt=0, le=24)
    description: Optional[str] = None
    log_date: Optional[datetime] = None
    is_billable: bool = True
    hourly_rate: Optional[float] = Field(None, ge=0)


class TaskTimeLogCreate(TaskTimeLogBase):
    pass


class TaskTimeLogUpdate(BaseModel):
    hours_spent: Optional[float] = Field(None, gt=0, le=24)
    description: Optional[str] = None
    log_date: Optional[datetime] = None
    is_billable: Optional[bool] = None
    hourly_rate: Optional[float] = Field(None, ge=0)


class TaskTimeLogRead(TaskTimeLogBase):
    id: UUID
    task_id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    user: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)


# Main task read schema
class TaskRead(TaskBase):
    id: UUID
    org_id: Optional[UUID] = None
    project_id: Optional[UUID] = None
    parent_task_id: Optional[UUID] = None
    creator_id: Optional[UUID] = None
    reporter_id: Optional[UUID] = None
    status: TaskStatus
    completed_at: Optional[datetime] = None
    actual_hours: Optional[float] = None
    progress_percentage: int
    is_recurring: bool
    recurrence_pattern: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TaskDetailResponse(TaskRead):
    """Detailed task response with related data"""
    assignee: Optional[Dict[str, Any]] = None
    creator: Optional[Dict[str, Any]] = None
    reporter: Optional[Dict[str, Any]] = None
    project: Optional[Dict[str, Any]] = None
    parent_task: Optional[Dict[str, Any]] = None
    subtasks: List[TaskRead] = []
    comments: List[TaskCommentRead] = []
    attachments: List[TaskAttachmentRead] = []
    time_logs: List[TaskTimeLogRead] = []
    total_time_logged: float = 0
    comments_count: int = 0
    attachments_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class TaskListResponse(BaseModel):
    items: List[TaskRead]
    total: int
    page: int
    page_size: int
    has_next: bool
    has_prev: bool

    model_config = ConfigDict(from_attributes=True)


class TaskStatsResponse(BaseModel):
    """Task statistics response"""
    user_id: UUID
    project_id: Optional[UUID] = None
    total_tasks: int
    status_distribution: Dict[str, int]
    priority_distribution: Dict[str, int]
    overdue_count: int
    completion_rate: float
    upcoming_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class TaskSearchResponse(BaseModel):
    """Task search results"""
    id: UUID
    title: str
    description: Optional[str] = None
    status: TaskStatus
    priority: TaskPriority
    assignee_name: Optional[str] = None
    project_name: Optional[str] = None
    due_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class TaskBulkUpdate(BaseModel):
    """Schema for bulk task updates"""
    task_ids: List[UUID] = Field(min_items=1, max_items=100)
    updates: TaskUpdate


class TaskBulkAssign(BaseModel):
    """Schema for bulk task assignment"""
    task_ids: List[UUID] = Field(min_items=1, max_items=100)
    assignee_id: Optional[UUID] = None
    comment: Optional[str] = None


class TaskBulkStatusUpdate(BaseModel):
    """Schema for bulk status updates"""
    task_ids: List[UUID] = Field(min_items=1, max_items=100)
    status: TaskStatus
    comment: Optional[str] = None


# Label schemas
class TaskLabelBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: Optional[str] = None
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")


class TaskLabelCreate(TaskLabelBase):
    pass


class TaskLabelUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")
    is_active: Optional[bool] = None


class TaskLabelRead(TaskLabelBase):
    id: UUID
    org_id: UUID
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Dependency schemas
class TaskDependencyCreate(BaseModel):
    depends_on_task_id: UUID
    dependency_type: str = "blocks"


class TaskDependencyRead(BaseModel):
    id: UUID
    task_id: UUID
    depends_on_task_id: UUID
    dependency_type: str
    depends_on_task: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Recurring task schemas
class RecurrencePattern(BaseModel):
    """Schema for task recurrence patterns"""
    frequency: str = Field(pattern="^(daily|weekly|monthly|yearly)$")
    interval: int = Field(ge=1, le=365)
    days_of_week: Optional[List[int]] = Field(None, description="0=Monday, 6=Sunday")
    day_of_month: Optional[int] = Field(None, ge=1, le=31)
    end_date: Optional[datetime] = None
    max_occurrences: Optional[int] = Field(None, ge=1)


class TaskRecurringCreate(TaskCreate):
    """Schema for creating recurring tasks"""
    is_recurring: bool = True
    recurrence_pattern: RecurrencePattern


# Analytics schemas
class TaskAnalyticsResponse(BaseModel):
    """Task analytics data"""
    total_tasks: int
    status_distribution: Dict[str, int]
    priority_distribution: Dict[str, int]
    type_distribution: Dict[str, int]
    completion_rate: float
    average_completion_time: Optional[float] = None
    overdue_tasks: int
    upcoming_deadlines: int
    most_active_assignees: List[Dict[str, Any]] = []
    project_breakdown: List[Dict[str, Any]] = []

    model_config = ConfigDict(from_attributes=True)


# Comment list response
class TaskCommentListResponse(BaseModel):
    items: List[TaskCommentRead]
    total: int
    page: int
    page_size: int
    has_next: bool
    has_prev: bool

    model_config = ConfigDict(from_attributes=True)


# Time log list response
class TaskTimeLogListResponse(BaseModel):
    items: List[TaskTimeLogRead]
    total: int
    total_hours: float
    billable_hours: float
    total_cost: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)


# =============================================================================
# ALIASES FOR COMPATIBILITY WITH ROUTES
# =============================================================================

# Alias for TaskCommentResponse (routes expects this name)
TaskCommentResponse = TaskCommentRead

# Enable forward references for self-referencing models
TaskCommentRead.model_rebuild()