export {
  NavigationProvider,
  useNavigation,
  useNavigationOptional,
  NavigationContext,
  type NavigationProviderProps,
} from './NavigationProvider';

export {
  useProtectedRoute,
  useAuthGuard,
  type UseProtectedRouteOptions,
} from './useProtectedRoute';

export {
  createDeepLinkConfig,
  parseDeepLink,
  buildDeepLink,
  useDeepLink,
} from './deepLinking';

export {
  matchRoute,
  extractParams,
  buildPath,
  isActiveRoute,
  getRouteByPath,
  getRouteByName,
  flattenRoutes,
} from './routeUtils';
