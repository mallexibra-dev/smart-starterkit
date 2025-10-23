const ProductStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
} as const

const CategoryStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus]
export type CategoryStatus = (typeof CategoryStatus)[keyof typeof CategoryStatus]

export { ProductStatus, CategoryStatus }