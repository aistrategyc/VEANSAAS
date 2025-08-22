// lib/api/company.ts
import { api } from '@/lib/api/config'
import type { Department, Membership, TeamMember } from '@/types/profile'
export type { Department, Membership, TeamMember } from '@/types/profile'
export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  address?: string
  created_at: string
  updated_at: string
}
export interface ClientCreate { name: string; email?: string; phone?: string; company?: string; address?: string }
export interface ClientUpdate { name?: string; email?: string; phone?: string; company?: string; address?: string }

export interface Company extends Client {
  industry?: string
  size?: string
  description?: string
  website?: string
  logo_url?: string
  founded_year?: number
  headquarters?: string
  revenue?: string
  employees_count?: number
  business_model?: string
  target_market?: string
}

export interface CompanyStats {
  total_employees: number
  total_projects: number
  total_tasks: number      // Add missing total_tasks field
  total_clients: number
  monthly_revenue?: number
  completion_rate: number
  active_projects: number
}

export interface CompanySettings {
  timezone: string
  currency: string
  language: string
  date_format: string
  working_hours: { start: string; end: string; days: string[] }
  notifications: { email_reports: boolean; project_updates: boolean; task_reminders: boolean }
}

export class CompanyAPI {
  // Clients
  static async getClients(): Promise<Client[]> {
    const { data } = await api.get('clients/')
    return data
  }
  static async getClient(clientId: string): Promise<Client> {
    const { data } = await api.get(`clients/${clientId}`)
    return data
  }
  static async createClient(clientData: ClientCreate): Promise<Client> {
    const { data } = await api.post('clients/', clientData)
    return data
  }
  static async updateClient(clientId: string, updates: ClientUpdate): Promise<Client> {
    const { data } = await api.put(`clients/${clientId}`, updates)
    return data
  }
  static async deleteClient(clientId: string): Promise<void> {
    await api.delete(`clients/${clientId}`)
  }

  // Company (Organization)
  static async getCurrentCompany(): Promise<Company | null> {
    const resp = await api.get('orgs/')
    const list = resp.data?.items ?? resp.data ?? []
    return Array.isArray(list) && list.length ? list[0] : null; // ⬅️ без throw
  }

  static async updateCompany(companyData: Partial<Company>): Promise<Company> {
    const resp = await api.get('orgs/')
    const list = resp.data?.items ?? resp.data ?? []
    if (Array.isArray(list) && list.length) {
      const orgId = list[0].id
      const { data } = await api.patch(`orgs/${orgId}`, companyData)
      return data
    }
    // хочешь — можно создать; иначе оставь throw
    const name = companyData.name || 'My Company'
    const { data } = await api.post('orgs/', { name, ...companyData })
    return data
  }

  static async createCompany(companyData: {
    name: string; description?: string; website?: string; industry?: string; size?: string
  }): Promise<Company> {
    const { data } = await api.post('orgs/', companyData)
    return data
  }

  static async getCompanyStats(): Promise<CompanyStats> {
    try {
      const orgsResp = await api.get('orgs/') // ⬅️ слэш
      const orgs = orgsResp.data?.items ?? orgsResp.data ?? []
      if (!Array.isArray(orgs) || orgs.length === 0) {
        return { total_employees: 0, total_projects: 0, total_tasks: 0, total_clients: 0, completion_rate: 0, active_projects: 0 }
      }
      const orgId = orgs[0].id

      const membershipsResp = await api.get(`orgs/${orgId}/memberships/`)
      const memberships = membershipsResp.data?.items ?? membershipsResp.data ?? []

      let projects: any[] = []
      try {
        const projectsResponse = await api.get('projects/') // ⬅️ было projects/projects/
        projects = projectsResponse.data?.items ?? projectsResponse.data ?? []
      } catch (e) {
        console.warn('Projects API not available:', e)
      }

      let clients: any[] = []
      try {
        const clientsResponse = await api.get('clients/')
        clients = clientsResponse.data?.items ?? clientsResponse.data ?? []
      } catch (e) {
        console.warn('Clients API not available:', e)
      }

      return {
        total_employees: memberships.length || 0,
        total_projects: projects.length || 0,
        total_tasks: projects.reduce((acc: number, p: any) => acc + (p.tasks_count || 0), 0) || 0,
        total_clients: clients.length || 0,
        completion_rate: 85,
        active_projects: projects.filter((p: any) => p.status === 'active').length || 0,
      }
    } catch (error) {
      console.error('Failed to fetch company stats:', error)
      return { total_employees: 0, total_projects: 0, total_tasks: 0, total_clients: 0, completion_rate: 0, active_projects: 0 }
    }
  }

