import React, { type ReactNode, useMemo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppConfig } from '@app/types';
import { defaultAppConfig } from '@app/config';
import { AppConfigContext } from '../hooks/useAppConfig';
import { ToastProvider } from './ToastProvider';
import { createQueryClient } from '../utils/queryClient';

interface AppProviderProps {
  children: ReactNode;
  config?: AppConfig;
  onQueryError?: (error: Error) => void;
}

export function AppProvider({
  children,
  config = defaultAppConfig,
  onQueryError,
}: AppProviderProps) {
  // Create query client with error handling
  const queryClient = useMemo(
    () =>
      createQueryClient({
        onError: (error) => {
          console.error('[App] Query error:', error.message);
          onQueryError?.(error);
        },
      }),
    [onQueryError]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppConfigContext.Provider value={config}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AppConfigContext.Provider>
    </QueryClientProvider>
  );
}
