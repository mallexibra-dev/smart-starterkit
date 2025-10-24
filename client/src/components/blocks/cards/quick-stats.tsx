import { cn } from "@/lib/utils"

interface QuickStatProps {
  icon: React.ReactNode
  label: string
  value: string | number
  variant?: "blue" | "green" | "purple" | "orange"
}

export function QuickStat({ icon, label, value, variant = "blue" }: QuickStatProps) {
  const variantStyles = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950",
      text: "text-blue-900 dark:text-blue-100",
      icon: "text-blue-600 dark:text-blue-400"
    },
    green: {
      bg: "bg-green-50 dark:bg-green-950",
      text: "text-green-900 dark:text-green-100",
      icon: "text-green-600 dark:text-green-400"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950",
      text: "text-purple-900 dark:text-purple-100",
      icon: "text-purple-600 dark:text-purple-400"
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-950",
      text: "text-orange-900 dark:text-orange-100",
      icon: "text-orange-600 dark:text-orange-400"
    }
  }

  const styles = variantStyles[variant]

  return (
    <div className={cn("p-4 rounded-lg border border-border", styles.bg)}>
      <div className="flex items-center gap-2 mb-2">
        <div className={styles.icon}>{icon}</div>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <p className={cn("text-2xl font-bold", styles.text)}>{value}</p>
    </div>
  )
}