  // Departments
  static async getDepartments(orgId: string): Promise<Department[]> {
    const { data } = await api.get(`orgs/${orgId}/departments/`)
    return data?.items ?? data
  }
  static async createDepartment(orgId: string, departmentData: {
    name: string; description?: string; parent_id?: string; head_id?: string
  }): Promise<Department> {
    const { data } = await api.post(`orgs/${orgId}/departments/`, departmentData)
    return data
  }
  static async updateDepartment(orgId: string, deptId: string, updates: {
    name?: string; description?: string; head_id?: string
  }): Promise<Department> {
    const { data } = await api.patch(`orgs/${orgId}/departments/${deptId}`, updates)
    return data
  }
  static async deleteDepartment(orgId: string, deptId: string): Promise<void> {
    await api.delete(`orgs/${orgId}/departments/${deptId}`)
  }
  static async getDepartmentStats(orgId: string, deptId: string): Promise<any> {
    const { data } = await api.get(`orgs/${orgId}/departments/${deptId}/stats`)
    return data
  }

  // Team
  static async getTeamMembers(orgId: string): Promise<TeamMember[]> {
    const membershipsResp = await api.get(`orgs/${orgId}/memberships/`)
    const membershipItems: any[] = membershipsResp.data?.items ?? membershipsResp.data ?? []

    const teamMembers: TeamMember[] = []
    for (const membership of membershipItems) {
      try {
        const user = await api.get(`users/${membership.user_id}`) // ⬅️ было users/users/...
        teamMembers.push({
          id: user.data.id,
          username: user.data.username,
          email: user.data.email,
          role: membership.role,
          department_id: membership.department_id ?? null,
          avatar_url: user.data.avatar_url,
          is_active: user.data.is_active,
          last_login_at: user.data.last_login_at,
        })
      } catch (e) {
        console.error(`Failed to fetch user ${membership.user_id}:`, e)
      }
    }
    return teamMembers
  }

  static async inviteEmployee(orgId: string, email: string, role: string, departmentId?: string): Promise<void> {
    await api.post(`orgs/${orgId}/memberships/`, { email, role, department_id: departmentId })
  }
  static async updateMemberRole(orgId: string, membershipId: string, role: string, departmentId?: string): Promise<Membership> {
    const { data } = await api.patch(`orgs/${orgId}/memberships/${membershipId}`, { role, department_id: departmentId })
    return data
  }
  static async removeEmployee(orgId: string, membershipId: string): Promise<void> {
    await api.delete(`orgs/${orgId}/memberships/${membershipId}`)
  }

  // Settings (mock)
  static async getCompanySettings(): Promise<CompanySettings> {
    return {
      timezone: 'UTC',
      currency: 'USD',
      language: 'en',
      date_format: 'MM/DD/YYYY',
      working_hours: { start: '09:00', end: '17:00', days: ['monday','tuesday','wednesday','thursday','friday'] },
      notifications: { email_reports: true, project_updates: true, task_reminders: true },
    }
  }
  static async updateCompanySettings(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    const current = await this.getCompanySettings()
    return { ...current, ...settings }
  }
}