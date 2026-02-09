/**
 * Custom error types for better error handling throughout the application
 */

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  CART_ERROR = 'CART_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: number;
  retryable?: boolean;
}

export class NetworkError extends Error implements AppError {
  type = ErrorType.NETWORK_ERROR;
  timestamp = Date.now();
  retryable = true;

  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ApiError extends Error implements AppError {
  type = ErrorType.API_ERROR;
  timestamp = Date.now();
  retryable = false;

  constructor(message: string, public statusCode?: number, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error implements AppError {
  type = ErrorType.VALIDATION_ERROR;
  timestamp = Date.now();
  retryable = false;

  constructor(message: string, public field?: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class StorageError extends Error implements AppError {
  type = ErrorType.STORAGE_ERROR;
  timestamp = Date.now();
  retryable = true;

  constructor(message: string, public operation?: string, public details?: any) {
    super(message);
    this.name = 'StorageError';
  }
}

export class CartError extends Error implements AppError {
  type = ErrorType.CART_ERROR;
  timestamp = Date.now();
  retryable = false;

  constructor(message: string, public operation?: string, public details?: any) {
    super(message);
    this.name = 'CartError';
  }
}

/**
 * Utility function to create appropriate error based on error type
 */
export function createError(error: any): AppError {
  if (error && typeof error === 'object' && 'type' in error) {
    return error as AppError;
  }

  if (error?.response?.status) {
    return new ApiError(
      error.message || 'API request failed',
      error.response.status,
      error.response.data
    );
  }

  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network')) {
    return new NetworkError(error.message || 'Network connection failed', error);
  }

  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return new NetworkError('Request timed out', error);
  }

  if (error?.name === 'ValidationError') {
    return new ValidationError(error.message, error.field, error.details);
  }

  if (error?.name === 'StorageError') {
    return new StorageError(error.message, error.operation, error.details);
  }

  if (error?.name === 'CartError') {
    return new CartError(error.message, error.operation, error.details);
  }

  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: error?.message || 'An unknown error occurred',
    details: error,
    timestamp: Date.now(),
    retryable: false,
  };
}

/**
 * Utility function to check if error is retryable
 */
export function isRetryableError(error: AppError | Error): boolean {
  if ('retryable' in error) {
    return error.retryable === true;
  }

  const appError = createError(error);
  return appError.retryable === true;
}

/**
 * Utility function to get user-friendly error message
 */
export function getUserFriendlyMessage(error: AppError | Error): string {
  if ('message' in error) {
    return error.message;
  }

  const appError = createError(error);
  return appError.message;
}