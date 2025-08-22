"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, Minus, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"

interface ChartCardProps {
  title: string
  description?: string
  value?: string | number
  change?: {
    value: number
    type: "increase" | "decrease" | "neutral"
    period?: string
  }
  chart?: React.ReactNode
  actions?: Array<{
    label: string
    onClick: () => void
  }>
  loading?: boolean
  className?: string
  variant?: "default" | "compact" | "detailed"
}

export function ChartCard({
  title,
  description,
  value,
  change,
  chart,
  actions,
  loading = false,
  className,
  variant = "default"
}: ChartCardProps) {
  const getTrendIcon = () => {
    if (!change) return null
    
    switch (change.type) {
      case "increase":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "decrease":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "neutral":
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = () => {
    if (!change) return ""
    
    switch (change.type) {
      case "increase":
        return "text-green-600"
      case "decrease":
        return "text-red-600"
      case "neutral":
        return "text-gray-600"
    }
  }

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader className="pb-2">
          <div className="h-4 bg-muted rounded w-1/2 mb-2" />
          <div className="h-3 bg-muted rounded w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted rounded w-1/3 mb-4" />
          <div className="h-32 bg-muted rounded" />
        </CardContent>
      </Card>
    )
  }

  if (variant === "compact") {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {value && (
              <p className="text-2xl font-bold">{value}</p>
            )}
            {change && (
              <div className={cn("flex items-center text-sm", getTrendColor())}>
                {getTrendIcon()}
                <span className="ml-1">
                  {change.value > 0 ? "+" : ""}{change.value}%
                  {change.period && ` ${change.period}`}
                </span>
              </div>
            )}
          </div>
          {chart && (
            <div className="h-16 w-24">
              {chart}
            </div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </div>
        {actions && actions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={action.onClick}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {value && (
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{value}</div>
              {change && (
                <Badge
                  variant="secondary"
                  className={cn("flex items-center gap-1", getTrendColor())}
                >
                  {getTrendIcon()}
                  {change.value > 0 ? "+" : ""}{change.value}%
                  {change.period && ` ${change.period}`}
                </Badge>
              )}
            </div>
          )}
          {chart && (
            <div className="h-64">
              {chart}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Specialized Chart Cards
interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: "percentage" | "absolute"
  period?: string
  format?: "number" | "currency" | "percentage"
  className?: string
}

export function MetricCard({
  title,
  value,
  change,
  changeType = "percentage",
  period = "vs last month",
  format = "number",
  className
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (format === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(val))
    }
    if (format === "percentage") {
      return `${val}%`
    }
    return val.toLocaleString()
  }

  const getChangeType = (): "increase" | "decrease" | "neutral" => {
    if (!change) return "neutral"
    return change > 0 ? "increase" : change < 0 ? "decrease" : "neutral"
  }

  return (
    <ChartCard
      title={title}
      value={formatValue(value)}
      change={change ? {
        value: Math.abs(change),
        type: getChangeType(),
        period
      } : undefined}
      variant="compact"
      className={className}
    />
  )
}
