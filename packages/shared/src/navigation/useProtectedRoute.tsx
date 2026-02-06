import { useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '../auth/AuthContext';

export interface UseProtectedRouteOptions {
  /** Required roles for access */
  roles?: string[];
  /** Redirect path when unauthorized */
  redirectTo?: string;
  /** Callback when unauthorized access is attempted */
  onUnauthorized?: () => void;
  /** Whether authentication is required (default: true) */
  requireAuth?: boolean;
}

export interface UseProtectedRouteResult {
  /** Whether the user has access */
  hasAccess: boolean;
  /** Whether authentication is still loading */
  isLoading: boolean;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** The reason for denied access */
  denyReason: 'not-authenticated' | 'missing-role' | null;
  /** Check if user has a specific role */
  hasRole: (role: string) => boolean;
  /** Check if user has any of the specified roles */
  hasAnyRole: (roles: string[]) => boolean;
  /** Check if user has all of the specified roles */
  hasAllRoles: (roles: string[]) => boolean;
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}): UseProtectedRouteResult {
  const { roles = [], redirectTo: _redirectTo, onUnauthorized, requireAuth = true } = options;

  const auth = useAuth();
  const { isAuthenticated, isLoading, user } = auth;

  // Get user roles (extend AuthUser type or use a custom claim)
  const userRoles: string[] = useMemo(() => {
    if (!user) return [];
    // User roles could come from user object or be computed
    // This is a placeholder - in real apps, roles would come from the auth provider
    return (user as unknown as { roles?: string[] }).roles || [];
  }, [user]);

  const hasRole = useCallback(
    (role: string): boolean => {
      return userRoles.includes(role);
    },
    [userRoles]
  );

  const hasAnyRole = useCallback(
    (checkRoles: string[]): boolean => {
      if (checkRoles.length === 0) return true;
      return checkRoles.some((role) => userRoles.includes(role));
    },
    [userRoles]
  );

  const hasAllRoles = useCallback(
    (checkRoles: string[]): boolean => {
      if (checkRoles.length === 0) return true;
      return checkRoles.every((role) => userRoles.includes(role));
    },
    [userRoles]
  );

  const denyReason = useMemo((): 'not-authenticated' | 'missing-role' | null => {
    if (isLoading) return null;
    if (requireAuth && !isAuthenticated) return 'not-authenticated';
    if (roles.length > 0 && !hasAnyRole(roles)) return 'missing-role';
    return null;
  }, [isLoading, requireAuth, isAuthenticated, roles, hasAnyRole]);

  const hasAccess = denyReason === null && !isLoading;

  // Call onUnauthorized callback when access is denied
  useEffect(() => {
    if (!isLoading && denyReason && onUnauthorized) {
      onUnauthorized();
    }
  }, [isLoading, denyReason, onUnauthorized]);

  return {
    hasAccess,
    isLoading,
    isAuthenticated,
    denyReason,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };
}

/**
 * Hook for checking if current user can access a protected resource
 * Returns true if authenticated and has required roles (if specified)
 */
export function useAuthGuard(roles?: string[]): {
  canAccess: boolean;
  isLoading: boolean;
} {
  const { hasAccess, isLoading } = useProtectedRoute({ roles });
  return { canAccess: hasAccess, isLoading };
}
