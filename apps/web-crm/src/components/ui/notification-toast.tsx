"use client"

import { toast } from "./toast-provider"

interface NotificationOptions {
  title?: string
  description?: string
  duration?: number
}

export const useNotification = () => {
  const success = (message: string, options?: NotificationOptions) => {
    toast({
      title: options?.title || "Success",
      description: message,
      variant: "success",
      duration: options?.duration || 5000,
    })
  }

  const error = (message: string, options?: NotificationOptions) => {
    toast({
      title: options?.title || "Error",
      description: message,
      variant: "destructive",
      duration: options?.duration || 5000,
    })
  }

  const warning = (message: string, options?: NotificationOptions) => {
    toast({
      title: options?.title || "Warning",
      description: message,
      variant: "warning",
      duration: options?.duration || 5000,
    })
  }

  const info = (message: string, options?: NotificationOptions) => {
    toast({
      title: options?.title || "Info",
      description: message,
      variant: "default",
      duration: options?.duration || 5000,
    })
  }

  const promise = <T,>(
    promise: Promise<T>,
    options: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    const id = toast({
      title: "Loading",
      description: options.loading,
      duration: Infinity,
    })

    promise
      .then((data) => {
        id.update({
          id: (id as any).id,
          title: "Success",
          description: typeof options.success === "function" ? options.success(data) : options.success,
          variant: "success",
          duration: 5000,
        })
      })
      .catch((error) => {
        id.update({
          id: (id as any).id,
          title: "Error",
          description: typeof options.error === "function" ? options.error(error) : options.error,
          variant: "destructive",
          duration: 5000,
        })
      })

    return promise
  }

  return {
    success,
    error,
    warning,
    info,
    promise,
  }
}