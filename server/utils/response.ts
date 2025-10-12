import { HttpMessage, STATUS_MESSAGE_MAP } from "@server/enums/response.enum";
import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";

// Interface for a successful response payload
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

// Interface for an error response payload
interface ErrorResponse {
  success: false;
  message: string;
  errors?: any;
  stack?: string;
}

/**
 * Get the default message for a given HTTP status code
 */
const getDefaultMessage = (statusCode: number): string => {
  return STATUS_MESSAGE_MAP[statusCode] || HttpMessage.OK;
};

/**
 * Send a standardized success response
 */
export const successResponse = <T = any>(
  c: Context,
  message?: string,
  data?: T,
  statusCode: StatusCode = 200,
  meta?: SuccessResponse<T>["meta"],
) => {
  const response: SuccessResponse<T> = {
    success: true,
    message: message || getDefaultMessage(statusCode),
    ...(data !== undefined && { data }),
    ...(meta && { meta }),
  };

  c.status(statusCode);
  return c.json(response);
};

/**
 * Send a standardized error response
 */
export const errorResponse = (
  c: Context,
  message?: string,
  statusCode: StatusCode = 500,
  errors?: any,
  stack?: string,
) => {
  const response: ErrorResponse = {
    success: false,
    message: message || getDefaultMessage(statusCode),
    ...(errors && { errors }),
    ...(stack && process.env.NODE_ENV === "development" && { stack }),
  };

  c.status(statusCode);
  return c.json(response);
};
