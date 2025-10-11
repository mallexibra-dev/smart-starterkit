"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, X } from "lucide-react"

interface MultiSelectOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface FormMultiSelectProps {
  id: string
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  options: MultiSelectOption[]
  value?: string[]
  onChange?: (values: string[]) => void
  disabled?: boolean
  error?: string
  className?: string
  maxDisplayItems?: number
  emptyMessage?: string
  searchable?: boolean
  showSelectAll?: boolean
}

export function FormMultiSelect({
  id,
  label,
  placeholder = "Select options...",
  searchPlaceholder = "Search options...",
  options,
  value,
  onChange,
  disabled = false,
  error,
  className,
  maxDisplayItems = 3,
  emptyMessage = "No options available.",
  searchable = true,
  showSelectAll = true
}: FormMultiSelectProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<string[]>(value || [])
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const currentValue = isControlled ? value : internalValue

  const filteredOptions = useMemo(() =>
    options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [options, searchTerm]
  )

  const selectedOptions = useMemo(() =>
    options.filter(option => currentValue.includes(option.value)), [options, currentValue]
  )

  const handleSelect = useCallback((optionValue: string) => {
    const newValue = currentValue.includes(optionValue)
      ? currentValue.filter(v => v !== optionValue)
      : [...currentValue, optionValue]

    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }, [currentValue, isControlled, onChange])

  const handleSelectAll = useCallback(() => {
    const filteredValues = filteredOptions
      .filter(option => !option.disabled)
      .map(option => option.value)

    const allSelected = filteredValues.every(val => currentValue.includes(val))
    const newValue = allSelected
      ? currentValue.filter(v => !filteredValues.includes(v))
      : [...new Set([...currentValue, ...filteredValues])]

    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }, [filteredOptions, currentValue, isControlled, onChange])

  const handleRemove = useCallback((optionValue: string) => {
    const newValue = currentValue.filter(v => v !== optionValue)
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }, [currentValue, isControlled, onChange])

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setInternalValue([])
    }
    onChange?.([])
  }, [isControlled, onChange])

  const isAllSelected = useMemo(() =>
    filteredOptions
      .filter(option => !option.disabled)
      .every(option => currentValue.includes(option.value)), [filteredOptions, currentValue]
  )

  const isIndeterminate = useMemo(() =>
    filteredOptions
      .filter(option => !option.disabled)
      .some(option => currentValue.includes(option.value)) && !isAllSelected, [filteredOptions, currentValue, isAllSelected]
  )

  useEffect(() => {
    if (open && searchable) {
      const timer = requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
      return () => cancelAnimationFrame(timer)
    }
  }, [open, searchable])

  useEffect(() => {
    if (isControlled && value !== undefined) {
      setInternalValue(value)
    }
  }, [value, isControlled])

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label htmlFor={id} className={cn(error && "text-destructive")}>
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between text-left font-normal h-auto py-2",
              currentValue.length === 0 && "text-muted-foreground",
              error && "border-destructive focus:ring-destructive"
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {currentValue.length === 0 ? (
                <span>{placeholder}</span>
              ) : (
                <>
                  {selectedOptions.slice(0, maxDisplayItems).map((option) => (
                    <Badge
                      key={option.value}
                      variant="secondary"
                      className="mr-1 mb-1"
                    >
                      {option.label}
                      {!disabled && (
                        <span
                          className="ml-1 hover:text-destructive cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemove(option.value)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </span>
                      )}
                    </Badge>
                  ))}
                  {selectedOptions.length > maxDisplayItems && (
                    <Badge variant="secondary" className="mr-1 mb-1">
                      +{selectedOptions.length - maxDisplayItems} more
                    </Badge>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {currentValue.length > 0 && !disabled && (
                <span
                  className="hover:text-destructive cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                >
                  <X className="h-4 w-4" />
                </span>
              )}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command>
            {searchable && (
              <CommandInput
                ref={inputRef}
                placeholder={searchPlaceholder}
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="border-0 focus:ring-0"
              />
            )}

            <CommandList>
              {showSelectAll && filteredOptions.length > 0 && (
                <div className="flex items-center p-2 border-b">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                  <span className="ml-2 text-sm font-medium">
                    {isAllSelected ? "Deselect All" : "Select All"}
                  </span>
                </div>
              )}

              <CommandEmpty>{emptyMessage}</CommandEmpty>

              {filteredOptions.map((option) => {
                const isSelected = currentValue.includes(option.value)

                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    disabled={option.disabled}
                    className="flex cursor-pointer"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <Checkbox
                        checked={isSelected}
                        disabled={option.disabled}
                        onCheckedChange={() => handleSelect(option.value)}
                        aria-label={`Select ${option.label}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="ml-2 flex-1 min-w-0">
                        <div className={cn(
                          "font-medium truncate",
                          option.disabled && "opacity-50"
                        )}>
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-sm text-muted-foreground truncate">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="ml-2 h-4 w-4 flex-shrink-0" />
                    )}
                  </CommandItem>
                )
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}