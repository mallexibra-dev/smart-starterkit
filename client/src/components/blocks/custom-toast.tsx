"use client"

import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Toast types
export type ToastType = "success" | "error" | "warning" | "info" | "loading" | "custom"

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center"

export interface CustomToastOptions {
  type?: ToastType
  title?: string
  description?: string
  icon?: React.ReactNode
  showIcon?: boolean
  duration?: number
  position?: ToastPosition
  className?: string
  style?: React.CSSProperties
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
}

export interface CustomToastProps extends CustomToastOptions {
  onClose?: () => void
  isVisible?: boolean
}

// Default configurations for different toast types
const defaultConfigs = {
  success: {
    bgColor: "bg-green-500",
    textColor: "text-white",
    borderColor: "border-green-600",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  error: {
    bgColor: "bg-red-500",
    textColor: "text-white",
    borderColor: "border-red-600",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  warning: {
    bgColor: "bg-yellow-500",
    textColor: "text-white",
    borderColor: "border-yellow-600",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  info: {
    bgColor: "bg-blue-500",
    textColor: "text-white",
    borderColor: "border-blue-600",
    icon: <Info className="h-4 w-4" />,
  },
  loading: {
    bgColor: "bg-gray-500",
    textColor: "text-white",
    borderColor: "border-gray-600",
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
  },
  custom: {
    bgColor: "bg-purple-500",
    textColor: "text-white",
    borderColor: "border-purple-600",
    icon: null,
  },
}

// Position classes mapping
const positionClasses: Record<ToastPosition, string> = {
  "top-left": "fixed top-4 left-4 z-50",
  "top-right": "fixed top-4 right-4 z-50",
  "top-center": "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
  "bottom-left": "fixed bottom-4 left-4 z-50",
  "bottom-right": "fixed bottom-4 right-4 z-50",
  "bottom-center": "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
}

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
        positionClasses[position],
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

// Toast Hook for managing toasts
export interface Toast extends CustomToastOptions {
  id: string
  timestamp: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: CustomToastOptions) => string
  removeToast: (id: string) => void
  clearToasts: () => void
}

import { createContext, useContext, useState, useCallback } from "react"

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: CustomToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      timestamp: Date.now(),
      duration: toast.duration || 4000,
      position: toast.position || "top-right",
    }

    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Group toasts by position for proper stacking
  const groupedToasts = toasts.reduce((acc, toast) => {
    const position = toast.position || "top-right"
    if (!acc[position]) {
      acc[position] = []
    }
    acc[position].push(toast)
    return acc
  }, {} as Record<ToastPosition, Toast[]>)

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <ToastStack
          key={position}
          position={position as ToastPosition}
          toasts={positionToasts}
          onRemove={removeToast}
        />
      ))}
    </ToastContext.Provider>
  )
}

// Toast Stack Component for proper positioning and stacking
interface ToastStackProps {
  position: ToastPosition
  toasts: Toast[]
  onRemove: (id: string) => void
}

function ToastStack({ position, toasts, onRemove }: ToastStackProps) {
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

// Individual Toast Item Component
interface ToastItemProps {
  toast: Toast
  onClose: () => void
  style?: React.CSSProperties
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

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Convenience functions hook - these must be used within components
export type ToastHelper = {
  success: (title: string, description?: string, options?: Partial<CustomToastOptions>) => string
  error: (title: string, description?: string, options?: Partial<CustomToastOptions>) => string
  warning: (title: string, description?: string, options?: Partial<CustomToastOptions>) => string
  info: (title: string, description?: string, options?: Partial<CustomToastOptions>) => string
  loading: (title: string, description?: string, options?: Partial<CustomToastOptions>) => string
  custom: (title: string, description?: string, options?: Partial<CustomToastOptions>) => string
}

// Export a hook that returns the convenience functions
export function useToastHelpers(): ToastHelper {
  const { addToast } = useToast()

  return {
    success: (title: string, description?: string, options?: Partial<CustomToastOptions>) =>
      addToast({ type: "success", title, description, ...options }),
    error: (title: string, description?: string, options?: Partial<CustomToastOptions>) =>
      addToast({ type: "error", title, description, ...options }),
    warning: (title: string, description?: string, options?: Partial<CustomToastOptions>) =>
      addToast({ type: "warning", title, description, ...options }),
    info: (title: string, description?: string, options?: Partial<CustomToastOptions>) =>
      addToast({ type: "info", title, description, ...options }),
    loading: (title: string, description?: string, options?: Partial<CustomToastOptions>) =>
      addToast({ type: "loading", title, description, duration: 0, ...options }),
    custom: (title: string, description?: string, options?: Partial<CustomToastOptions>) =>
      addToast({ type: "custom", title, description, ...options }),
  }
}