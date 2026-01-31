import type { ApiResponse } from '@app/types';

// Custom API Error class with more details
export class ApiError extends Error {
  status: number;
  statusText: string;
  data?: unknown;
  isNetworkError: boolean;
  isTimeout: boolean;
  isServerError: boolean;
  isClientError: boolean;

  constructor(
    message: string,
    options: {
      status?: number;
      statusText?: string;
      data?: unknown;
      isNetworkError?: boolean;
      isTimeout?: boolean;
    } = {}
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status ?? 0;
    this.statusText = options.statusText ?? '';
    this.data = options.data;
    this.isNetworkError = options.isNetworkError ?? false;
    this.isTimeout = options.isTimeout ?? false;
    this.isServerError = this.status >= 500 && this.status < 600;
    this.isClientError = this.status >= 400 && this.status < 500;
  }
}

interface FetchOptions extends RequestInit {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  onRetry?: (attempt: number, error: ApiError) => void;
}

// Sleep utility for retry delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Check if error should trigger retry
function shouldRetry(error: ApiError): boolean {
  // Retry on network errors
  if (error.isNetworkError || error.isTimeout) {
    return true;
  }
  // Retry on server errors (5xx)
  if (error.isServerError) {
    return true;
  }
  // Don't retry on client errors (4xx) or other errors
  return false;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    baseUrl = '',
    timeout = 30000,
    retries = 3,
    retryDelay = 1000,
    onRetry,
    ...fetchOptions
  } = options;

  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          // Response body is not JSON
        }

        const error = new ApiError(
          `API Error: ${response.status} ${response.statusText}`,
          {
            status: response.status,
            statusText: response.statusText,
            data: errorData,
          }
        );

        // Don't retry client errors
        if (error.isClientError) {
          throw error;
        }

        lastError = error;
        throw error;
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // Convert to ApiError if not already
      if (!(error instanceof ApiError)) {
        const isTimeout =
          error instanceof Error && error.name === 'AbortError';
        const isNetworkError =
          error instanceof TypeError ||
          (error instanceof Error &&
            error.message.toLowerCase().includes('network'));

        lastError = new ApiError(
          isTimeout
            ? 'Request timeout'
            : isNetworkError
            ? 'Network error'
            : error instanceof Error
            ? error.message
            : 'Unknown error',
          {
            isTimeout,
            isNetworkError,
          }
        );
      } else {
        lastError = error;
      }

      // Check if we should retry
      if (attempt < retries && shouldRetry(lastError)) {
        onRetry?.(attempt + 1, lastError);
        // Exponential backoff
        await sleep(retryDelay * Math.pow(2, attempt));
        continue;
      }

      throw lastError;
    }
  }

  throw lastError ?? new ApiError('Unknown error occurred');
}

// Convenience methods for common HTTP methods
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// Helper to check if an error is an API error
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

// Helper to get user-friendly error message
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    if (error.isNetworkError) {
      return 'Unable to connect. Please check your internet connection.';
    }
    if (error.isTimeout) {
      return 'Request timed out. Please try again.';
    }
    if (error.isServerError) {
      return 'Server error. Please try again later.';
    }
    if (error.status === 401) {
      return 'Please sign in to continue.';
    }
    if (error.status === 403) {
      return 'You don\'t have permission to perform this action.';
    }
    if (error.status === 404) {
      return 'The requested resource was not found.';
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}
