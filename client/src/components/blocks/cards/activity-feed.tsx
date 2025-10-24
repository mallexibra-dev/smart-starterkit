import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: string
  variant: "success" | "info" | "warning" | "error"
}

interface ActivityFeedProps {
  activities: ActivityItem[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const variantColors = {
    success: "bg-green-50 text-green-600",
    info: "bg-blue-50 text-blue-600",
    warning: "bg-orange-50 text-orange-600",
    error: "bg-red-50 text-red-600"
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={cn("p-1 rounded-full", variantColors[activity.variant])}>
                <div className="w-2 h-2 bg-current rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}