import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import React, { ReactElement, ReactNode } from 'react';

// Create a fresh QueryClient for each test
function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export interface WrapperOptions {
  queryClient?: QueryClient;
}

// Create wrapper with providers
function createWrapper(options: WrapperOptions = {}) {
  const { queryClient = createTestQueryClient() } = options;

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapperOptions?: WrapperOptions;
}

// Custom render function with providers
export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult & { queryClient: QueryClient } {
  const { wrapperOptions = {}, ...renderOptions } = options;
  const queryClient = wrapperOptions.queryClient ?? createTestQueryClient();

  const result = render(ui, {
    wrapper: createWrapper({ ...wrapperOptions, queryClient }),
    ...renderOptions,
  });

  return {
    ...result,
    queryClient,
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Export the custom render as default
export { renderWithProviders as render };
