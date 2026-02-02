import { useCallback } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useAppConfig } from '../hooks/useAppConfig';
import { authProviderLabels, authProviderColors } from '../constants/authProviders';
import type { AuthProviderType, AuthProviderConfig } from '@app/types';

export interface LoginScreenData {
  /** App name for display */
  appName: string;
  /** Whether a login is in progress */
  isLoading: boolean;
  /** Error message if login failed */
  error: string | null;
  /** Whether user is already authenticated */
  isAuthenticated: boolean;
  /** Available auth providers */
  availableProviders: AuthProviderConfig[];
  /** Get display label for a provider */
  getProviderLabel: (type: AuthProviderType) => string;
  /** Get brand color for a provider */
  getProviderColor: (type: AuthProviderType) => string;
  /** Handle login with a provider */
  handleLogin: (provider: AuthProviderType) => Promise<boolean>;
  /** Clear any existing error */
  clearError: () => void;
}

/**
 * Hook that provides all business logic for the login screen
 * Handles authentication state and login flow
 */
export function useLoginScreenLogic(): LoginScreenData {
  const config = useAppConfig();
  const {
    login,
    isLoading,
    error,
    clearError,
    availableProviders,
    isAuthenticated,
  } = useAuth();

  const handleLogin = useCallback(
    async (provider: AuthProviderType): Promise<boolean> => {
      clearError();
      try {
        await login(provider);
        return true;
      } catch {
        // Error is handled by the auth context
        return false;
      }
    },
    [login, clearError]
  );

  const getProviderLabel = useCallback((type: AuthProviderType): string => {
    return authProviderLabels[type] || type;
  }, []);

  const getProviderColor = useCallback((type: AuthProviderType): string => {
    return authProviderColors[type] || '#666666';
  }, []);

  return {
    appName: config.name,
    isLoading,
    error,
    isAuthenticated,
    availableProviders,
    getProviderLabel,
    getProviderColor,
    handleLogin,
    clearError,
  };
}
