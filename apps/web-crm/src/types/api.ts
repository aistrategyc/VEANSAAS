// ✅ Стандартизированные типы для API

export interface APIError {
  type: string
  title: string
  detail: string
  status: number
}

export interface APIResponse<T = any> {
  data?: T
  error?: APIError
  success: boolean
}

export interface User {
  id: string
  email: string
  username: string
  full_name?: string | null
  is_active: boolean
  is_verified: boolean
  avatar_url?: string | null
  created_at: string
  updated_at?: string
  last_login_at?: string | null
}

export interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  industry?: string
  size?: 'small' | 'medium' | 'large'
  created_at: string
  updated_at?: string
}

export interface AuthTokens {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  username: string
  terms_accepted: boolean
}