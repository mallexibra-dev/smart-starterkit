import { Toaster as Sonner, ToasterProps } from "sonner"
import { useTheme } from "@/contexts/theme-context"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  const themeValue = theme === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme

  return (
    <Sonner
      theme={themeValue as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "hsl(var(--popover))",
          "--normal-text": "hsl(var(--popover-foreground))",
          "--normal-border": "hsl(var(--border))",
          "--success-bg": "hsl(var(--success))",
          "--success-text": "hsl(var(--success-foreground))",
          "--error-bg": "hsl(var(--destructive))",
          "--error-text": "hsl(var(--destructive-foreground))",
          "--warning-bg": "hsl(var(--warning))",
          "--warning-text": "hsl(var(--warning-foreground))",
          "--info-bg": "hsl(var(--info))",
          "--info-text": "hsl(var(--info-foreground))",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
