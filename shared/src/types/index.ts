// Legacy ApiResponse type for backward compatibility
export type ApiResponse = {
  data?: any;
  message: string;
  success: boolean;
}

// Export common types
export * from './common.type';
export * from './auth.type';
