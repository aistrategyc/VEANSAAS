import React from "react"
import { cn } from "@/lib/utils"

interface HeadingProps {
  children: React.ReactNode
  level?: 1 | 2 | 3
  className?: string
}

export function Heading({ children, level = 1, className }: HeadingProps) {
  const Tag: React.ElementType = `h${level}` // 💡 безопасная альтернатива JSX.IntrinsicElements

  const sizes = {
    1: "text-3xl font-bold",
    2: "text-2xl font-semibold",
    3: "text-xl font-medium",
  }

  return <Tag className={cn(sizes[level], className)}>{children}</Tag>
}