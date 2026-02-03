import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TamaguiProvider, Theme, ErrorBoundary } from '@app/ui';
import { AppProvider, AuthProvider, useAuth, useAppConfig } from '@app/shared';
import { config } from './tamagui.config';
import { HomeScreen, DetailsScreen, LoginScreen, AuthCallbackScreen, DashboardScreen, QRScannerScreen } from './screens';
import { Layout } from './Layout';
import { DashboardLayout } from './DashboardLayout';
import { WebAuthProvider } from './auth';
import type { ReactNode } from 'react';
import { YStack, Heading, BodyText } from '@app/ui';

// Global error handler for logging
function handleGlobalError(error: Error, errorInfo: React.ErrorInfo) {
  // In production, send to error tracking service (e.g., Sentry)
  console.error('Global error caught:', error);
  console.error('Component stack:', errorInfo.componentStack);
}

// Placeholder screen for routes not yet implemented
function PlaceholderScreen({ title }: { title: string }) {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" padding="$6">
      <Heading level={2}>{title}</Heading>
      <BodyText color="$neutral500" marginTop="$2">Coming soon...</BodyText>
    </YStack>
  );
}

// Protected Route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, authConfig } = useAuth();
  const location = useLocation();

  // If auth is disabled, allow access
  if (!authConfig.enabled) {
    return <>{children}</>;
  }

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Auth-aware routes component
function AppRoutes() {
  const appConfig = useAppConfig();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/auth/callback" element={<AuthCallbackScreen />} />

      {/* Protected routes with Dashboard Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/budget" element={<PlaceholderScreen title="Budget" />} />
        <Route path="/transactions" element={<PlaceholderScreen title="Transactions" />} />
        <Route path="/accounts" element={<PlaceholderScreen title="Accounts" />} />
        <Route path="/add" element={<PlaceholderScreen title="Add Transaction" />} />
        <Route path="/qr-scanner" element={<QRScannerScreen />} />
        <Route path="/details/:id" element={<DetailsScreen />} />
      </Route>

      {/* Old layout routes (optional, can be removed) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<HomeScreen />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Inner app with auth context available
function AppWithAuth() {
  const appConfig = useAppConfig();

  return (
    <AuthProvider config={appConfig.auth}>
      <WebAuthProvider>
        <BrowserRouter>
          {/* Route-level error boundary - catches route errors without breaking navigation */}
          <ErrorBoundary onError={handleGlobalError}>
            <AppRoutes />
          </ErrorBoundary>
        </BrowserRouter>
      </WebAuthProvider>
    </AuthProvider>
  );
}

export function App() {
  return (
    <ErrorBoundary
      onError={handleGlobalError}
      onReset={() => window.location.reload()}
    >
      <TamaguiProvider config={config}>
        <Theme name="light">
          <AppProvider>
            <AppWithAuth />
          </AppProvider>
        </Theme>
      </TamaguiProvider>
    </ErrorBoundary>
  );
}
