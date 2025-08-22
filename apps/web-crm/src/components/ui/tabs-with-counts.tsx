"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

interface TabWithCount {
  value: string
  label: string
  count?: number
  disabled?: boolean
}

interface TabsWithCountsProps {
  tabs: TabWithCount[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  variant?: "default" | "pills" | "underline"
}

export function TabsWithCounts({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
  variant = "default"
}: TabsWithCountsProps) {
  const variantClasses = {
    default: {
      list: "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      trigger: "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
    },
    pills: {
      list: "inline-flex items-center justify-center rounded-full bg-muted p-1 text-muted-foreground",
      trigger: "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
    },
    underline: {
      list: "inline-flex h-10 items-center justify-center bg-transparent text-muted-foreground border-b",
      trigger: "inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary -mb-px"
    }
  }

  const currentVariant = variantClasses[variant]

  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      className={className}
    >
      <TabsPrimitive.List className={currentVariant.list}>
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className={currentVariant.trigger}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={cn(
                "ml-2 rounded-full px-2 py-0.5 text-xs font-medium",
                "bg-muted text-muted-foreground",
                "data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              )}>
                {tab.count}
              </span>
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  )
}

// Usage example
export function TabsWithCountsExample() {
  const tabs: TabWithCount[] = [
    { value: "all", label: "All Tasks", count: 24 },
    { value: "active", label: "Active", count: 8 },
    { value: "completed", label: "Completed", count: 16 },
    { value: "archived", label: "Archived", count: 0 }
  ]

  return (
    <TabsWithCounts
      tabs={tabs}
      defaultValue="all"
      variant="pills"
    />
  )
}
