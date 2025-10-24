// Client-specific types only
// All shared types should be imported directly from shared package

// Category options interface - should be populated from API call
export interface CategoryOption {
  value: number; // category_id
  label: string; // category name
  slug: string;
  color?: string;
  icon?: string;
}

// For backward compatibility - this should be populated from API
export const ProductCategoryOptions: CategoryOption[] = [];