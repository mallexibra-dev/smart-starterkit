"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormInputProps {
  id: string
  label?: string
  placeholder?: string
  type?: "text" | "email" | "password" | "number" | "tel"
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  error?: string
  className?: string
  showTogglePassword?: boolean
}

export function FormInput({
  id,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  disabled = false,
  error,
  className,
  showTogglePassword = false
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [internalValue, setInternalValue] = useState(value || "")

  const isPassword = type === "password"
  const inputType = isPassword && showPassword ? "text" : type

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInternalValue(newValue)
    onChange?.(newValue)
  }

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className={cn(error && "text-destructive")}>
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            error && "border-destructive focus:ring-destructive",
            isPassword && showTogglePassword && "pr-10"
          )}
        />
        {isPassword && showTogglePassword && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={togglePassword}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}