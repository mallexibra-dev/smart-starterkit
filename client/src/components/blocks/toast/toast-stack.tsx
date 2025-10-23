"use client"

import { defaultConfigs } from "./constants"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ToastStackProps, ToastItemProps, ToastPosition } from "./types"

export function ToastStack({ position, toasts, onRemove }: ToastStackProps) {
  const getPositionClasses = (position: ToastPosition) => {
    switch (position) {
      case "top-left":
        return "fixed top-4 left-4 z-50 flex flex-col-reverse gap-2"
      case "top-right":
        return "fixed top-4 right-4 z-50 flex flex-col-reverse gap-2"
      case "top-center":
        return "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col-reverse gap-2"
      case "bottom-left":
        return "fixed bottom-4 left-4 z-50 flex flex-col gap-2"
      case "bottom-right":
        return "fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      case "bottom-center":
        return "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2"
      default:
        return "fixed top-4 right-4 z-50 flex flex-col-reverse gap-2"
    }
  }

  if (toasts.length === 0) return null

  return (
    <div className={getPositionClasses(position)}>
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => onRemove(toast.id)}
          style={{
            ...toast.style,
            // Add proper stacking index for newer toasts
            zIndex: 50 + index,
          }}
        />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose, style }: ToastItemProps) {
  const config = defaultConfigs[toast.type || "success"]
  const finalIcon = toast.icon || config.icon

  const handleAction = () => {
    toast.action?.onClick()
  }

  return (
    <div
      className={cn(
        "min-w-[320px] max-w-md p-4 rounded-lg shadow-xl border backdrop-blur-sm",
        config.bgColor,
        config.textColor,
        config.borderColor,
        "animate-in slide-in-from-right-2 fade-in-0 duration-300",
        "hover:shadow-2xl transition-all duration-200",
        toast.className
      )}
      style={{
        ...style,
        // Better styling for stacking
        marginBottom: toast.position?.includes("top") ? "8px" : undefined,
        marginTop: toast.position?.includes("bottom") ? "8px" : undefined,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {toast.showIcon !== false && finalIcon && (
          <div className="flex-shrink-0 mt-0.5">
            {finalIcon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="font-semibold text-sm leading-tight">
              {toast.title}
            </p>
          )}
          {toast.description && (
            <p className="text-sm opacity-90 mt-1 leading-relaxed">
              {toast.description}
            </p>
          )}

          {/* Action Button */}
          {toast.action && (
            <button
              onClick={handleAction}
              className="mt-3 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded transition-all"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        {toast.dismissible !== false && onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-2 text-white/80 hover:text-white hover:bg-white/20 rounded p-1 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}