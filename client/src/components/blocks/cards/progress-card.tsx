import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProgressCardProps {
  title: string
  value: number
  label?: string
  description?: string
  showPercentage?: boolean
}

export function ProgressCard({ title, value, label, description, showPercentage = true }: ProgressCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{title}</span>
            {showPercentage && (
              <span className="text-sm text-muted-foreground">{value}%</span>
            )}
          </div>
          <Progress value={value} className="w-full" />
          {(label || description) && (
            <div className="flex justify-between text-sm text-muted-foreground">
              {label && <span>{label}</span>}
              {description && <span>{description}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}