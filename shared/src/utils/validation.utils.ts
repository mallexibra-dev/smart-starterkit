import type { ZodSchema } from 'zod';

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Validation result type
export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

// Validate data against Zod schema and return formatted result
export function validateData<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: ValidationError[] = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    return {
      success: false,
      errors,
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

// Transform Zod errors to a simple record format
export function transformZodErrors(error: any): Record<string, string> {
  const errors: Record<string, string> = {};

  if (error.issues) {
    error.issues.forEach((issue: any) => {
      const field = issue.path.join('.');
      errors[field] = issue.message;
    });
  }

  return errors;
}

// Check if value is empty (null, undefined, empty string, empty array)
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

// Sanitize string values (trim and remove extra whitespace)
export function sanitizeString(value: string | null | undefined): string | null {
  if (isEmpty(value)) return null;
  return value!.trim().replace(/\s+/g, ' ');
}

// Transform string to URL-friendly slug
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}