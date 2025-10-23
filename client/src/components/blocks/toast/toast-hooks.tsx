"use client"

import { useContext } from "react"
import { ToastProvider, useToast } from "./toast-provider"
import type { ToastHelper, CustomToastOptions } from "./types"

// Convenience functions hook - these must be used within components
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

export { ToastProvider, useToast }