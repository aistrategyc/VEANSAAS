import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  trend?: "up" | "down"
  change?: string | number
  hint?: string
  className?: string
}

export function KpiCard({
  title,
  value,
  trend,
  change,
  hint,
  className
}: KpiCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null

  return (
    <Card className={cn("p-4", className)}>
      <CardContent className="p-0 space-y-1">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{title}</span>
          {TrendIcon && <TrendIcon className={cn("w-4 h-4", trend === "up" ? "text-green-500" : "text-red-500")} />}
        </div>
        <div className="text-2xl font-bold leading-tight">{value}</div>
        {change && (
          <div className={cn("text-xs", trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "")}>↗ {change}%</div>
        )}
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  )
}
