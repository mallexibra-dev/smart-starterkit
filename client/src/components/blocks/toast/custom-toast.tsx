"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { defaultConfigs } from "./constants"
import type { CustomToastProps } from "./types"

export function CustomToast({
  type = "success",
  title,
  description,
  icon,
  showIcon = true,
  position = "top-right",
  className,
  style,
  action,
  dismissible = true,
  onClose,
  isVisible = true,
}: CustomToastProps) {
  const config = defaultConfigs[type]

  const finalIcon = icon || config.icon

  const handleAction = () => {
    action?.onClick()
  }

  return (
    <div
      className={cn(
        "min-w-[300px] max-w-md p-4 rounded-lg shadow-lg border",
        config.bgColor,
        config.textColor,
        config.borderColor,
        isVisible ? "animate-in slide-in-from-top-2 fade-in-0 duration-300" : "animate-out slide-out-to-top-2 fade-out-0 duration-300",
        className
      )}
      style={style}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {showIcon && finalIcon && (
          <div className="flex-shrink-0 mt-0.5">
            {finalIcon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-medium text-sm">
              {title}
            </p>
          )}
          {description && (
            <p className="text-sm opacity-90 mt-1">
              {description}
            </p>
          )}

          {/* Action Button */}
          {action && (
            <button
              onClick={handleAction}
              className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        {dismissible && onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-2 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}