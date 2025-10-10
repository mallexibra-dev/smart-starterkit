import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, AlertTriangle, Info, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertItem {
  id: string
  type: "success" | "error" | "warning" | "info" | "loading"
  title: string
  message: string
}

interface AlertShowcaseProps {
  alerts: AlertItem[]
}

export function AlertShowcase({ alerts }: AlertShowcaseProps) {
  const alertStyles = {
    success: {
      bg: "bg-green-50 dark:bg-green-950",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-800 dark:text-green-200",
      icon: CheckCircle,
      iconColor: "text-green-600 dark:text-green-400"
    },
    error: {
      bg: "bg-red-50 dark:bg-red-950",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-800 dark:text-red-200",
      icon: AlertCircle,
      iconColor: "text-red-600 dark:text-red-400"
    },
    warning: {
      bg: "bg-orange-50 dark:bg-orange-950",
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-800 dark:text-orange-200",
      icon: AlertTriangle,
      iconColor: "text-orange-600 dark:text-orange-400"
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-950",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-200",
      icon: Info,
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    loading: {
      bg: "bg-gray-50 dark:bg-gray-950",
      border: "border-gray-200 dark:border-gray-800",
      text: "text-gray-800 dark:text-gray-200",
      icon: RefreshCw,
      iconColor: "text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        const styles = alertStyles[alert.type]
        const Icon = styles.icon

        return (
          <Alert
            key={alert.id}
            className={cn(styles.bg, styles.border)}
          >
            {alert.type === "loading" ? (
              <Icon className={cn("h-4 w-4 animate-spin", styles.iconColor)} />
            ) : (
              <Icon className={cn("h-4 w-4", styles.iconColor)} />
            )}
            <AlertDescription className={styles.text}>
              <strong>{alert.title}</strong> {alert.message}
            </AlertDescription>
          </Alert>
        )
      })}
    </div>
  )
}