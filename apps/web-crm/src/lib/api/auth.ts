// apps/web-enterprise/src/lib/api/auth.ts
// Production-ready auth API layer for VEANCRM

import { api, setAccessToken, clearTokens, getAccessToken } from "@/lib/api/config"

// =============================
// Types (в синхроне со Swagger)
// =============================

export type TokenResponse = {
  access_token: string
  refresh_token?: string
  token_type?: string
  expires_in?: number
}

export type MessageResponse = { message: string }

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterSchema = {
  email: string
  password: string
  username: string
  terms_accepted: boolean
}

export type PasswordResetRequestSchema = { email: string }
export type PasswordResetConfirmSchema = { token: string; new_password: string }
export type PasswordResetCancelSchema = { token: string }

export type UserMe = {
  id: string
  email: string
  full_name?: string | null
  is_active?: boolean
}

export type SessionInfo = {
  id: string
  ip?: string | null
  user_agent?: string | null
  created_at?: string | null
  last_seen_at?: string | null
  is_current?: boolean
  [k: string]: unknown
}

// =============================
// Error utils
// =============================

function extractErrorMessage(err: unknown): string {
  if (typeof err === "string") return err
  if (err && typeof err === "object") {
    const anyErr = err as any
    // частые форматы FastAPI/axios
    const d = anyErr?.response?.data
    if (typeof d?.detail === "string") return d.detail
    if (d?.detail && Array.isArray(d.detail) && d.detail.length) {
      // Pydantic validation errors
      const first = d.detail[0]
      if (typeof first?.msg === "string") return first.msg
    }
    if (typeof d?.message === "string") return d.message
    if (typeof anyErr?.message === "string") return anyErr.message
  }
  return "Unexpected error"
}

// =============================
// Core auth actions
// =============================

export async function register(payload: RegisterSchema): Promise<MessageResponse> {
  try {
    const { data } = await api.post<MessageResponse>("/register", payload)
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err))
  }
}

export async function login(credentials: LoginRequest): Promise<TokenResponse> {
  try {
    const { data } = await api.post<TokenResponse>("/auth/login", credentials)
    // В dev мы кладём access_token в localStorage (config.ts его подхватывает)
    if (data?.access_token) {
      setAccessToken(data.access_token)
    }
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err))
  }
}

export async function refresh(): Promise<TokenResponse> {
  try {
    const { data } = await api.post<TokenResponse>("/auth/refresh")
    if (data?.access_token) setAccessToken(data.access_token)
    return data
  } catch (err) {
    // если refresh не удался — чистим и отдаём наверх
    clearTokens()
    throw new Error(extractErrorMessage(err))
  }
}

export async function logout(): Promise<MessageResponse> {
  try {
    const { data } = await api.post<MessageResponse>("/auth/logout")
    clearTokens()
    return data
  } catch (err) {
    clearTokens()
    throw new Error(extractErrorMessage(err))
  }
}

export async function logoutAll(): Promise<MessageResponse> {
  try {
    const { data } = await api.post<MessageResponse>("/auth/logout-all")
    clearTokens()
    return data
  } catch (err) {
    clearTokens()
    throw new Error(extractErrorMessage(err))
  }
}

export async function revokeRefresh(): Promise<MessageResponse> {
  try {
    const { data } = await api.post<MessageResponse>("/auth/revoke")
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err))
  }
}

export async function revokeAllRefresh(): Promise<MessageResponse> {
  try {
    const { data } = await api.post<MessageResponse>("/auth/revoke-all")
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err))
  }
}

export async function validateRefresh(): Promise<{ valid: boolean } & Record<string, unknown>> {
  try {
    const { data } = await api.get("/auth/validate")
    return data as any
  } catch (err) {
    throw new Error(extractErrorMessage(err))
  }
}

// =============================
// Email verification
// =============================

export async function resendVerification(email: string): Promise<MessageResponse> {
  try {
    const { data } = await api.post<MessageResponse>("/resend-verification", { email })
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err))
  }
}

// Вариант 1: подтверждение по GET /verify?token=...
export async function verifyEmailByToken(token: string): Promise<MessageResponse> {
  try {
    const { data } = await api.get<MessageResponse>("/verify", { params: { token } })
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err))
  }
}


// Вариант 2: подтверждение по POST /verify { token }
export async function verifyEmail(token: string): Promise<MessageResponse> {
  try {
    const { data } = await api.post<MessageResponse>("/verify", { token })
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err))
  }
}
export { verifyEmail as verifyEmailToken }

// =============================
// Password reset
// =============================

export async function requestPasswordReset(payload: PasswordResetRequestSchema): Promise<MessageResponse> {
  try {
    const { data } = await api.post<MessageResponse>("/auth/password-reset/request", payload)
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err))
  }
}

export async function confirmPasswordReset(payload: PasswordResetConfirmSchema): Promise<MessageResponse> {
  try {
    const { data } = await api.post<MessageResponse>("/auth/password-reset/confirm", payload)
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err))
  }
}

export async function cancelPasswordReset(payload: PasswordResetCancelSchema): Promise<MessageResponse> {
  try {
    const { data } = await api.post<MessageResponse>("/auth/password-reset/cancel", payload)
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err))
  }
}

// =============================
// Sessions
// =============================

export async function getSessions(): Promise<SessionInfo[]> {
  try {
    const { data } = await api.get<SessionInfo[]>("/auth/sessions")
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err))
  }
}

// =============================
// Me
// =============================

export async function getMe(): Promise<UserMe> {
  try {
    const { data } = await api.get<UserMe>("/users/me")
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err))
  }
}

// =============================
// Tiny helpers
// =============================

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken())
}