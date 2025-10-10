"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Image as ImageIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  id: string
  label?: string
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in MB
  value?: File[]
  onChange?: (files: File[]) => void
  disabled?: boolean
  error?: string
  className?: string
  fileTypes?: "all" | "image" | "document"
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) {
    return ImageIcon
  }
  return FileText
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function FormFileUpload({
  id,
  label,
  accept,
  multiple = false,
  maxFiles = 5,
  maxSize = 10,
  value = [],
  onChange,
  disabled = false,
  error,
  className,
  fileTypes = "all"
}: FileUploadProps) {
  const [internalFiles, setInternalFiles] = useState<File[]>(value)
  const [isDragging, setIsDragging] = useState(false)

  const files = value || internalFiles

  const getAcceptedTypes = () => {
    switch (fileTypes) {
      case "image":
        return "image/*"
      case "document":
        return ".pdf,.doc,.docx,.xls,.xlsx,.txt"
      default:
        return accept || "*/*"
    }
  }

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const filesArray = Array.from(selectedFiles)
    const validFiles: File[] = []

    for (const file of filesArray) {
      if (file.size > maxSize * 1024 * 1024) {
        continue
      }
      validFiles.push(file)
    }

    if (multiple) {
      const newFiles = [...files, ...validFiles].slice(0, maxFiles)
      setInternalFiles(newFiles)
      onChange?.(newFiles)
    } else {
      setInternalFiles(validFiles.slice(0, 1))
      onChange?.(validFiles.slice(0, 1))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setInternalFiles(newFiles)
    onChange?.(newFiles)
  }

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label htmlFor={id} className={cn(error && "text-destructive")}>
          {label}
        </Label>
      )}
      <div
        className={cn(
          "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center transition-colors",
          isDragging && "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-destructive"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <div className="mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById(`file-input-${id}`)?.click()}
            disabled={disabled}
          >
            Choose Files
          </Button>
          <input
            id={`file-input-${id}`}
            type="file"
            className="hidden"
            accept={getAcceptedTypes()}
            multiple={multiple}
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={disabled}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Drag and drop files here, or click to select
            {fileTypes === "image" && " (Images only)"}
            {fileTypes === "document" && " (Documents only)"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Max {maxFiles} files, {maxSize}MB each
          </p>
        </div>
      </div>
      {files.length > 0 && (
        <div className="mt-2 space-y-2">
          {files.map((file, index) => {
            const Icon = getFileIcon(file.type)
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="truncate max-w-[200px] text-gray-900 dark:text-gray-100">{file.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}