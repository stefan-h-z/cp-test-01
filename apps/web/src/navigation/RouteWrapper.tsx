import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { RouteDefinition } from '@app/types';
import { useAuth, useRemoteConfig } from '@app/shared';

interface RouteWrapperProps {
  route: RouteDefinition;
  children: ReactNode;
}

/**
 * Wrapper component that handles route access control based on config
 */
export function RouteWrapper({ route, children }: RouteWrapperProps) {
  const { isAuthenticated, isLoading, authConfig } = useAuth();
  const { isFeatureEnabled } = useRemoteConfig();
  const location = useLocation();

  // Check feature flag if specified
  if (route.featureFlag && !isFeatureEnabled(route.featureFlag)) {
    return <Navigate to="/" replace />;
  }

  // Handle access control
  if (route.access) {
    switch (route.access.type) {
      case 'public':
        // Public routes are always accessible
        break;

      case 'authenticated':
        // Auth is disabled - allow access
        if (!authConfig.enabled) break;

        // Still loading auth state
        if (isLoading) return null;

        // Not authenticated - redirect to login
        if (!isAuthenticated) {
          return <Navigate to="/login" state={{ from: location }} replace />;
        }
        break;

      case 'roles':
        // Auth is disabled - allow access
        if (!authConfig.enabled) break;

        // Still loading auth state
        if (isLoading) return null;

        // Not authenticated - redirect to login
        if (!isAuthenticated) {
          return <Navigate to="/login" state={{ from: location }} replace />;
        }

        // TODO: Role-based access control
        // const userRoles = user?.roles || [];
        // const hasRole = route.access.roles?.some(r => userRoles.includes(r));
        // if (!hasRole) {
        //   return <Navigate to="/" replace />;
        // }
        break;
    }
  }

  return <>{children}</>;
}
