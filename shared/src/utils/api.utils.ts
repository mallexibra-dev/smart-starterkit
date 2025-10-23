import { ApiMessages, HttpStatus } from '../constants/api.constants';

// Standard API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

// Success response helper
export function createSuccessResponse<T>(
  data?: T,
  message: string = ApiMessages.SUCCESS.GET
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

// Error response helper
export function createErrorResponse(
  message: string = ApiMessages.ERROR.INTERNAL,
  errors?: any
): ApiResponse {
  return {
    success: false,
    message,
    errors,
  };
}

// Not found response helper
export function createNotFoundResponse(message: string = ApiMessages.ERROR.NOT_FOUND): ApiResponse {
  return {
    success: false,
    message,
  };
}

// Validation error response helper
export function createValidationErrorResponse(errors: any): ApiResponse {
  return {
    success: false,
    message: ApiMessages.ERROR.VALIDATION,
    errors,
  };
}

// Unauthorized response helper
export function createUnauthorizedResponse(): ApiResponse {
  return {
    success: false,
    message: ApiMessages.ERROR.UNAUTHORIZED,
  };
}

// Forbidden response helper
export function createForbiddenResponse(): ApiResponse {
  return {
    success: false,
    message: ApiMessages.ERROR.FORBIDDEN,
  };
}

// Check if response is successful
export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true } {
  return response.success === true;
}

// Extract error message from API response
export function getErrorMessage(response: ApiResponse): string {
  return response.message || ApiMessages.ERROR.INTERNAL;
}