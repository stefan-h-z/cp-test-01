import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TamaguiProvider, Theme } from '@app/ui';
import { AppProvider, AuthProvider, useAuth, useAppConfig } from '@app/shared';
import { config } from './tamagui.config';
import { HomeScreen, DetailsScreen, LoginScreen, AuthCallbackScreen } from './screens';
import { Layout } from './Layout';
import { WebAuthProvider } from './auth';
import type { ReactNode } from 'react';

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

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomeScreen />} />
        <Route path="/details/:id" element={<DetailsScreen />} />
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
          <AppRoutes />
        </BrowserRouter>
      </WebAuthProvider>
    </AuthProvider>
  );
}

export function App() {
  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <AppProvider>
          <AppWithAuth />
        </AppProvider>
      </Theme>
    </TamaguiProvider>
  );
}
