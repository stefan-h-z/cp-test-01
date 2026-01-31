import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useEffect,
} from 'react';
import type { NavigationState, NavigationContextValue } from '@app/types';

const NavigationContext = createContext<NavigationContextValue | null>(null);

export interface NavigationProviderProps {
  children: ReactNode;
  initialRoute?: string;
  onNavigate?: (path: string, params?: Record<string, string>) => void;
  maxHistoryLength?: number;
}

const defaultState: NavigationState = {
  currentRoute: '/',
  previousRoute: null,
  params: {},
  history: ['/'],
};

export function NavigationProvider({
  children,
  initialRoute = '/',
  onNavigate,
  maxHistoryLength = 50,
}: NavigationProviderProps) {
  const [state, setState] = useState<NavigationState>({
    ...defaultState,
    currentRoute: initialRoute,
    history: [initialRoute],
  });

  const navigate = useCallback(
    (path: string, params?: Record<string, string>) => {
      setState((prev) => {
        // Build path with params if provided
        let finalPath = path;
        if (params) {
          const queryString = new URLSearchParams(params).toString();
          if (queryString) {
            finalPath = `${path}${path.includes('?') ? '&' : '?'}${queryString}`;
          }
        }

        // Update history, keeping it within max length
        const newHistory = [...prev.history, finalPath].slice(-maxHistoryLength);

        return {
          currentRoute: finalPath,
          previousRoute: prev.currentRoute,
          params: params || {},
          history: newHistory,
        };
      });

      // Call external navigation handler if provided
      onNavigate?.(path, params);
    },
    [onNavigate, maxHistoryLength]
  );

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.history.length <= 1) {
        return prev;
      }

      const newHistory = prev.history.slice(0, -1);
      const previousRoute = newHistory[newHistory.length - 1] || '/';

      return {
        currentRoute: previousRoute,
        previousRoute: prev.currentRoute,
        params: {},
        history: newHistory,
      };
    });
  }, []);

  const canGoBack = state.history.length > 1;

  const setParams = useCallback((params: Record<string, string>) => {
    setState((prev) => ({
      ...prev,
      params: { ...prev.params, ...params },
    }));
  }, []);

  const getParam = useCallback(
    <T = string>(key: string, defaultValue?: T): T | undefined => {
      const value = state.params[key];
      if (value === undefined) {
        return defaultValue;
      }
      return value as unknown as T;
    },
    [state.params]
  );

  const value = useMemo<NavigationContextValue>(
    () => ({
      state,
      navigate,
      goBack,
      canGoBack,
      setParams,
      getParam,
    }),
    [state, navigate, goBack, canGoBack, setParams, getParam]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

export function useNavigationOptional(): NavigationContextValue | null {
  return useContext(NavigationContext);
}

export { NavigationContext };
