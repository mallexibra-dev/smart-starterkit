// Default messages mapped by HTTP status codes
export enum HttpMessage {
  // Success 2xx
  OK = "Request processed successfully",
  CREATED = "Resource created successfully",
  ACCEPTED = "Request accepted and is being processed",
  NO_CONTENT = "Request successful, no content",

  // Client Error 4xx
  BAD_REQUEST = "Bad request",
  UNAUTHORIZED = "Authentication required",
  FORBIDDEN = "Access denied",
  NOT_FOUND = "Resource not found",
  METHOD_NOT_ALLOWED = "Method not allowed",
  CONFLICT = "Data conflict",
  UNPROCESSABLE_ENTITY = "Validation failed",
  TOO_MANY_REQUESTS = "Too many requests",

  // Server Error 5xx
  INTERNAL_SERVER_ERROR = "Internal server error",
  NOT_IMPLEMENTED = "Not implemented",
  BAD_GATEWAY = "Bad gateway",
  SERVICE_UNAVAILABLE = "Service unavailable",
  GATEWAY_TIMEOUT = "Gateway timeout",
}

// Mapping status codes to default messages
export const STATUS_MESSAGE_MAP: Record<number, HttpMessage> = {
  200: HttpMessage.OK,
  201: HttpMessage.CREATED,
  202: HttpMessage.ACCEPTED,
  204: HttpMessage.NO_CONTENT,
  400: HttpMessage.BAD_REQUEST,
  401: HttpMessage.UNAUTHORIZED,
  403: HttpMessage.FORBIDDEN,
  404: HttpMessage.NOT_FOUND,
  405: HttpMessage.METHOD_NOT_ALLOWED,
  409: HttpMessage.CONFLICT,
  422: HttpMessage.UNPROCESSABLE_ENTITY,
  429: HttpMessage.TOO_MANY_REQUESTS,
  500: HttpMessage.INTERNAL_SERVER_ERROR,
  501: HttpMessage.NOT_IMPLEMENTED,
  502: HttpMessage.BAD_GATEWAY,
  503: HttpMessage.SERVICE_UNAVAILABLE,
  504: HttpMessage.GATEWAY_TIMEOUT,
};