import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormCheckboxProps {
  id: string
  label?: string
  description?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  error?: string
  className?: string
}

export function FormCheckbox({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  error,
  className
}: FormCheckboxProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
        <div className="grid gap-1.5 leading-none">
          {label && (
            <Label
              htmlFor={id}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
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
      </div>
      {error && (
        <p className="text-sm text-destructive ml-6">{error}</p>
      )}
    </div>
  )
}