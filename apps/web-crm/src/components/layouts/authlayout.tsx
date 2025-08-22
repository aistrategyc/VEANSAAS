// src/components/layouts/AuthLayout.tsx

import { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export default function AuthLayout({
  children,
  title = "VEANCRM",
  subtitle = "Добро пожаловать! Войдите в аккаунт.",
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Логотип */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h8V3H9v6H7V3H5v6H3v4zm10-6h8v10h-8V7z"/>
              </svg>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              VEANCRM
            </span>
          </div>
        </div>
        
        {/* Форма */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 ring-1 ring-black/5">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
            <p className="text-gray-500 text-sm">{subtitle}</p>
          </div>
          {children}
          <div className="mt-8 text-center text-xs text-gray-400">
            © 2025 VEANCRM. Создано для студий красоты.
          </div>
        </div>
      </div>
    </main>
  )
}