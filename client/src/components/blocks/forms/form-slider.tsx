import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormSliderProps {
  id: string
  label?: string
  value?: number[]
  onChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  error?: string
  className?: string
  showValue?: boolean
  valueLabel?: string
}

export function FormSlider({
  id,
  label,
  value = [50],
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  error,
  className,
  showValue = true,
  valueLabel
}: FormSliderProps) {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue)
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        {label && (
          <Label htmlFor={id} className={cn(error && "text-destructive")}>
            {label}
          </Label>
        )}
        {showValue && (
          <span className="text-sm text-muted-foreground">
            {valueLabel || `${value[0]}${min !== 0 || max !== 100 ? ` (${min}-${max})` : "%"}`}
          </span>
        )}
      </div>
      <Slider
        value={value}
        onValueChange={handleChange}
        max={max}
        min={min}
        step={step}
        disabled={disabled}
        className={cn(error && "[&>span]:border-destructive", className)}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}