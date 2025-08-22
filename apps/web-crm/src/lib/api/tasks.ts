// src/lib/api/tasks.ts
import { api } from '@/lib/api/config'

// ------------ Types ------------
export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  task_type: TaskType  // Backend field
  type: TaskType       // Computed field (always equals task_type)
  project_id?: string
  assignee_id?: string
  assigned_to?: string // Frontend compatibility alias for assignee_id  
  creator_id?: string
  created_by?: string  // Frontend compatibility alias for creator_id
  created_at: string
  updated_at: string
  due_date?: string
  estimated_hours?: number
  actual_hours?: number
}

// ✅ Соответствует backend schemas/tasks.py
export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  REVIEW = "review",
  DONE = "done",
  CANCELLED = "cancelled",
}

// Backwards compatibility alias
export const TaskStatusLegacy = {
  ...TaskStatus,
  IN_REVIEW: TaskStatus.REVIEW,
} as const

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

// ✅ Соответствует backend schemas/tasks.py
export enum TaskType {
  TASK = "task",
  BUG = "bug",
  FEATURE = "feature",
  IMPROVEMENT = "improvement",
  RESEARCH = "research",
  DOCUMENTATION = "documentation",
  TESTING = "testing",
}

// ✅ Соответствует backend TaskCreate
export interface TaskCreate {
  title: string
  description?: string
  priority?: TaskPriority
  task_type: TaskType     // Required field, maps to backend
  assignee_id?: string
  assigned_to?: string    // Frontend compatibility alias
  due_date?: string
  start_date?: string
  estimated_hours?: number
  story_points?: number
  tags?: string[]
  custom_fields?: Record<string, any>
  project_id?: string
  parent_task_id?: string
  status?: TaskStatus
}

// ✅ Соответствует backend TaskUpdate
export interface TaskUpdate {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  task_type?: TaskType    // Backend field
  assignee_id?: string
  assigned_to?: string    // Frontend compatibility alias
  due_date?: string
  start_date?: string
  completed_at?: string
  estimated_hours?: number
  actual_hours?: number
  story_points?: number
  progress_percentage?: number
  tags?: string[]
  custom_fields?: Record<string, any>
  project_id?: string
}

export interface TaskFilters {
  page?: number
  per_page?: number
  status?: TaskStatus
  priority?: TaskPriority
  task_type?: TaskType
  project_id?: string
  assignee_id?: string
  assigned_to?: string    // Frontend compatibility alias
  creator_id?: string
  search?: string
}

export interface TaskStats {
  total_tasks: number
  completed_tasks: number
  in_progress_tasks: number
  overdue_tasks: number
  completion_rate: number
}

// ------------ Tasks API ------------
export class TasksAPI {
  // list with filters
  static async getTasks(filters?: TaskFilters): Promise<Task[]> {
  const params = new URLSearchParams()
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })
  }

  const q = params.toString()
  const url = q ? `tasks/?${q}` : 'tasks/'

  const { data } = await api.get(url)

  // 🔧 Нормализуем ответ в массив и типы
  const items = Array.isArray(data)
    ? data
    : data?.items ?? data?.results ?? data?.tasks ?? []

  return (items as Task[]).map(normalizeTask)
}

  static async getTask(taskId: string): Promise<Task> {
    const { data } = await api.get(`tasks/${taskId}`)
    return normalizeTask(data)
  }

  static async createTask(taskData: TaskCreate): Promise<Task> {
    const apiData = prepareTaskForAPI(taskData)
    const { data } = await api.post('tasks/', apiData)
    return normalizeTask(data)
  }

  static async updateTask(taskId: string, taskData: TaskUpdate): Promise<Task> {
    const apiData = prepareTaskForAPI(taskData)
    const { data } = await api.patch(`tasks/${taskId}`, apiData)
    return normalizeTask(data)
  }

  static async deleteTask(taskId: string): Promise<void> {
    await api.delete(`tasks/${taskId}`)
  }

  static async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const { data } = await api.patch(`tasks/${taskId}/status`, { status })
    return normalizeTask(data)
  }

  static async updateTaskAssignment(taskId: string, assigneeId: string): Promise<Task> {
    const { data } = await api.patch(`tasks/${taskId}/assignment`, {
      assignee_id: assigneeId,
    })
    return normalizeTask(data)
  }

  static async getTaskComments(taskId: string) {
    const { data } = await api.get(`tasks/${taskId}/comments`)
    return data
  }

  static async addTaskComment(taskId: string, content: string) {
    const { data } = await api.post(`tasks/${taskId}/comments`, { content })
    return data
  }

  static async getTaskStats(): Promise<TaskStats> {
    const { data } = await api.get('tasks/stats')
    return data
  }
}

// ------------ Users API (для списка исполнителей) ------------
export interface User {
  id: string
  username: string
  email: string
}

export class UsersAPI {
  static async getUsers(): Promise<User[]> {
    // ❗ было 'users/users/' — исправлено
    const { data } = await api.get('users/')
    return data
  }

  static async searchUsers(query: string): Promise<User[]> {
    // ❗ было 'users/users/search' — исправлено
    const { data } = await api.get(`users/search?q=${encodeURIComponent(query)}`)
    return data
  }
}

// Helper function to normalize Task objects
export const normalizeTask = (task: any): Task => ({
  ...task,
  type: task.task_type || task.type,  // Ensure type equals task_type
  task_type: task.task_type || task.type,
  assigned_to: task.assigned_to || task.assignee_id,  // Normalize assignee
  created_by: task.created_by || task.creator_id,     // Normalize creator
})

// Helper function to prepare Task data for API calls
export const prepareTaskForAPI = (task: TaskCreate | TaskUpdate) => {
  const apiTask = { ...task }
  
  // Remove frontend-only fields
  delete (apiTask as any).type
  delete (apiTask as any).assigned_to  
  delete (apiTask as any).created_by
  
  // Map frontend fields to backend fields
  if ('assigned_to' in task && task.assigned_to) {
    apiTask.assignee_id = task.assigned_to
  }
  
  return apiTask
}

// ------------ Projects API (для выбора проекта) ------------
// Импортируем из отдельного файла projects.ts
export type { Project } from './projects'
export { ProjectsAPI } from './projects'