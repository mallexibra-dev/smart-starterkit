export type ApiResponse = {
  data?: any;
  message: string;
  success: boolean;
}

// Re-export category types
export type { Category, CreateCategoryData, UpdateCategoryData, CategoryListResponse } from './category.type';
