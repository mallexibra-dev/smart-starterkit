// Authentication related types

export interface User {
  id: number
  name: string
  email: string
  avatar?: string | null
  role: 'admin' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  email_verified_at?: string | null
  last_login_at?: string | null
  created_at: string
  updated_at?: string | null
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
  expiresIn: number
}

export interface JwtPayload {
  userId: number
  email: string
  role: string
  iat?: number
  exp?: number
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (data: RegisterRequest) => Promise<AuthResponse>
  logout: () => void
  refreshToken: () => Promise<AuthResponse | null>
}

export interface AuthUser {
  id: number
  name: string
  email: string
  role: string
}