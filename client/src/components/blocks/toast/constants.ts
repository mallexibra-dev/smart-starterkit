import { CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react"
import type { ToastType, ToastPosition } from "./types"

export const defaultConfigs = {
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
} as const

export const positionClasses: Record<ToastPosition, string> = {
  "top-left": "fixed top-4 left-4 z-50",
  "top-right": "fixed top-4 right-4 z-50",
  "top-center": "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
  "bottom-left": "fixed bottom-4 left-4 z-50",
  "bottom-right": "fixed bottom-4 right-4 z-50",
  "bottom-center": "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
}