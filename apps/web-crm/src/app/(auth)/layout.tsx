"use client"

import { AuthProvider } from "@/app/(auth)/hooks/useAuth"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        {/* Auth pages don't need Header/Sidebar */}
        {children}
      </div>
    </AuthProvider>
  )
}