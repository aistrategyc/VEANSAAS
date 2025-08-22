// src/lib/api/projects.ts
import { api } from '@/lib/api/config'

// ✅ Соответствует backend schemas/projects.py
export enum ProjectStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  ON_HOLD = "on_hold",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum ProjectPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum ProjectMemberRole {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
  VIEWER = "viewer",
}

export interface ProjectBase {
  name: string
  description?: string
  start_date?: string
  end_date?: string
  meta_data?: Record<string, any>
}

export interface ProjectCreate extends ProjectBase {
  org_id?: string
  status?: ProjectStatus
  priority?: ProjectPriority
  budget?: number
  is_public?: boolean
  tags?: string[]
  member_ids?: string[]
}

export interface ProjectUpdate {
  name?: string
  description?: string
  status?: ProjectStatus
  priority?: ProjectPriority
  start_date?: string
  end_date?: string
  budget?: number
  is_public?: boolean
  tags?: string[]
  meta_data?: Record<string, any>
}

export interface Project extends ProjectBase {
  id: string
  org_id?: string
  owner_id: string
  status: ProjectStatus
  priority?: ProjectPriority
  budget?: number
  is_public?: boolean
  tags?: string[]
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface ProjectMember {
  id: string
  project_id: string
  user_id: string
  role: string
  joined_at?: string
  created_at: string
  user?: Record<string, any>
}

export interface ProjectWithDetails extends Project {
  members: ProjectMember[]
  tasks: any[]
  member_count: number
  task_count: number
  completed_tasks: number
}

export interface ProjectListResponse {
  items: Project[]
  total: number
  page: number
  page_size: number
  has_next: boolean
  has_prev: boolean
}

export interface ProjectMemberAdd {
  user_ids: string[]
  role?: string
}

// Projects API methods
export class ProjectsAPI {
  static async getProjects(params?: { 
    page?: number
    page_size?: number
    status?: ProjectStatus
    priority?: ProjectPriority
  }): Promise<ProjectListResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', String(params.page))
    if (params?.page_size) searchParams.append('page_size', String(params.page_size))
    if (params?.status) searchParams.append('status', params.status)
    if (params?.priority) searchParams.append('priority', params.priority)
    
    const query = searchParams.toString()
    const url = query ? `projects/?${query}` : 'projects/'
    
    const { data } = await api.get(url)
    return data
  }

  static async getProject(projectId: string): Promise<ProjectWithDetails> {
    const { data } = await api.get(`projects/${projectId}`)
    return data
  }

  static async createProject(projectData: ProjectCreate): Promise<Project> {
    const { data } = await api.post('projects/', projectData)
    return data
  }

  static async updateProject(projectId: string, projectData: ProjectUpdate): Promise<Project> {
    const { data } = await api.patch(`projects/${projectId}`, projectData)
    return data
  }

  static async deleteProject(projectId: string): Promise<void> {
    await api.delete(`projects/${projectId}`)
  }

  static async updateProjectStatus(projectId: string, status: ProjectStatus, reason?: string): Promise<Project> {
    const { data } = await api.patch(`projects/${projectId}/status`, { status, reason })
    return data
  }

  // Project members
  static async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const { data } = await api.get(`projects/${projectId}/members`)
    return data?.items || data || []
  }

  static async addProjectMembers(projectId: string, memberData: ProjectMemberAdd): Promise<void> {
    await api.post(`projects/${projectId}/members`, memberData)
  }

  static async updateProjectMemberRole(projectId: string, userId: string, role: ProjectMemberRole): Promise<void> {
    await api.patch(`projects/${projectId}/members/${userId}`, { role })
  }

  static async removeProjectMember(projectId: string, userId: string): Promise<void> {
    await api.delete(`projects/${projectId}/members/${userId}`)
  }

  // Project tasks
  static async getProjectTasks(projectId: string): Promise<any[]> {
    const { data } = await api.get(`projects/${projectId}/tasks`)
    return data?.items || data || []
  }
}