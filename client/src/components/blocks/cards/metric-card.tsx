import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
}

export function MetricCard({ title, value, change, changeLabel, icon, trend = "neutral" }: MetricCardProps) {
  const trendIcon = trend === "up" ? <TrendingUp className="h-4 w-4" /> :
                   trend === "down" ? <TrendingDown className="h-4 w-4" /> : null

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-lg", {
              "bg-blue-50": trend === "neutral",
              "bg-green-50": trend === "up",
              "bg-red-50": trend === "down"
            })}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {trendIcon}
              <span className={cn("text-sm font-medium", {
                "text-green-600": trend === "up",
                "text-red-600": trend === "down",
                "text-gray-600": trend === "neutral"
              })}>
                {change > 0 ? "+" : ""}{change}%
              </span>
            </div>
          )}
        </div>
        {changeLabel && (
          <p className="text-xs text-muted-foreground mt-2">{changeLabel}</p>
        )}
      </CardContent>
    </Card>
  )
}