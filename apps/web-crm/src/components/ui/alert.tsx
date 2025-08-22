"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { CheckCircle, Info, XCircle, AlertTriangle } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        destructive:
          "text-destructive border-destructive/50 dark:border-destructive [&>svg]:text-destructive",
        success: "text-green-600 border-green-400 [&>svg]:text-green-500",
        warning: "text-yellow-600 border-yellow-400 [&>svg]:text-yellow-500",
        info: "text-blue-600 border-blue-400 [&>svg]:text-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

// Ensure variant indexing is strictly typed (VariantProps can include null/undefined)
type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>

const iconMap: Record<AlertVariant, React.ComponentType<{ className?: string }>> = {
  default: Info,
  destructive: XCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const v = (variant ?? "default") as AlertVariant
    const Icon = iconMap[v]
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant: v }), className)}
        {...props}
      >
        {Icon ? <Icon className="h-4 w-4" /> : null}
        <div>{children}</div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }