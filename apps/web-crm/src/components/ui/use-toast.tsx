"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { errorToMessage } from "@/lib/ui/errorToMessage"

interface Toast {
  id: string
  title?: string
  description?: string         // <- в состоянии всегда строка
  variant?: "default" | "destructive"
  duration?: number
}

type ToastInput = {
  title?: string
  description?: unknown        // <- на вход можно что угодно
  variant?: "default" | "destructive"
  duration?: number
}

interface ToastContextType {
  toast: (options: ToastInput) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({
    title,
    description,
    variant = "default",
    duration = 5000,
  }: ToastInput) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2)

    // НОРМАЛИЗАЦИЯ: приводим любое значение к строке
    const normalizedDescription =
      description === undefined || description === null
        ? undefined
        : errorToMessage(description)

    setToasts((prev) => [
      ...prev,
      { id, title, description: normalizedDescription, variant, duration },
    ])
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} onDismiss={() => dismissToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

interface ToastItemProps extends Toast {
  onDismiss: () => void
}

function ToastItem({
  title,
  description,
  variant = "default",
  duration,
  onDismiss,
}: ToastItemProps) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => onDismiss(), duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onDismiss])

  return (
    <div
      className={cn(
        "relative flex min-w-[300px] max-w-[400px] flex-col rounded-md border p-4 shadow-lg transition-all",
        variant === "destructive"
          ? "border-red-500 bg-red-50 text-red-900"
          : "border-gray-200 bg-white text-gray-900",
        "animate-in slide-in-from-right duration-300"
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {title && <h3 className="text-sm font-semibold">{title}</h3>}
          {/* description у нас уже гарантированно строка */}
          {description && <p className="mt-1 text-sm">{description}</p>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onDismiss}
          aria-label="Закрыть уведомление"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Если используешь — оставь. Но лучше оборачивать layout целиком в <ToastProvider>
export function Toaster() {
  return <ToastProvider>{null}</ToastProvider>
}