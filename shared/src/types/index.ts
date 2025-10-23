// Re-export base API response type from products.type
export type { BaseApiResponse, ApiResponseWithData } from './products.type';

// Legacy ApiResponse type for backward compatibility
export type ApiResponse = {
  data?: any;
  message: string;
  success: boolean;
}

// Re-export category types
export type { Category, CreateCategoryData, UpdateCategoryData, CategoryListResponse } from './category.type';

// Re-export product types
export type {
  Product,
  CreateProductData,
  UpdateProductData,
  RestockProductData,
  ProductQuery,
  CategoryParams,
  ProductListResponse,
  ProductStats,
  CategoryStats
} from './products.type';
