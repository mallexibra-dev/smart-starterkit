import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormSwitchProps {
  id: string
  label?: string
  description?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  error?: string
  className?: string
}

export function FormSwitch({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  error,
  className
}: FormSwitchProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          {label && (
            <Label
              htmlFor={id}
              className={cn(
                "text-base font-medium",
                error && "text-destructive"
              )}
            >
              {label}
            </Label>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}