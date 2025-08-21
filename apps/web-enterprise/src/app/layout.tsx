import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Providers } from "./providers"
import { AuthProvider } from "@/app/(auth)/hooks/useAuth"
import Header from "@/components/ui/header"
import Sidebar from "@/components/ui/sidebar"
import { ToastProvider } from "@/components/ui/use-toast"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Liderix — Business OS",
  description: "AI-powered operating system for modern business.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-white text-gray-900 font-sans antialiased transition-colors duration-300",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <Providers>
          <AuthProvider>
            <ToastProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </ToastProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}

function ConditionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="relative flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-10 md:py-8 pt-20 bg-white/80 backdrop-blur-sm">
          {children}
        </main>
      </div>
    </>
  )
}
