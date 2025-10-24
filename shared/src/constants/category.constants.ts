// Sort options for categories
export const CategorySortOptions = {
  NAME: 'name',
  SORT_ORDER: 'sort_order',
  CREATED_AT: 'created_at',
} as const;

export const CategorySortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type CategorySortBy = (typeof CategorySortOptions)[keyof typeof CategorySortOptions];
export type CategorySortOrder = (typeof CategorySortOrder)[keyof typeof CategorySortOrder];

// Default category options for UI (fallback, should be populated from API)
export const DefaultCategoryOptions = [
  { value: 1, label: "Electronics", slug: "electronics", color: "blue", icon: "laptop" },
  { value: 2, label: "Clothing", slug: "clothing", color: "purple", icon: "shirt" },
  { value: 3, label: "Food", slug: "food", color: "green", icon: "apple" },
  { value: 4, label: "Books", slug: "books", color: "orange", icon: "book" },
  { value: 5, label: "Home", slug: "home", color: "brown", icon: "home" },
  { value: 6, label: "Sports", slug: "sports", color: "red", icon: "football" },
  { value: 7, label: "Toys", slug: "toys", color: "pink", icon: "puzzle" },
  { value: 8, label: "Health", slug: "health", color: "teal", icon: "heart" },
  { value: 9, label: "Automotive", slug: "automotive", color: "gray", icon: "car" },
  { value: 10, label: "Other", slug: "other", color: "gray", icon: "package" },
];

// Export ProductCategoryOptions for backward compatibility
export const ProductCategoryOptions = DefaultCategoryOptions;