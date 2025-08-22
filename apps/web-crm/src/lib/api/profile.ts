// apps/web-enterprise/src/lib/api/profile.ts
// Production-ready API for users/organizations with normalized user stats.

import { api } from '@/lib/api/config'
import { errorToMessage } from '@/lib/ui/errorToMessage'
import type {
  UserProfile,
  UserPreferences,
  UserProfileUpdate,
  Organization,
  OrganizationUpdate,
  Department,
  Membership,
  TeamMember,
} from '@/types/profile'

export type { TeamMember } from '@/types/profile'

// =======================
// Users
// =======================

export const getCurrentUser = async (): Promise<UserProfile> => {
  const { data } = await api.get<UserProfile>('users/me')
  return data
}

export const updateUserProfile = async (updates: UserProfileUpdate): Promise<UserProfile> => {
  const { data } = await api.patch<UserProfile>('users/me', updates)
  return data
}

export const changeUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  await api.post('users/me/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
  })
}

export const uploadUserAvatar = async (file: File): Promise<UserProfile> => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post<UserProfile>('users/me/upload-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const updateUserPreferences = async (prefs: UserPreferences): Promise<void> => {
  await api.patch('users/me/preferences', prefs)
}

// =======================
// User stats (normalized)
// =======================

// Как может вернуться ответ бэка (расширенный, допускаем разные ключи для обратной совместимости)
export type UserStatsResponse = {
  total_tasks?: number
  completed_tasks?: number
  in_progress_tasks?: number
  overdue_tasks?: number
  completion_rate?: number
  active_projects?: number

  // legacy / альтернативные возможные ключи:
  tasks_total?: number
  tasks_completed?: number
  projects_count?: number
}

// Жёстко нормализованный тип, который используем в приложении
export type UserStats = {
  total_tasks: number
  completed_tasks: number
  in_progress_tasks: number
  overdue_tasks: number
  completion_rate: number
  active_projects: number
}

// Нормализация ответа бэка в строгий UserStats
function normalizeUserStats(src: UserStatsResponse | undefined): UserStats {
  const total = src?.total_tasks ?? src?.tasks_total ?? 0
  const completed = src?.completed_tasks ?? src?.tasks_completed ?? 0
  const inProgress = src?.in_progress_tasks ?? 0
  const overdue = src?.overdue_tasks ?? 0
  const completion = src?.completion_rate ?? 0
  const activeProjects = src?.active_projects ?? src?.projects_count ?? 0

  return {
    total_tasks: total,
    completed_tasks: completed,
    in_progress_tasks: inProgress,
    overdue_tasks: overdue,
    completion_rate: completion,
    active_projects: activeProjects,
  }
}

export const getUserStats = async (userId: string): Promise<UserStats> => {
  try {
    const { data } = await api.get<UserStatsResponse>(`users/${userId}/stats`)
    return normalizeUserStats(data)
  } catch (err: any) {
    if (err?.response?.status === 404) {
      // Пустая статистика вместо ошибки
      return normalizeUserStats(undefined)
    }
    throw new Error(errorToMessage(err))
  }
}

// =======================
// Organizations
// =======================

export const getOrganizations = async (): Promise<Organization[]> => {
  const { data } = await api.get<Organization[]>('orgs/')
  return data
}

export const getOrganization = async (orgId: string): Promise<Organization> => {
  const { data } = await api.get<Organization>(`orgs/${orgId}`)
  return data
}

export const updateOrganization = async (
  orgId: string,
  updates: OrganizationUpdate
): Promise<Organization> => {
  const { data } = await api.patch<Organization>(`orgs/${orgId}`, updates)
  return data
}

export const createOrganization = async (payload: {
  name: string
  description?: string
  website?: string
}): Promise<Organization> => {
  const { data } = await api.post<Organization>('orgs/', payload)
  return data
}

export const getOrgDepartments = async (orgId: string): Promise<Department[]> => {
  const { data } = await api.get<Department[]>(`orgs/${orgId}/departments/`)
  return data
}

export const getOrgMembers = async (orgId: string): Promise<TeamMember[]> => {
  const { data: memberships } = await api.get<Membership[]>(`orgs/${orgId}/memberships/`)
  const members: TeamMember[] = []

  for (const m of memberships) {
    try {
      const { data: u } = await api.get<UserProfile>(`users/${m.user_id}`)
      members.push({
        id: u.id,
        username: u.username,
        email: u.email,
        role: m.role,
        department_id: m.department_id,
        avatar_url: u.avatar_url,
        // поля активности могут отсутствовать — допускаем
        is_active: (u as any).is_active,
        last_login_at: (u as any).last_login_at ?? null,
      })
    } catch {
      // продолжим список, даже если один пользователь не забрался
      // eslint-disable-next-line no-console
      console.warn('Failed user fetch for member', m.user_id)
    }
  }

  return members
}

export const inviteToOrganization = async (
  orgId: string,
  email: string,
  role: string,
  departmentId?: string
): Promise<void> => {
  await api.post(`orgs/${orgId}/memberships/`, {
    email,
    role,
    department_id: departmentId,
  })
}

// Часто используемый алиас по коду
export const inviteUser = inviteToOrganization

// =======================
// Users list / search
// =======================

export const searchUsers = async (query: string): Promise<UserProfile[]> => {
  const { data } = await api.get<UserProfile[]>(
    `users/search?q=${encodeURIComponent(query)}`
  )
  return data
}

export const listUsers = async (
  search?: string,
  page?: number,
  perPage?: number
): Promise<{ users: UserProfile[]; total: number }> => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (page) params.append('page', String(page))
  if (perPage) params.append('per_page', String(perPage))

  const { data } = await api.get<{ items?: UserProfile[]; total?: number } | UserProfile[]>(
    `users/?${params.toString()}`
  )

  if (Array.isArray(data)) {
    return { users: data, total: data.length }
  }

  return {
    users: data.items ?? [],
    total: data.total ?? (data.items?.length ?? 0),
  }
}

export const removeMembership = async (
  orgId: string,
  membershipId: string
): Promise<void> => {
  await api.delete(`orgs/${orgId}/memberships/${membershipId}`)
}

export const updateMembership = async (
  orgId: string,
  membershipId: string,
  updates: { role?: string; department_id?: string }
): Promise<Membership> => {
  const { data } = await api.patch<Membership>(
    `orgs/${orgId}/memberships/${membershipId}`,
    updates
  )
  return data
}