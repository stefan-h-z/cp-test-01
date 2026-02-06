import {
  AppProvider,
  AuthProvider,
  useAuth,
  useAppConfig,
  ConfigProvider,
  ComponentRegistry,
  RegistryProvider,
  useRemoteNavigation,
  useRemoteConfig,
  ThemeModeProvider,
} from '@app/shared';
import type { RouteDefinition } from '@app/types';
import { TamaguiProvider, Theme, ErrorBoundary , YStack, Heading, BodyText } from '@app/ui';
import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { WebAuthProvider } from './auth';
import { ConfigurableDashboardLayout } from './ConfigurableDashboardLayout';
import { Layout } from './Layout';
import {
  HomeScreen,
  DetailsScreen,
  LoginScreen,
  AuthCallbackScreen,
  DashboardScreen,
  QRScannerScreen,
  SettingsScreen,
} from './screens';
import { config } from './tamagui.config';


// Global error handler for logging
function handleGlobalError(error: Error, errorInfo: React.ErrorInfo) {
  console.error('Global error caught:', error);
  console.error('Component stack:', errorInfo.componentStack);
}

// Placeholder screen for routes not yet implemented
function PlaceholderScreen({ title }: { title: string }) {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" padding="$6">
      <Heading level={2}>{title}</Heading>
      <BodyText color="$neutral500" marginTop="$2">
        Coming soon...
      </BodyText>
    </YStack>
  );
}

// Create and configure the component registry
function createRegistry(): ComponentRegistry {
  const registry = new ComponentRegistry();

  // Register all screens
  registry.registerScreens({
    HomeScreen,
    DetailsScreen,
    LoginScreen,
    AuthCallbackScreen,
    DashboardScreen,
    QRScannerScreen,
    SettingsScreen,
    // Placeholder screens for routes not yet implemented
    BudgetScreen: () => <PlaceholderScreen title="Budget" />,
    TransactionsScreen: () => <PlaceholderScreen title="Transactions" />,
    AccountsScreen: () => <PlaceholderScreen title="Accounts" />,
    AddTransactionScreen: () => <PlaceholderScreen title="Add Transaction" />,
  });

  // Register layouts
  registry.registerLayouts({
    AuthLayout: ({ children }: { children: ReactNode }) => <>{children}</>,
    DashboardLayout: ConfigurableDashboardLayout,
  });

  return registry;
}

// Route wrapper for access control
function RouteWrapper({ route, children }: { route: RouteDefinition; children: ReactNode }) {
  const { isAuthenticated, isLoading, authConfig } = useAuth();
  const { isFeatureEnabled } = useRemoteConfig();
  const location = useLocation();

  // Check feature flag
  if (route.featureFlag && !isFeatureEnabled(route.featureFlag)) {
    return <Navigate to="/" replace />;
  }

  // Handle access control
  if (route.access?.type === 'authenticated') {
    if (!authConfig.enabled) {
      return <>{children}</>;
    }
    if (isLoading) return null;
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
}

// Screen renderer that uses the registry
function ScreenRenderer({ route, registry }: { route: RouteDefinition; registry: ComponentRegistry }) {
  const ScreenComponent = registry.getScreen(route.screen);

  if (!ScreenComponent) {
    const title = typeof route.title === 'string' ? route.title : route.id;
    return <PlaceholderScreen title={title} />;
  }

  return <ScreenComponent />;
}

// Config-driven routes component
function ConfigDrivenRoutes({ registry }: { registry: ComponentRegistry }) {
  const { routes, fallback } = useRemoteNavigation();

  // Separate routes by layout
  const publicRoutes = routes.filter(
    (r) => r.access?.type === 'public' || r.layout === 'AuthLayout'
  );
  const dashboardRoutes = routes.filter(
    (r) => r.access?.type !== 'public' && r.layout !== 'AuthLayout'
  );

  return (
    <Routes>
      {/* Public routes (no layout) */}
      {publicRoutes.map((route) => (
        <Route
          key={route.id}
          path={route.path}
          element={
            <RouteWrapper route={route}>
              <ScreenRenderer route={route} registry={registry} />
            </RouteWrapper>
          }
        />
      ))}

      {/* Protected routes with Dashboard Layout */}
      <Route element={<ConfigurableDashboardLayout />}>
        {dashboardRoutes.map((route) => (
          <Route
            key={route.id}
            path={route.path}
            element={
              <RouteWrapper route={route}>
                <ScreenRenderer route={route} registry={registry} />
              </RouteWrapper>
            }
          />
        ))}
      </Route>

      {/* Legacy routes for backward compatibility */}
      <Route element={<Layout />}>
        <Route
          path="/home"
          element={
            <RouteWrapper route={{ id: 'home', path: '/home', title: 'Home', screen: 'HomeScreen', access: { type: 'authenticated' } }}>
              <HomeScreen />
            </RouteWrapper>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to={fallback?.notFound || '/'} replace />} />
    </Routes>
  );
}

// Inner app with auth and config context available
function AppWithAuth({ registry }: { registry: ComponentRegistry }) {
  const appConfig = useAppConfig();

  return (
    <AuthProvider config={appConfig.auth}>
      <WebAuthProvider>
        <BrowserRouter>
          <ErrorBoundary onError={handleGlobalError}>
            <ConfigDrivenRoutes registry={registry} />
          </ErrorBoundary>
        </BrowserRouter>
      </WebAuthProvider>
    </AuthProvider>
  );
}

// App with config provider
function AppWithConfig({ registry }: { registry: ComponentRegistry }) {
  return (
    <ThemeModeProvider>
      <ConfigProvider
        // Configure endpoint when you have a backend
        // endpoint="/api/config"
        useFallbackOnError={true}
      >
        <RegistryProvider registry={registry}>
          <AppWithAuth registry={registry} />
        </RegistryProvider>
      </ConfigProvider>
    </ThemeModeProvider>
  );
}

export function App() {
  // Create registry once
  const registry = useMemo(() => createRegistry(), []);

  return (
    <ErrorBoundary onError={handleGlobalError} onReset={() => window.location.reload()}>
      <TamaguiProvider config={config}>
        <Theme name="light">
          <AppProvider>
            <AppWithConfig registry={registry} />
          </AppProvider>
        </Theme>
      </TamaguiProvider>
    </ErrorBoundary>
  );
}
