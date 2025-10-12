import { Context } from "hono";

// Interface untuk success response
interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Interface untuk error response
interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
  stack?: string;
}

/**
 * Response success
 */
export const successResponse = <T = any>(
  c: Context,
  message: string,
  data?: T,
  statusCode: import("hono/utils/http-status").ContentfulStatusCode = 200,
  meta?: SuccessResponse<T>["meta"],
) => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(meta && { meta }),
  };

  c.status(statusCode);
  return c.json(response);
};

/**
 * Response error
 */
export const errorResponse = (
  c: Context,
  message: string,
  statusCode: number = 500,
  errors?: any,
  stack?: string,
) => {
  const response: ErrorResponse = {
    success: false,
    message,
    ...(errors && { errors }),
    ...(stack && process.env.NODE_ENV === "development" && { stack }),
  };

  c.status(statusCode);
  return c.json(response);
};
