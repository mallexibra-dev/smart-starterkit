import type { CustomToastOptions } from "./types"

export const defaultConfigs: Record<string, Omit<CustomToastOptions, 'title'>> = {
  success: {
    type: "success",
    duration: 4000,
    position: "top-right",
    className: "bg-green-500 text-white border-green-600",
  },
  error: {
    type: "error",
    duration: 5000,
    position: "top-right",
    className: "bg-red-500 text-white border-red-600",
  },
  warning: {
    type: "warning",
    duration: 4000,
    position: "top-right",
    className: "bg-yellow-500 text-white border-yellow-600",
  },
  info: {
    type: "info",
    duration: 3000,
    position: "top-right",
    className: "bg-blue-500 text-white border-blue-600",
  },
  loading: {
    type: "loading",
    duration: 0,
    position: "top-right",
    className: "bg-gray-500 text-white border-gray-600",
  },
  custom: {
    type: "custom",
    duration: 4000,
    position: "top-right",
    className: "bg-purple-500 text-white border-purple-600",
  },
}

export const TOAST_LIMIT = 5
export const TOAST_REMOVE_DELAY = 1000