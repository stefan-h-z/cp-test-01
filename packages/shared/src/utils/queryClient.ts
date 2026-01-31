import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';

export interface QueryClientConfig {
  onError?: (error: Error, context?: { queryKey?: unknown; mutationKey?: unknown }) => void;
  onSuccess?: () => void;
  staleTime?: number;
  gcTime?: number;
  retry?: number | boolean | ((failureCount: number, error: Error) => boolean);
}

// Default error handler
const defaultErrorHandler = (error: Error, context?: { queryKey?: unknown }) => {
  console.error('[Query Error]', error.message, context);
};

// Check if error is a network error
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('failed to fetch') ||
      message.includes('net::') ||
      message.includes('timeout') ||
      message.includes('aborted')
    );
  }
  return false;
}

// Check if error is a server error (5xx)
export function isServerError(error: unknown): boolean {
  if (error instanceof Error && 'status' in error) {
    const status = (error as Error & { status: number }).status;
    return status >= 500 && status < 600;
  }
  return false;
}

// Custom retry function
export function createRetryFn(maxRetries: number = 3) {
  return (failureCount: number, error: Error): boolean => {
    // Don't retry on 4xx errors (client errors)
    if ('status' in error) {
      const status = (error as Error & { status: number }).status;
      if (status >= 400 && status < 500) {
        return false;
      }
    }

    // Retry on network errors and 5xx errors
    if (isNetworkError(error) || isServerError(error)) {
      return failureCount < maxRetries;
    }

    // Don't retry other errors
    return false;
  };
}

// Create a configured QueryClient
export function createQueryClient(config: QueryClientConfig = {}): QueryClient {
  const {
    onError = defaultErrorHandler,
    staleTime = 1000 * 60 * 5, // 5 minutes
    gcTime = 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    retry = createRetryFn(3),
  } = config;

  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        onError(error as Error, { queryKey: query.queryKey });
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        onError(error as Error, { mutationKey: mutation.options.mutationKey });
      },
    }),
    defaultOptions: {
      queries: {
        staleTime,
        gcTime,
        retry,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        networkMode: 'offlineFirst',
      },
      mutations: {
        retry,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        networkMode: 'offlineFirst',
      },
    },
  });
}

// Default query client instance
export const queryClient = createQueryClient();
