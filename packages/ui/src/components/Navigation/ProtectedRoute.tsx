import React from 'react';
import { YStack, XStack, Text, Spinner, styled } from 'tamagui';
import { Lock, AlertCircle } from '@tamagui/lucide-icons';
import type { ProtectedRouteProps } from '@app/types';
import { Button } from '../Button';

const Container = styled(YStack, {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$4',
  gap: '$4',
});

const IconContainer = styled(XStack, {
  width: 64,
  height: 64,
  borderRadius: 32,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$gray3',
});

interface ProtectedRouteComponentProps extends ProtectedRouteProps {
  isLoading?: boolean;
  isAuthenticated?: boolean;
  hasRequiredRoles?: boolean;
  onLogin?: () => void;
  loginLabel?: string;
  unauthorizedTitle?: string;
  unauthorizedMessage?: string;
  loadingMessage?: string;
}

export function ProtectedRoute({
  children,
  fallback,
  isLoading = false,
  isAuthenticated = false,
  hasRequiredRoles = true,
  onLogin,
  onUnauthorized,
  loginLabel = 'Sign In',
  unauthorizedTitle = 'Access Denied',
  unauthorizedMessage = 'You do not have permission to view this page.',
  loadingMessage = 'Checking access...',
}: ProtectedRouteComponentProps) {
  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <Container>
          <Spinner size="large" color="$blue10" />
          <Text color="$gray10" fontSize="$3">
            {loadingMessage}
          </Text>
        </Container>
      )
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      fallback || (
        <Container>
          <IconContainer>
            <Lock size={32} color="$gray10" />
          </IconContainer>
          <YStack alignItems="center" gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$gray12">
              Sign In Required
            </Text>
            <Text fontSize="$3" color="$gray10" textAlign="center">
              Please sign in to access this page.
            </Text>
          </YStack>
          {onLogin && (
            <Button onPress={onLogin} variant="primary" size="lg">
              {loginLabel}
            </Button>
          )}
        </Container>
      )
    );
  }

  // Show unauthorized message if missing required roles
  if (!hasRequiredRoles) {
    return (
      fallback || (
        <Container>
          <IconContainer backgroundColor="$red3">
            <AlertCircle size={32} color="$red10" />
          </IconContainer>
          <YStack alignItems="center" gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$gray12">
              {unauthorizedTitle}
            </Text>
            <Text fontSize="$3" color="$gray10" textAlign="center" maxWidth={300}>
              {unauthorizedMessage}
            </Text>
          </YStack>
          {onUnauthorized && (
            <Button onPress={onUnauthorized} variant="secondary">
              Go Back
            </Button>
          )}
        </Container>
      )
    );
  }

  // Render protected content
  return <>{children}</>;
}

// Simple auth guard wrapper that just shows/hides content
export function AuthGuard({
  children,
  isAuthenticated,
  fallback,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
  fallback?: React.ReactNode;
}) {
  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }
  return <>{children}</>;
}

// Role-based guard
export function RoleGuard({
  children,
  hasRole,
  fallback,
}: {
  children: React.ReactNode;
  hasRole: boolean;
  fallback?: React.ReactNode;
}) {
  if (!hasRole) {
    return fallback ? <>{fallback}</> : null;
  }
  return <>{children}</>;
}
