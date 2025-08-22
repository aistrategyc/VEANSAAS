// types/onboarding.ts

export interface OrganizationCreatePayload {
  name: string
  slug?: string // будет автогенерирован если не указан
  description?: string
  industry?: 'retail' | 'it' | 'marketing' | 'education' | 'other'
  size?: 'small' | 'medium'
  address?: {
    line1?: string
    line2?: string
    city?: string
    region?: string
    country?: string // ISO-2 код
    postal_code?: string
  }
  preferences?: {
    timezone?: string
    currency?: 'PLN' | 'USD' | 'EUR'
    locale?: 'pl-PL' | 'en-US' | 'ru-RU'
    week_start?: 'monday' | 'sunday'
  }
  custom_fields?: Record<string, any>
}

export interface InviteItem {
  email: string
  role: 'viewer' | 'member' | 'admin' | 'owner'
  department_id?: string
}

export interface DepartmentCreatePayload {
  name: string
  description?: string
  parent_id?: string
  manager_id?: string
}

export interface OrganizationResponse {
  id: string
  name: string
  slug: string
  description?: string
  industry?: string
  size?: string
  owner_id: string
  address?: any
  preferences?: any
  custom_fields?: any
  created_at: string
  updated_at: string
}

export interface DepartmentResponse {
  id: string
  name: string
  description?: string
  org_id: string
  parent_id?: string
  manager_id?: string
  created_at: string
  updated_at: string
}

export interface BulkInviteResponse {
  created: Array<{
    membership_id: string
    user_id: string
    role: string
  }>
  updated: Array<{
    membership_id: string
    user_id: string
    action: string
  }>
  errors: Array<{
    index: number
    user_id: string
    error: string
  }>
  total: number
}