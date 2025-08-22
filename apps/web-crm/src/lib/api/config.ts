// apps/web-enterprise/src/lib/api/config.ts
// Production-ready Axios config with cookie-based refresh flow (queued, single-flight)
// + optional Bearer from localStorage (dev).

import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios"

// --------------------------------------------------
// Base URL
// --------------------------------------------------
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8001/api"
).replace(/\/+$/, "")

// --------------------------------------------------
// Token helpers (dev only; в prod полагаемся на httpOnly refresh cookie)
// --------------------------------------------------
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem("access_token")
  } catch {
    return null
  }
}

export const setAccessToken = (token: string): void => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("access_token", token)
  } catch {}
}

export const clearTokens = (): void => {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem("access_token")
  } catch {}
}

// --------------------------------------------------
// Axios instances
// --------------------------------------------------
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // важен для httpOnly refresh cookie
  headers: { "Content-Type": "application/json" },
})

/** Отдельный клиент для refresh, чтобы не зациклиться в интерсепторе */
const raw = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

// --------------------------------------------------
// Request: подставляем Bearer из localStorage (удобно в dev)
// --------------------------------------------------
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers || {}
    ;(config.headers as any).Authorization = `Bearer ${token}`
  }
  return config
})

// --------------------------------------------------
// Refresh single-flight + очередь подписчиков
// --------------------------------------------------
let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null
let subscribers: Array<(token: string | null) => void> = []

function subscribe(cb: (token: string | null) => void) {
  subscribers.push(cb)
}
function broadcast(token: string | null) {
  subscribers.forEach((cb) => cb(token))
  subscribers = []
}

async function doRefresh(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      // IMPORTANT: не перехватывать самим интерсептором
      const { data } = await raw.post(
        "/auth/refresh",
        {},
        { headers: { "x-skip-auth-retry": "true" } }
      )
      const token: string | null = data?.access_token || null
      if (token) setAccessToken(token)
      broadcast(token)
      return token
    } catch (e) {
      broadcast(null)
      return null
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

// --------------------------------------------------
// Response: единый обработчик 401 + повтор запроса
// --------------------------------------------------
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = (error.config || {}) as AxiosRequestConfig & { _retry?: boolean }
    const status = error.response?.status

    // Не трогаем другие ошибки
    if (status !== 401) {
      return Promise.reject(error)
    }

    const url = (original.url || "") as string
    const isRefreshCall = url.includes("/auth/refresh")
    const alreadyRetried = original._retry === true
    const skipHeader = (original.headers as any)?.["x-skip-auth-retry"] === "true"

    // Ничего не делаем для refresh-запроса / уже ретраили / skip-флаг
    if (isRefreshCall || alreadyRetried || skipHeader) {
      clearTokens()
      return Promise.reject(error)
    }

    // Помечаем как повторяемый один раз
    original._retry = true

    // Ждём новый токен (в очереди), затем повторяем запрос
    const newToken = await new Promise<string | null>((resolve) => {
      subscribe(resolve)
      doRefresh().catch(() => resolve(null))
    })

    if (newToken) {
      original.headers = original.headers || {}
      ;(original.headers as any).Authorization = `Bearer ${newToken}`
      return api(original)
    }

    // Обновить не удалось — чистим и отдаём ошибку наверх
    clearTokens()
    return Promise.reject(error)
  }
)