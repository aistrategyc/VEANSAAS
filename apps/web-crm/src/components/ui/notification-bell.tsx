"use client"

import * as React from "react"
import { Bell, Check, X, AlertCircle, Info, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
  actionUrl?: string
}

interface NotificationBellProps {
  notifications?: Notification[]
  count?: number
  onNotificationClick?: (notification: Notification) => void
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  onClearAll?: () => void
  maxHeight?: string
  className?: string
}

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
}

const notificationColors = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
}

export function NotificationBell({
  notifications = [],
  count,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  maxHeight = "400px",
  className
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  const unreadCount = count ?? notifications.filter(n => !n.read).length
  const hasUnread = unreadCount > 0

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return date.toLocaleDateString()
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead?.(notification.id)
    }
    onNotificationClick?.(notification)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className={cn(
            "h-5 w-5",
            hasUnread && "animate-pulse"
          )} />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0"
        style={{ maxHeight }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center space-x-2">
            {hasUnread && onMarkAllAsRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            {onClearAll && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type]
                const iconColor = notificationColors[notification.type]

                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                      !notification.read && "bg-blue-50/50 border-l-2 border-l-blue-500"
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={cn("flex-shrink-0 mt-0.5", iconColor)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            "text-sm font-medium truncate",
                            !notification.read && "text-foreground"
                          )}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

// Notification Provider & Hook
interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  removeNotification: (id: string) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<Notification[]>([])

  const addNotification = React.useCallback((
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    }
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  const removeNotification = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const markAsRead = React.useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  const markAllAsRead = React.useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const clearAll = React.useCallback(() => {
    setNotifications([])
  }, [])

  const value = React.useMemo(() => ({
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  }), [notifications, addNotification, removeNotification, markAsRead, markAllAsRead, clearAll])

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = React.useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

// Simple notification hook for quick usage
export function useSimpleNotifications() {
  const { addNotification } = useNotifications()

  const notify = React.useCallback((
    message: string,
    type: Notification["type"] = "info",
    title?: string
  ) => {
    addNotification({
      title: title || type.charAt(0).toUpperCase() + type.slice(1),
      message,
      type,
    })
  }, [addNotification])

  return {
    success: (message: string, title?: string) => notify(message, "success", title),
    error: (message: string, title?: string) => notify(message, "error", title),
    warning: (message: string, title?: string) => notify(message, "warning", title),
    info: (message: string, title?: string) => notify(message, "info", title),
  }
}