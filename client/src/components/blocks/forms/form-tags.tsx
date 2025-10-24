"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormTagsProps {
  id: string
  label?: string
  placeholder?: string
  value?: string[]
  onChange?: (tags: string[]) => void
  disabled?: boolean
  error?: string
  className?: string
}

export function FormTags({
  id,
  label,
  placeholder = "Add a tag...",
  value = [],
  onChange,
  disabled = false,
  error,
  className
}: FormTagsProps) {
  const [newTag, setNewTag] = useState("")
  const [internalTags, setInternalTags] = useState<string[]>(value)

  const handleAddTag = () => {
    if (newTag.trim() && !internalTags.includes(newTag.trim())) {
      const updatedTags = [...internalTags, newTag.trim()]
      setInternalTags(updatedTags)
      onChange?.(updatedTags)
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = internalTags.filter(tag => tag !== tagToRemove)
    setInternalTags(updatedTags)
    onChange?.(updatedTags)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const tags = value || internalTags

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label htmlFor={id} className={cn(error && "text-destructive")}>
          {label}
        </Label>
      )}
      <div className="flex gap-2">
        <Input
          id={id}
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(error && "border-destructive focus:ring-destructive")}
        />
        <Button
          type="button"
          onClick={handleAddTag}
          disabled={disabled}
          size="sm"
        >
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className={cn("flex items-center gap-1", disabled && "opacity-50")}
          >
            {tag}
            {!disabled && (
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => handleRemoveTag(tag)}
              />
            )}
          </Badge>
        ))}
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}