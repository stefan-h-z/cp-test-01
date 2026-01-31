import React, { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppConfig } from '@app/types';
import { defaultAppConfig } from '@app/config';
import { AppConfigContext } from '../hooks/useAppConfig';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

interface AppProviderProps {
  children: ReactNode;
  config?: AppConfig;
}

export function AppProvider({ children, config = defaultAppConfig }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppConfigContext.Provider value={config}>
        {children}
      </AppConfigContext.Provider>
    </QueryClientProvider>
  );
}
