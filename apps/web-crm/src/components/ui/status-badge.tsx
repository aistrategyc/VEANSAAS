import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        error: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
        info: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        outline: "text-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status?: string
}

// Status mapping for common statuses
const statusVariantMap: Record<string, "success" | "warning" | "error" | "info" | "secondary"> = {
  // Task statuses
  completed: "success",
  done: "success",
  finished: "success",
  active: "info",
  "in progress": "info",
  "in_progress": "info",
  pending: "warning",
  todo: "warning",
  cancelled: "error",
  canceled: "error",
  failed: "error",
  blocked: "error",
  
  // General statuses
  approved: "success",
  rejected: "error",
  draft: "secondary",
  published: "success",
  archived: "secondary",
  
  // User statuses
  online: "success",
  offline: "secondary",
  away: "warning",
  busy: "error",
  
  // Payment statuses
  paid: "success",
  unpaid: "error",
  overdue: "error",
  refunded: "warning",
  
  // Order statuses
  delivered: "success",
  shipped: "info",
  processing: "warning",
  returned: "error",
}

export function StatusBadge({ 
  className, 
  variant, 
  size,
  status,
  children,
  ...props 
}: StatusBadgeProps) {
  // Auto-detect variant based on status if not provided
  const autoVariant = status ? statusVariantMap[status.toLowerCase()] : undefined
  const finalVariant = variant || autoVariant || "default"
  
  const displayText = children || (status ? status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '')

  return (
    <div className={cn(statusBadgeVariants({ variant: finalVariant, size }), className)} {...props}>
      {displayText}
    </div>
  )
}

// Specialized status components
export function TaskStatusBadge({ status }: { status: "todo" | "in_progress" | "completed" | "cancelled" }) {
  const icons = {
    todo: "○",
    in_progress: "◐",
    completed: "●",
    cancelled: "✕"
  }

  return (
    <StatusBadge status={status} className="font-medium">
      <span className="mr-1">{icons[status]}</span>
      {status.replace('_', ' ')}
    </StatusBadge>
  )
}

export function PriorityBadge({ priority }: { priority: "low" | "medium" | "high" | "urgent" }) {
  const variantMap = {
    low: "secondary" as const,
    medium: "warning" as const,
    high: "error" as const,
    urgent: "error" as const
  }

  return (
    <StatusBadge 
      variant={variantMap[priority]} 
      className={cn(
        "font-medium",
        priority === "urgent" && "animate-pulse"
      )}
    >
      {priority.toUpperCase()}
    </StatusBadge>
  )
}
