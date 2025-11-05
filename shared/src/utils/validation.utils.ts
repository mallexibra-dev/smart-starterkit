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