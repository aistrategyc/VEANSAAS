import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary"
  }
  children?: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
  className,
  size = "md"
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: "py-8",
      icon: "w-8 h-8 mb-3",
      title: "text-base",
      description: "text-sm"
    },
    md: {
      container: "py-12",
      icon: "w-12 h-12 mb-4",
      title: "text-lg",
      description: "text-sm"
    },
    lg: {
      container: "py-16",
      icon: "w-16 h-16 mb-6",
      title: "text-xl",
      description: "text-base"
    }
  }

  const currentSize = sizeClasses[size]

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      currentSize.container,
      className
    )}>
      {Icon && (
        <div className="flex items-center justify-center rounded-full bg-muted p-4 mb-4">
          <Icon className={cn("text-muted-foreground", currentSize.icon)} />
        </div>
      )}
      <h3 className={cn("font-semibold text-foreground", currentSize.title)}>
        {title}
      </h3>
      {description && (
        <p className={cn("text-muted-foreground mt-2 max-w-sm", currentSize.description)}>
          {description}
        </p>
      )}
      {action && (
        <Button
          variant={action.variant || "default"}
          onClick={action.onClick}
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}

// Specialized Empty States
export function EmptyTasks() {
  return (
    <EmptyState
      title="No tasks yet"
      description="Create your first task to get started with project management."
      action={{
        label: "Create Task",
        onClick: () => console.log("Create task")
      }}
    />
  )
}

export function EmptySearch({ searchTerm }: { searchTerm: string }) {
  return (
    <EmptyState
      title="No results found"
      description={`We couldn't find anything matching "${searchTerm}". Try adjusting your search terms.`}
      size="sm"
    />
  )
}