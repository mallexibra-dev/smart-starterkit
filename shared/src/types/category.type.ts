export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  sort_order: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string | null
}

export interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  sort_order?: number
  status?: 'active' | 'inactive'
}

export interface UpdateCategoryData {
  name?: string
  slug?: string
  description?: string
  icon?: string
  color?: string
  sort_order?: number
  status?: 'active' | 'inactive'
}

export interface CategoryListResponse {
  data: Category[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}