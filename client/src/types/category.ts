import type {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  CategoryListResponse
} from 'shared/src/types/category.type'

export interface ApiResponse {
  success: boolean
  message: string
  data: any
}

export type {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  CategoryListResponse
}