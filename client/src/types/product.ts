// Import types and constants from shared workspace
import {
  Product,
  CreateProductData,
  UpdateProductData,
  ProductQuery,
  ProductListResponse,
  Category
} from 'shared/src/types/products.type';

import {
  ProductStatusOptions,
  DefaultCategoryOptions,
  type ProductStatus
} from 'shared/src/constants/product.constants';

// Export all types for backward compatibility
export {
  Product,
  CreateProductData,
  UpdateProductData,
  ProductQuery,
  ProductListResponse,
  Category,
  ProductStatus,
  ProductStatusOptions
};

// Category options interface - should be populated from API call
export interface CategoryOption {
  value: number; // category_id
  label: string; // category name
  slug: string;
  color?: string;
  icon?: string;
}

// For backward compatibility - this should be populated from API
export const ProductCategoryOptions: CategoryOption[] = DefaultCategoryOptions;