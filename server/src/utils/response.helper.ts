import type { Context } from 'hono';

export interface ResponseData<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedData<T = any> {
  data: T[];
  pagination: PaginationData;
}

export class ResponseHelper {
  /**
   * Success response with data (including paginated data)
   */
  static success<T>(
    c: Context,
    message: string,
    data?: T,
    status: number = 200
  ) {
    const response: ResponseData<T> = {
      success: true,
      message,
      data,
    };

    return c.json(response, status as any);
  }

  /**
   * Error response
   */
  static error(
    c: Context,
    message: string,
    status: number = 500,
    error?: string
  ) {
    const response: ResponseData = {
      success: false,
      message,
    };

    if (error) {
      response.error = error;
    }

    return c.json(response, status as any);
  }

  /**
   * Validation error response (400)
   */
  static validationError(
    c: Context,
    message: string = 'Validation failed',
    errors?: any
  ) {
    const response: ResponseData = {
      success: false,
      message,
      error: errors ? JSON.stringify(errors) : undefined,
    };

    return c.json(response, 400);
  }

  /**
   * Not found error response (404)
   */
  static notFound(
    c: Context,
    resource: string = 'Resource'
  ) {
    return this.error(c, `${resource} not found`, 404);
  }

  /**
   * Bad request error response (400)
   */
  static badRequest(
    c: Context,
    message: string = 'Bad request'
  ) {
    return this.error(c, message, 400);
  }

  /**
   * Unauthorized error response (401)
   */
  static unauthorized(
    c: Context,
    message: string = 'Unauthorized'
  ) {
    return this.error(c, message, 401);
  }

  /**
   * Forbidden error response (403)
   */
  static forbidden(
    c: Context,
    message: string = 'Forbidden'
  ) {
    return this.error(c, message, 403);
  }

  /**
   * Created response (201)
   */
  static created<T>(
    c: Context,
    message: string = 'Resource created successfully',
    data?: T
  ) {
    return this.success(c, message, data, 201);
  }

  /**
   * Conflict error response (409)
   */
  static conflict(
    c: Context,
    message: string = 'Resource already exists'
  ) {
    return this.error(c, message, 409);
  }

  /**
   * Server error response (500)
   */
  static serverError(
    c: Context,
    message: string = 'Internal server error'
  ) {
    return this.error(c, message, 500);
  }
}