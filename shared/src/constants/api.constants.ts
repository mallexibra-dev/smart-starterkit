// API Response Messages
export const ApiMessages = {
  SUCCESS: {
    CREATE: 'Data created successfully',
    UPDATE: 'Data updated successfully',
    DELETE: 'Data deleted successfully',
    GET: 'Data retrieved successfully',
    LIST: 'Data list retrieved successfully',
  },
  ERROR: {
    NOT_FOUND: 'Data not found',
    VALIDATION: 'Validation failed',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    INTERNAL: 'Internal server error',
    DUPLICATE: 'Data already exists',
  },
} as const;

// HTTP Status Codes
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API Endpoints
export const ApiEndpoints = {
  PRODUCTS: {
    BASE: '/api/products',
    BY_ID: (id: number) => `/api/products/${id}`,
    STATS: '/api/products/stats',
    RESTOCK: (id: number) => `/api/products/${id}/restock`,
  },
  CATEGORIES: {
    BASE: '/api/categories',
    BY_ID: (id: number) => `/api/categories/${id}`,
    STATS: '/api/categories/stats',
    UPDATE_ORDER: '/api/categories/update-order',
  },
} as const;

// Request Headers
export const ApiHeaders = {
  AUTHORIZATION: 'Authorization',
  BEARER_PREFIX: 'Bearer ',
  CONTENT_TYPE: 'Content-Type',
  APPLICATION_JSON: 'application/json',
} as const;