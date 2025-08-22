// src/lib/ui/errorToMessage.ts
interface APIErrorDetail {
  type?: string
  loc?: any[]
  msg?: string
  input?: any
  ctx?: Record<string, any>
}

export function errorToMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as any

    if (err.detail) {
      if (typeof err.detail === 'string') return err.detail
      if (Array.isArray(err.detail)) {
        return err.detail
          .map((e: APIErrorDetail) => e.msg || JSON.stringify(e))
          .join(', ')
      }
      if (typeof err.detail === 'object') {
        return err.detail.msg || JSON.stringify(err.detail)
      }
    }

    if (err.message) return err.message
  }

  try {
    return JSON.stringify(error)
  } catch {
    return 'Unknown error'
  }
}