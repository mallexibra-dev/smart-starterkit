"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface FormDatepickerProps {
  id: string
  label?: string
  placeholder?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  disabled?: boolean
  error?: string
  className?: string
}

export function FormDatepicker({
  id,
  label,
  placeholder = "Pick a date",
  value,
  onChange,
  disabled = false,
  error,
  className
}: FormDatepickerProps) {
  const [internalValue, setInternalValue] = useState<Date | undefined>(value)

  const handleChange = (date: Date | undefined) => {
    setInternalValue(date)
    onChange?.(date)
  }

  const selectedDate = value || internalValue

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className={cn(error && "text-destructive")}>
          {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              error && "border-destructive focus:ring-destructive"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}