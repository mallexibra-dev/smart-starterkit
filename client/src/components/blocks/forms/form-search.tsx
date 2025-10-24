"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormSearchProps {
  id: string
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onClear?: () => void
  disabled?: boolean
  error?: string
  className?: string
  showClearButton?: boolean
  debounceMs?: number
}

export function FormSearch({
  id,
  label,
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  onClear,
  disabled = false,
  error,
  className,
  showClearButton = true,
  debounceMs = 300
}: FormSearchProps) {
  const [internalValue, setInternalValue] = useState(value)
  const [isSearching, setIsSearching] = useState(false)

  const currentValue = value || internalValue

  const handleChange = (newValue: string) => {
    setInternalValue(newValue)
    onChange?.(newValue)

    // Debounce search
    if (debounceMs > 0) {
      setIsSearching(true)
      setTimeout(() => {
        setIsSearching(false)
        onSearch?.(newValue)
      }, debounceMs)
    } else {
      onSearch?.(newValue)
    }
  }

  const handleClear = () => {
    setInternalValue("")
    onChange?.("")
    onClear?.()
    onSearch?.("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onSearch?.(currentValue)
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label htmlFor={id} className={cn(error && "text-destructive")}>
          {label}
        </Label>
      )}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          type="text"
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pl-10 pr-10",
            error && "border-destructive focus:ring-destructive",
            isSearching && "animate-pulse"
          )}
        />
        {showClearButton && currentValue && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}