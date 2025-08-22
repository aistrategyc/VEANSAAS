// apps/web-enterprise/src/types/profile.ts

export interface UserProfile {
  id: string
  email: string
  username: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  phone?: string
  position?: string
  bio?: string
  timezone?: string
  language?: string
  is_verified: boolean
  created_at: string
  updated_at: string
  // опционально (если показываете в UI):
  is_active?: boolean
  last_login_at?: string | null
}

export interface UserProfileUpdate {
  username?: string
  first_name?: string
  last_name?: string
  phone?: string
  position?: string
  bio?: string
  language?: string
}

export type Industry = 'retail' | 'it' | 'marketing' | 'education' | 'other'
export type CompanySize = 'small' | 'medium'
export type WeekStart = 'monday' | 'sunday'
export type CurrencyCode = 'PLN' | 'USD' | 'EUR'
export type LocaleCode = 'pl-PL' | 'en-US' | 'ru-RU'

export interface UserPreferences {
  timezone?: string
  locale?: LocaleCode
  currency?: CurrencyCode
  week_start?: WeekStart
  theme?: 'light' | 'dark' | 'system'
  notifications?: {
    email?: boolean
    push?: boolean
    sms?: boolean
  }
  [key: string]: any
}

export interface UserStats {
  total_tasks: number
  completed_tasks: number
  in_progress_tasks: number
  overdue_tasks: number
  completion_rate: number
  active_projects: number
}

export interface GeoPoint { lat: number; lon: number }

export interface Address {
  line1?: string
  line2?: string
  city?: string
  region?: string
  country?: string
  postal_code?: string
  geo?: GeoPoint
}

export interface OrganizationPreferences {
  timezone?: string
  currency?: CurrencyCode
  locale?: LocaleCode
  week_start?: WeekStart
  [key: string]: any
}

export interface Organization {
  id: string
  slug: string
  owner_id: string
  name: string
  description?: string
  address?: Address
  industry?: Industry
  size?: CompanySize
  custom_fields?: Record<string, any>
  preferences?: OrganizationPreferences
  created_at: string
  updated_at: string
  deleted_at?: string | null
  owner?: { id: string; username?: string; email?: string }
  stats?: {
    users_count: number
    brands_count: number
    business_units_count: number
    locations_count: number
    last_activity_at?: string | null
  }
  categories?: string[]
  website?: string | null
}

export interface OrganizationUpdate {
  name?: string
  description?: string
  address?: Address
  industry?: Industry
  size?: CompanySize
  custom_fields?: Record<string, any>
  preferences?: OrganizationPreferences
  slug?: string
  website?: string | null
}

export type MembershipStatus = 'active' | 'suspended' | 'invited'
export type MembershipRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer'

export interface Department {
  id: string
  org_id?: string
  parent_id?: string | null
  name: string
  description?: string | null
  manager_id?: string | null
  created_at?: string
  updated_at?: string
}

export interface Membership {
  id: string
  org_id: string
  user_id: string
  role: MembershipRole
  department_id?: string | null
  title?: string | null
  status: MembershipStatus
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface TeamMember {
  id: string
  username: string
  email: string
  role: MembershipRole
  department_id?: string | null
  avatar_url?: string
  is_active?: boolean
  last_login_at?: string | null
}