export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  
  return localStorage.getItem('access_token')
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') {
    return
  }
  
  localStorage.setItem('access_token', token)
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') {
    return
  }
  
  localStorage.removeItem('access_token')
}