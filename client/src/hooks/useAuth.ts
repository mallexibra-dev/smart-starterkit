import { useQuery, useMutation } from '@tanstack/react-query'
import { getCurrentUser, login, register, logout, type AuthResponse } from '../services/auth.service'

export const useAuth = () => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<AuthResponse>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const isAuthenticated = !!user?.success && !!user?.data?.user

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
  }
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }, message?: string }
      const msg = error?.response?.data?.message || error?.message || "Login failed"
      throw new Error(msg)
    }
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }, message?: string }
      const msg = error?.response?.data?.message || error?.message || "Registration failed"
      throw new Error(msg)
    }
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }, message?: string }
      const msg = error?.response?.data?.message || error?.message || "Logout failed"
      throw new Error(msg)
    }
  })
}