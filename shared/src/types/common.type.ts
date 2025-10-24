// Common shared types
// Add your shared types here

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SearchParams {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface BaseQueryParams extends PaginationParams, SearchParams {}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  updatedAt: string | null
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  role?: 'admin' | 'user'
}

export interface UpdateUserData {
  name?: string
  email?: string
  role?: 'admin' | 'user'
  status?: 'active' | 'inactive' | 'suspended'
}