# Shared Package Development Rules

## 🎯 Purpose & Scope

### What Shared Package Contains
- **Type definitions** for data structures
- **Validation schemas** using Zod
- **Utility functions** for common operations
- **Constants** and enums used across packages

### What Shared Package DOES NOT Contain
- **NO component logic** - belongs to client
- **NO API logic** - belongs to server
- **NO environment-specific** code
- **Package-specific** implementations

## 📁 File Organization

### Directory Structure
```
shared/src/
├── types/           # TypeScript type definitions
├── validation/      # Zod validation schemas
├── utils/          # Shared utility functions
├── constants/      # Shared constants and enums
└── index.ts        # Main export file
```

### ✅ Correct File Placement
- **Types**: Only in `src/types/`
- **Validation**: Only in `src/validation/`
- **Utils**: Only in `src/utils/`
- **Constants**: Only in `src/constants/`

### ❌ Incorrect Placement
- **NO implementation logic** for client or server
- **NO environment-specific** configurations
- **NO external dependencies** that are platform-specific
- **NO duplicate definitions**

## 📝 Naming Conventions

### File Naming
- **Types**: `{resource}.type.ts` (e.g., `user.type.ts`)
- **Validation**: `{resource}.validation.ts` (e.g., `user.validation.ts`)
- **Utils**: `{name}.util.ts` or `{name}.ts` (e.g., `date.util.ts`)
- **Constants**: `{domain}.constants.ts` (e.g., `api.constants.ts`)

### Type Naming
- **PascalCase** for interfaces and types
- **Descriptive names** with clear purpose
- **Consistent prefixes** for related types
- **Generic types** with meaningful parameter names

## 🔧 Type Definitions

### Interface Patterns
```typescript
// user.type.ts
export interface User {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Generic Type Patterns
```typescript
// api.type.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}
```

## ✅ Validation Schemas

### Zod Schema Patterns
```typescript
// user.validation.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
});

export const userIdSchema = z.object({
  id: z.number().int().positive('ID must be a positive integer'),
});

// Types can be inferred from schemas
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
```

### Validation Best Practices
- **Reuse schemas** between client and server
- **Descriptive error messages** for better UX
- **Chaining validation** for complex rules
- **Custom validation** functions when needed

## 🔧 Utility Functions

### Date/Time Utilities
```typescript
// date.util.ts
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isDateInPast = (date: Date): boolean => {
  return date < new Date();
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
```

### String Utilities
```typescript
// string.util.ts
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const truncate = (str: string, length: number): string => {
  return str.length > length ? `${str.slice(0, length)}...` : str;
};
```

## 📊 Constants & Enums

### API Constants
```typescript
// api.constants.ts
export const API_ENDPOINTS = {
  USERS: '/api/users',
  AUTH: '/api/auth',
  HEALTH: '/api/health',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
```

### Application Enums
```typescript
// status.enum.ts
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}
```

## 📦 Export Management

### Main Index File
```typescript
// index.ts
// Types
export * from './types/user.type';
export * from './types/api.type';

// Validation
export * from './validation/user.validation';
export * from './validation/auth.validation';

// Utils
export * from './utils/date.util';
export * from './utils/string.util';

// Constants
export * from './constants/api.constants';
export * from './constants/status.enum';
```

### Workspace Usage
```typescript
// In client or server
import { User, CreateUserSchema } from 'shared';
// OR
import { User, CreateUserSchema } from 'shared/src/types/user.type';
import { createUserSchema } from 'shared/src/validation/user.validation';
```

## 🔍 Quality Standards

### TypeScript Rules
- **Strict typing** for all exports
- **Proper generics** with constraints
- **Consistent interfaces** across types
- **Documentation** for complex types

### Validation Rules
- **Single source of truth** for validation
- **Reusable schemas** across applications
- **Custom error messages** for better UX
- **Type inference** from schemas when possible

### Testing Considerations
- **Pure functions** for utilities
- **Testable schemas** with various inputs
- **Edge cases** covered in validation
- **Type safety** verified

## 🚀 Development Workflow

1. **Define types** first for data structures
2. **Create validation** schemas that match types
3. **Add utilities** for common operations
4. **Define constants** for shared values
5. **Update exports** in main index file
6. **Test imports** in both client and server
7. **Document complex** types or validation rules

## 📋 Quality Checklist

Before completing shared package tasks:
- [ ] Types are properly typed with TypeScript
- [ ] Validation schemas match type definitions
- [ ] Utilities are pure and testable
- [ ] Constants are well-organized
- [ ] Exports are properly configured
- [ ] No platform-specific code included
- [ ] Documentation added for complex logic
- [ ] Imports work in both client and server
- [ ] No duplicate definitions
- [ ] Naming conventions followed

**Shared package must remain platform-agnostic!** 🚀