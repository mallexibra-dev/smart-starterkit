import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatusCardProps {
  title: string
  status: string
  description: string
  icon: React.ReactNode
  variant?: "success" | "warning" | "error" | "info"
}

export function StatusCard({ title, status, description, icon, variant = "success" }: StatusCardProps) {
  const variantStyles = {
    success: {
      bg: "bg-green-50",
      text: "text-green-600",
      iconBg: "bg-green-50"
    },
    warning: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      iconBg: "bg-orange-50"
    },
    error: {
      bg: "bg-red-50",
      text: "text-red-600",
      iconBg: "bg-red-50"
    },
    info: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      iconBg: "bg-blue-50"
    }
  }

  const styles = variantStyles[variant]

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", styles.iconBg)}>
            {icon}
          </div>
          <div>
            <p className="font-medium">{title}</p>
            <p className={cn("text-lg font-bold", styles.text)}>{status}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}