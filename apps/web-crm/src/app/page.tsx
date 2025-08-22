"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/(auth)/hooks/useAuth"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return // Ждем загрузки состояния аутентификации

    if (!user) {
      // Пользователь не авторизован - перенаправляем на вход
      router.replace('/login')
      return
    }

    // TODO: Проверить есть ли у пользователя студия
    // Если студии нет - перенаправляем на онбординг
    // Пока что всегда перенаправляем на дашборд
    router.replace('/dashboard')
  }, [user, loading, router])

  // Показываем индикатор загрузки
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            VEANCRM
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            CRM для студий красоты
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <p className="text-gray-500">Загрузка...</p>
        </div>
      </div>
    </div>
  )
}