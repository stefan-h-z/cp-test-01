import { useCallback, useEffect, useState } from 'react';
import type { DeepLinkConfig, DeepLinkScreenConfig } from '@app/types';

/**
 * Create a deep link configuration for the app
 */
export function createDeepLinkConfig(
  appScheme: string,
  webDomain: string,
  screens: Record<string, string | DeepLinkScreenConfig>
): DeepLinkConfig {
  return {
    prefixes: [
      `${appScheme}://`,
      `https://${webDomain}`,
      `http://${webDomain}`,
    ],
    screens,
  };
}

/**
 * Parse a deep link URL into route and params
 */
export function parseDeepLink(
  url: string,
  config: DeepLinkConfig
): { route: string; params: Record<string, string> } | null {
  try {
    // Remove prefix
    let path = url;
    for (const prefix of config.prefixes) {
      if (url.startsWith(prefix)) {
        path = url.slice(prefix.length);
        break;
      }
    }

    // Remove leading slash if present
    if (path.startsWith('/')) {
      path = path.slice(1);
    }

    // Parse query params
    const [pathname, queryString] = path.split('?');
    const params: Record<string, string> = {};

    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
    }

    // Match against configured screens
    const route = matchScreenPath(pathname, config.screens);

    if (route) {
      // Extract path params
      const pathParams = extractPathParams(pathname, route.path);
      return {
        route: route.name,
        params: { ...pathParams, ...params },
      };
    }

    // Fallback to pathname as route
    return {
      route: pathname || 'Home',
      params,
    };
  } catch (error) {
    console.warn('Failed to parse deep link:', error);
    return null;
  }
}

/**
 * Build a deep link URL from route and params
 */
export function buildDeepLink(
  route: string,
  params: Record<string, string> = {},
  config: DeepLinkConfig,
  useWebPrefix = true
): string {
  const prefix = useWebPrefix ? config.prefixes[1] : config.prefixes[0];

  // Find screen config
  const screenConfig = config.screens[route];
  let path = route;

  if (typeof screenConfig === 'string') {
    path = screenConfig;
  } else if (screenConfig) {
    path = screenConfig.path;

    // Apply stringify functions if available
    if (screenConfig.stringify) {
      Object.entries(screenConfig.stringify).forEach(([key, fn]) => {
        if (params[key] !== undefined) {
          params[key] = fn(params[key]);
        }
      });
    }
  }

  // Replace path params
  let finalPath = path;
  const queryParams: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (finalPath.includes(`:${key}`)) {
      finalPath = finalPath.replace(`:${key}`, encodeURIComponent(value));
    } else {
      queryParams[key] = value;
    }
  });

  // Build query string
  const queryString = new URLSearchParams(queryParams).toString();
  const fullPath = queryString ? `${finalPath}?${queryString}` : finalPath;

  return `${prefix}/${fullPath}`;
}

/**
 * Hook for handling deep links
 */
export function useDeepLink(
  config: DeepLinkConfig,
  onDeepLink?: (route: string, params: Record<string, string>) => void
) {
  const [lastDeepLink, setLastDeepLink] = useState<{
    route: string;
    params: Record<string, string>;
  } | null>(null);

  const handleDeepLink = useCallback(
    (url: string) => {
      const parsed = parseDeepLink(url, config);
      if (parsed) {
        setLastDeepLink(parsed);
        onDeepLink?.(parsed.route, parsed.params);
      }
    },
    [config, onDeepLink]
  );

  const buildLink = useCallback(
    (route: string, params?: Record<string, string>, useWebPrefix = true) => {
      return buildDeepLink(route, params, config, useWebPrefix);
    },
    [config]
  );

  // Web: Listen for popstate events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      handleDeepLink(window.location.href);
    };

    // Handle initial URL
    handleDeepLink(window.location.href);

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handleDeepLink]);

  return {
    lastDeepLink,
    handleDeepLink,
    buildLink,
  };
}

// Helper functions
function matchScreenPath(
  pathname: string,
  screens: Record<string, string | DeepLinkScreenConfig>
): { name: string; path: string } | null {
  for (const [name, config] of Object.entries(screens)) {
    const screenPath = typeof config === 'string' ? config : config.path;

    if (pathMatches(pathname, screenPath)) {
      return { name, path: screenPath };
    }
  }
  return null;
}

function pathMatches(pathname: string, pattern: string): boolean {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return false;
  }

  return patternParts.every((part, index) => {
    if (part.startsWith(':')) {
      return true; // Dynamic segment matches anything
    }
    return part === pathParts[index];
  });
}

function extractPathParams(pathname: string, pattern: string): Record<string, string> {
  const params: Record<string, string> = {};
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);

  patternParts.forEach((part, index) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1);
      params[paramName] = decodeURIComponent(pathParts[index]);
    }
  });

  return params;
}
