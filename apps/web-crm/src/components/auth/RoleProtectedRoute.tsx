"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/(auth)/hooks/useAuth"
import ProtectedRoute from "./ProtectedRoute"
import { Loader2, ShieldX } from "lucide-react"
import { Button } from "@/components/ui/button"

type UserRole = 'owner' | 'admin' | 'member' | 'viewer'

interface RoleProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallbackUrl?: string
  requireAuth?: boolean
  requireVerified?: boolean
  requireOrganization?: boolean
}

export default function RoleProtectedRoute({
  children,
  allowedRoles,
  fallbackUrl = "/dashboard",
  requireAuth = true,
  requireVerified = true,
  requireOrganization = false
}: RoleProtectedRouteProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [roleLoading, setRoleLoading] = useState(false)

  // ✅ Получение роли пользователя (пока заглушка, позже добавим API)
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return
      
      setRoleLoading(true)
      try {
        // TODO: Получить роль из API
        // const { data } = await api.get('/users/me/role')
        // setUserRole(data.role)
        
        // Пока заглушка - считаем всех admin
        setUserRole('admin')
      } catch (error) {
        console.error('Failed to fetch user role:', error)
        setUserRole('viewer') // Default role
      } finally {
        setRoleLoading(false)
      }
    }

    fetchUserRole()
  }, [user])

  // ✅ Проверка доступа по роли
  const hasAccess = userRole && allowedRoles.includes(userRole)

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    )
  }

  if (!roleLoading && userRole && !hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <ShieldX className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page. 
            Required roles: {allowedRoles.join(', ')}. 
            Your role: {userRole}.
          </p>
          <Button 
            onClick={() => router.push(fallbackUrl)}
            variant="outline"
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute
      requireAuth={requireAuth}
      requireVerified={requireVerified}
      requireOrganization={requireOrganization}
    >
      {children}
    </ProtectedRoute>
  )
}