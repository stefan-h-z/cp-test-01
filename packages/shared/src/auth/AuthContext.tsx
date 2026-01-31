import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { AuthState, AuthUser, AuthProviderType, AuthConfig, AuthProviderConfig } from '@app/types';

// Auth Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: AuthUser; accessToken: string; provider: AuthProviderType } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  accessToken: null,
  provider: null,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        provider: action.payload.provider,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        provider: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return initialState;
    case 'AUTH_CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// Context types
interface AuthContextValue extends AuthState {
  login: (provider: AuthProviderType) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  getProviderConfig: (type: AuthProviderType) => AuthProviderConfig | undefined;
  availableProviders: AuthProviderConfig[];
  authConfig: AuthConfig;
  // Platform-specific login handlers (to be set by platform implementations)
  setLoginHandler: (handler: LoginHandler) => void;
  setLogoutHandler: (handler: LogoutHandler) => void;
}

type LoginHandler = (provider: AuthProviderType, config: AuthProviderConfig) => Promise<{ user: AuthUser; accessToken: string }>;
type LogoutHandler = () => Promise<void>;

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  config: AuthConfig;
}

export function AuthProvider({ children, config }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Platform-specific handlers (set by web/mobile implementations)
  const loginHandlerRef = React.useRef<LoginHandler | null>(null);
  const logoutHandlerRef = React.useRef<LogoutHandler | null>(null);

  const setLoginHandler = useCallback((handler: LoginHandler) => {
    loginHandlerRef.current = handler;
  }, []);

  const setLogoutHandler = useCallback((handler: LogoutHandler) => {
    logoutHandlerRef.current = handler;
  }, []);

  const availableProviders = config.providers.filter((p) => p.enabled);

  const getProviderConfig = useCallback(
    (type: AuthProviderType) => config.providers.find((p) => p.type === type && p.enabled),
    [config.providers]
  );

  const login = useCallback(
    async (providerType: AuthProviderType) => {
      const providerConfig = getProviderConfig(providerType);
      if (!providerConfig) {
        dispatch({ type: 'AUTH_ERROR', payload: `Provider ${providerType} is not configured or enabled` });
        return;
      }

      if (!loginHandlerRef.current) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Login handler not initialized' });
        return;
      }

      dispatch({ type: 'AUTH_START' });

      try {
        const result = await loginHandlerRef.current(providerType, providerConfig);
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: result.user,
            accessToken: result.accessToken,
            provider: providerType,
          },
        });
      } catch (error) {
        dispatch({
          type: 'AUTH_ERROR',
          payload: error instanceof Error ? error.message : 'Authentication failed',
        });
      }
    },
    [getProviderConfig]
  );

  const logout = useCallback(async () => {
    try {
      if (logoutHandlerRef.current) {
        await logoutHandlerRef.current();
      }
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    clearError,
    getProviderConfig,
    availableProviders,
    authConfig: config,
    setLoginHandler,
    setLogoutHandler,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

export function useAuthUser(): AuthUser | null {
  const { user } = useAuth();
  return user;
}

export { AuthContext };
export type { AuthContextValue, LoginHandler, LogoutHandler };
