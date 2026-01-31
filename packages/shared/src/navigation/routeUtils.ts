import type { RouteConfig } from '@app/types';

/**
 * Check if a path matches a route pattern
 */
export function matchRoute(path: string, pattern: string): boolean {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  // Handle wildcard patterns
  if (pattern.endsWith('*')) {
    const basePattern = pattern.slice(0, -1);
    return path.startsWith(basePattern);
  }

  if (patternParts.length !== pathParts.length) {
    return false;
  }

  return patternParts.every((part, index) => {
    // Dynamic segment (e.g., :id)
    if (part.startsWith(':')) {
      return true;
    }
    // Optional segment (e.g., :id?)
    if (part.endsWith('?')) {
      const basePart = part.slice(0, -1);
      if (basePart.startsWith(':')) {
        return true;
      }
      return basePart === pathParts[index] || pathParts[index] === undefined;
    }
    return part === pathParts[index];
  });
}

/**
 * Extract params from a path based on a pattern
 */
export function extractParams(
  path: string,
  pattern: string
): Record<string, string> {
  const params: Record<string, string> = {};
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  patternParts.forEach((part, index) => {
    if (part.startsWith(':')) {
      let paramName = part.slice(1);
      // Remove optional marker
      if (paramName.endsWith('?')) {
        paramName = paramName.slice(0, -1);
      }
      if (pathParts[index]) {
        params[paramName] = decodeURIComponent(pathParts[index]);
      }
    }
  });

  // Extract query params
  const queryIndex = path.indexOf('?');
  if (queryIndex !== -1) {
    const queryString = path.slice(queryIndex + 1);
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
  }

  return params;
}

/**
 * Build a path from a pattern and params
 */
export function buildPath(
  pattern: string,
  params: Record<string, string> = {}
): string {
  let path = pattern;
  const queryParams: Record<string, string> = {};

  // Replace path params
  Object.entries(params).forEach(([key, value]) => {
    const paramPattern = `:${key}`;
    const optionalPattern = `:${key}?`;

    if (path.includes(paramPattern)) {
      path = path.replace(paramPattern, encodeURIComponent(value));
    } else if (path.includes(optionalPattern)) {
      path = path.replace(optionalPattern, encodeURIComponent(value));
    } else {
      // Add as query param
      queryParams[key] = value;
    }
  });

  // Remove unfilled optional params
  path = path.replace(/\/:[^/]+\?/g, '');

  // Build query string
  const queryString = new URLSearchParams(queryParams).toString();
  if (queryString) {
    path = `${path}?${queryString}`;
  }

  return path;
}

/**
 * Check if a route is currently active
 */
export function isActiveRoute(
  currentPath: string,
  routePath: string,
  exact = false
): boolean {
  if (exact) {
    // Remove query params for exact match
    const currentBase = currentPath.split('?')[0];
    const routeBase = routePath.split('?')[0];
    return currentBase === routeBase;
  }

  // Check if current path starts with route path
  const currentParts = currentPath.split('/').filter(Boolean);
  const routeParts = routePath.split('/').filter(Boolean);

  if (routeParts.length > currentParts.length) {
    return false;
  }

  return routeParts.every((part, index) => {
    if (part.startsWith(':')) {
      return true;
    }
    return part === currentParts[index];
  });
}

/**
 * Find a route by path in a route config array
 */
export function getRouteByPath(
  routes: RouteConfig[],
  path: string
): RouteConfig | undefined {
  for (const route of routes) {
    if (matchRoute(path, route.path)) {
      return route;
    }
    if (route.children) {
      const childRoute = getRouteByPath(route.children, path);
      if (childRoute) {
        return childRoute;
      }
    }
  }
  return undefined;
}

/**
 * Find a route by name in a route config array
 */
export function getRouteByName(
  routes: RouteConfig[],
  name: string
): RouteConfig | undefined {
  for (const route of routes) {
    if (route.name === name) {
      return route;
    }
    if (route.children) {
      const childRoute = getRouteByName(route.children, name);
      if (childRoute) {
        return childRoute;
      }
    }
  }
  return undefined;
}

/**
 * Flatten nested routes into a single array
 */
export function flattenRoutes(
  routes: RouteConfig[],
  parentPath = ''
): RouteConfig[] {
  const flattened: RouteConfig[] = [];

  for (const route of routes) {
    const fullPath = parentPath
      ? `${parentPath}/${route.path}`.replace(/\/+/g, '/')
      : route.path;

    flattened.push({
      ...route,
      path: fullPath,
    });

    if (route.children) {
      flattened.push(...flattenRoutes(route.children, fullPath));
    }
  }

  return flattened;
}

/**
 * Filter routes by visibility flags
 */
export function filterVisibleRoutes(
  routes: RouteConfig[],
  options: { showInNav?: boolean; showInTabs?: boolean } = {}
): RouteConfig[] {
  return routes.filter((route) => {
    if (options.showInNav !== undefined && route.showInNav !== options.showInNav) {
      return false;
    }
    if (options.showInTabs !== undefined && route.showInTabs !== options.showInTabs) {
      return false;
    }
    return true;
  });
}

/**
 * Generate breadcrumbs from current path and routes
 */
export function generateBreadcrumbs(
  currentPath: string,
  routes: RouteConfig[]
): Array<{ title: string; path: string }> {
  const breadcrumbs: Array<{ title: string; path: string }> = [];
  const pathParts = currentPath.split('/').filter(Boolean);
  let accumulatedPath = '';

  for (const part of pathParts) {
    accumulatedPath += `/${part}`;
    const route = getRouteByPath(routes, accumulatedPath);
    if (route) {
      breadcrumbs.push({
        title: route.title,
        path: accumulatedPath,
      });
    }
  }

  return breadcrumbs;
}
