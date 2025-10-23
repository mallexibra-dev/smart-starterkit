export const ProductStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
} as const;

export const CategoryStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];
export type CategoryStatus = (typeof CategoryStatus)[keyof typeof CategoryStatus];

// Product status options for UI
export const ProductStatusOptions: { value: ProductStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'draft', label: 'Draft', color: 'yellow' },
  { value: 'archived', label: 'Archived', color: 'red' },
];

// Category status options for UI
export const CategoryStatusOptions: { value: CategoryStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
];

// Default pagination settings
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// Sort options for products
export const ProductSortOptions = {
  NAME: 'name',
  PRICE: 'price',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
} as const;

export const ProductSortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type ProductSortBy = (typeof ProductSortOptions)[keyof typeof ProductSortOptions];
export type ProductSortOrder = (typeof ProductSortOrder)[keyof typeof ProductSortOrder];