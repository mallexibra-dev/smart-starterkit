import { ReactNode } from "react"

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
  icon?: ReactNode
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

export interface Toast extends CustomToastOptions {
  id: string
  timestamp: number
}

export interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: CustomToastOptions) => string
  removeToast: (id: string) => void
  clearToasts: () => void
}

export type ToastHelper = {
  success: (title: string, description?: string, options?: Partial<CustomToastOptions>) => string
  error: (title: string, description?: string, options?: Partial<CustomToastOptions>) => string
  warning: (title: string, description?: string, options?: Partial<CustomToastOptions>) => string
  info: (title: string, description?: string, options?: Partial<CustomToastOptions>) => string
  loading: (title: string, description?: string, options?: Partial<CustomToastOptions>) => string
  custom: (title: string, description?: string, options?: Partial<CustomToastOptions>) => string
}

export interface ToastStackProps {
  position: ToastPosition
  toasts: Toast[]
  onRemove: (id: string) => void
}

export interface ToastItemProps {
  toast: Toast
  onClose: () => void
  style?: React.CSSProperties
}