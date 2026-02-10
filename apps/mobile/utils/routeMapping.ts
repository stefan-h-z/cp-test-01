import type { RouteDefinition } from '@app/types';

/** Config route path → Expo Router screen name (file name in (tabs)/) */
export function getScreenName(route: RouteDefinition): string {
  if (route.path === '/') return 'index';
  return route.path.replace(/^\//, '');
}

/** Config route → Expo Router navigation path */
export function getExpoTabPath(route: RouteDefinition): string {
  if (route.path === '/') return '/(tabs)';
  return `/(tabs)${route.path}`;
}
