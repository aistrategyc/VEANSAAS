"use client"

import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  showHome?: boolean
  homeHref?: string
  className?: string
  maxItems?: number
}

export function Breadcrumb({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  showHome = true,
  homeHref = "/",
  className,
  maxItems = 3
}: BreadcrumbProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  React.useEffect(() => {
    setIsCollapsed(items.length > maxItems)
  }, [items.length, maxItems])

  const displayItems = React.useMemo(() => {
    if (!isCollapsed || items.length <= maxItems) {
      return items
    }

    return [
      items[0],
      { label: "...", href: undefined },
      ...items.slice(-(maxItems - 2))
    ]
  }, [items, isCollapsed, maxItems])

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1", className)}>
      <ol className="flex items-center space-x-1 text-sm text-muted-foreground">
        {showHome && (
          <>
            <li>
              <a
                href={homeHref}
                className="flex items-center hover:text-foreground transition-colors"
                aria-label="Home"
              >
                <Home className="h-4 w-4" />
              </a>
            </li>
            {items.length > 0 && (
              <li className="flex items-center text-muted-foreground">
                {separator}
              </li>
            )}
          </>
        )}
        
        {displayItems.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              {item.href && !item.current ? (
                <a
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ) : item.label === "..." ? (
                <button
                  onClick={() => setIsCollapsed(false)}
                  className="hover:text-foreground transition-colors"
                  aria-label="Show all breadcrumbs"
                >
                  {item.label}
                </button>
              ) : (
                <span className={cn(
                  item.current && "text-foreground font-medium"
                )}>
                  {item.label}
                </span>
              )}
            </li>
            {index < displayItems.length - 1 && (
              <li className="flex items-center text-muted-foreground">
                {separator}
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

// Usage example component
export function BreadcrumbExample() {
  const items: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Projects", href: "/projects" },
    { label: "Web Application", href: "/projects/web-app" },
    { label: "Settings", current: true }
  ]

  return <Breadcrumb items={items} />
}