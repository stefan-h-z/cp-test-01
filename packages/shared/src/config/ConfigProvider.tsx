import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type {
  RemoteAppConfig,
  ConfigState,
  RouteDefinition,
  ExtendedTabBarConfig,
  ExtendedSidebarConfig,
} from '@app/types';
import { ConfigService } from './ConfigService';
import { fallbackConfig } from './fallbackConfig';

interface RemoteConfigContextValue extends ConfigState<RemoteAppConfig> {
  refresh: () => Promise<void>;
  getRoute: (routeId: string) => RouteDefinition | undefined;
  getRouteByPath: (path: string) => RouteDefinition | undefined;
  getTabRoutes: () => RouteDefinition[];
  getSidebarRoutes: () => RouteDefinition[];
  isFeatureEnabled: (featureFlag: string) => boolean;
  tabsConfig: ExtendedTabBarConfig | undefined;
  sidebarConfig: ExtendedSidebarConfig | undefined;
}

const RemoteConfigContext = createContext<RemoteConfigContextValue | null>(null);

interface ConfigProviderProps {
  children: ReactNode;
  /** API endpoint for fetching config. If not provided, uses fallback only. */
  endpoint?: string;
  /** Cache key for localStorage */
  cacheKey?: string;
  /** Cache duration in ms (default: 1 hour) */
  cacheDuration?: number;
  /** Custom fallback config */
  customFallback?: RemoteAppConfig;
  /** Whether to use fallback on error (default: true) */
  useFallbackOnError?: boolean;
}

export function ConfigProvider({
  children,
  endpoint,
  cacheKey,
  cacheDuration,
  customFallback,
  useFallbackOnError = true,
}: ConfigProviderProps) {
  const [state, setState] = useState<ConfigState<RemoteAppConfig>>({
    config: null,
    isLoading: true,
    error: null,
    isStale: false,
    lastFetched: null,
  });

  const configService = useMemo(() => {
    if (!endpoint) return null;
    return new ConfigService({
      endpoint,
      cacheKey,
      cacheDuration,
    });
  }, [endpoint, cacheKey, cacheDuration]);

  const effectiveFallback = customFallback || fallbackConfig;

  const loadConfig = useCallback(async () => {
    if (!configService) {
      // No endpoint configured, use fallback directly
      setState({
        config: effectiveFallback,
        isLoading: false,
        error: null,
        isStale: false,
        lastFetched: Date.now(),
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    // Try cached config first
    const cached = configService.getCachedConfig();
    if (cached && !configService.isConfigStale()) {
      setState({
        config: cached,
        isLoading: false,
        error: null,
        isStale: false,
        lastFetched: cached._meta.fetchedAt,
      });
      return;
    }

    try {
      const config = await configService.fetchConfig();
      setState({
        config,
        isLoading: false,
        error: null,
        isStale: false,
        lastFetched: config._meta.fetchedAt,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load config';

      if (useFallbackOnError) {
        // Use fallback config on error
        setState({
          config: cached || effectiveFallback,
          isLoading: false,
          error: errorMessage,
          isStale: true,
          lastFetched: cached?._meta.fetchedAt || null,
        });
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          isStale: true,
        }));
      }
    }
  }, [configService, effectiveFallback, useFallbackOnError]);

  const refresh = useCallback(async () => {
    if (!configService) return;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const config = await configService.refreshConfig();
      setState({
        config,
        isLoading: false,
        error: null,
        isStale: false,
        lastFetched: config._meta.fetchedAt,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to refresh config',
        isStale: true,
      }));
    }
  }, [configService]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Helper functions for accessing config data
  const getRoute = useCallback(
    (routeId: string): RouteDefinition | undefined => {
      return state.config?.navigation.routes.find((r) => r.id === routeId);
    },
    [state.config]
  );

  const getRouteByPath = useCallback(
    (path: string): RouteDefinition | undefined => {
      return state.config?.navigation.routes.find((r) => r.path === path);
    },
    [state.config]
  );

  const getTabRoutes = useCallback((): RouteDefinition[] => {
    if (!state.config) return [];
    const tabRouteIds =
      state.config.navigation.tabs?.tabs.map((t) => t.route) || [];
    return state.config.navigation.routes.filter(
      (r) => tabRouteIds.includes(r.id) || r.visibility?.showInTabs
    );
  }, [state.config]);

  const getSidebarRoutes = useCallback((): RouteDefinition[] => {
    if (!state.config) return [];
    return state.config.navigation.routes.filter(
      (r) => r.visibility?.showInSidebar
    );
  }, [state.config]);

  const isFeatureEnabled = useCallback(
    (featureFlag: string): boolean => {
      return state.config?.features[featureFlag] ?? false;
    },
    [state.config]
  );

  const contextValue = useMemo<RemoteConfigContextValue>(
    () => ({
      ...state,
      refresh,
      getRoute,
      getRouteByPath,
      getTabRoutes,
      getSidebarRoutes,
      isFeatureEnabled,
      tabsConfig: state.config?.navigation.tabs,
      sidebarConfig: state.config?.navigation.sidebar,
    }),
    [state, refresh, getRoute, getRouteByPath, getTabRoutes, getSidebarRoutes, isFeatureEnabled]
  );

  return (
    <RemoteConfigContext.Provider value={contextValue}>
      {children}
    </RemoteConfigContext.Provider>
  );
}

export function useRemoteConfig(): RemoteConfigContextValue {
  const context = useContext(RemoteConfigContext);
  if (!context) {
    throw new Error('useRemoteConfig must be used within a ConfigProvider');
  }
  return context;
}

/**
 * Hook to check if config is ready (loaded and not in error state without fallback)
 */
export function useConfigReady(): boolean {
  const { config, isLoading, error } = useRemoteConfig();
  return !isLoading && config !== null && !error;
}

/**
 * Hook to get a specific route by ID
 */
export function useRoute(routeId: string): RouteDefinition | undefined {
  const { getRoute } = useRemoteConfig();
  return getRoute(routeId);
}

/**
 * Hook to get navigation configuration from remote config
 */
export function useRemoteNavigation() {
  const { config, getTabRoutes, getSidebarRoutes, tabsConfig, sidebarConfig } =
    useRemoteConfig();

  return {
    routes: config?.navigation.routes || [],
    tabRoutes: getTabRoutes(),
    sidebarRoutes: getSidebarRoutes(),
    tabsConfig,
    sidebarConfig,
    initialRoute: config?.navigation.initialRoute || '/',
    fallback: config?.navigation.fallback,
  };
}

// Alias for compatibility (use useRemoteNavigation for clarity)
export { useRemoteNavigation as useConfigNavigation };
