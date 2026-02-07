import {
  AppProvider,
  AuthProvider,
  useAuth,
  useAppConfig,
  ConfigProvider,
  ComponentRegistry,
  RegistryProvider,
  WidgetRegistry,
  WidgetRegistryProvider,
  useRemoteNavigation,
  useRemoteConfig,
  ThemeModeProvider,
  useThemeMode,
  DynamicScreen,
  ScreenNotFound,
  registerDefaultWidgets,
} from '@app/shared';
import type { ActionExecutorDeps } from '@app/shared';
import type { RouteDefinition } from '@app/types';
import { TamaguiProvider, Theme, ErrorBoundary, YStack, Heading, BodyText } from '@app/ui';
import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { WebAuthProvider } from './auth';
import { ConfigurableDashboardLayout } from './ConfigurableDashboardLayout';
import { LoginScreen, AuthCallbackScreen, SettingsScreen } from './screens';
import { config } from './tamagui.config';
import { registerWebWidgets } from './widgets';

// Global error handler for logging
function handleGlobalError(error: Error, errorInfo: React.ErrorInfo) {
  console.error('Global error caught:', error);
  console.error('Component stack:', errorInfo.componentStack);
}

// Placeholder screen for screens not yet registered
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

// Create and configure the component registry (only hardcoded screens)
function createRegistry(): ComponentRegistry {
  const registry = new ComponentRegistry();

  registry.registerScreens({
    LoginScreen,
    AuthCallbackScreen,
    SettingsScreen,
  });

  registry.registerLayouts({
    AuthLayout: ({ children }: { children: ReactNode }) => <>{children}</>,
    DashboardLayout: ConfigurableDashboardLayout,
  });

  return registry;
}

// Create and configure the widget registry
function createWidgetReg(): WidgetRegistry {
  const reg = new WidgetRegistry();
  registerDefaultWidgets(reg);
  registerWebWidgets(reg);
  return reg;
}

// Route wrapper for access control
function RouteWrapper({ route, children }: { route: RouteDefinition; children: ReactNode }) {
  const { isAuthenticated, isLoading, authConfig } = useAuth();
  const { isFeatureEnabled } = useRemoteConfig();
  const location = useLocation();

  if (route.featureFlag && !isFeatureEnabled(route.featureFlag)) {
    return <Navigate to="/" replace />;
  }

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

// Screen renderer: config-driven (screenCode) takes priority, then registry
function ScreenRenderer({
  route,
  registry,
}: {
  route: RouteDefinition;
  registry: ComponentRegistry;
}) {
  const { config } = useRemoteConfig();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toggleMode } = useThemeMode();

  const actionDeps: ActionExecutorDeps = useMemo(
    () => ({
      logout,
      toggleTheme: toggleMode,
    }),
    [logout, toggleMode]
  );

  // If route has a screenCode, render via DynamicScreen
  if (route.screenCode) {
    const screenDef = config?.screens?.[route.screenCode];
    if (!screenDef) {
      return <ScreenNotFound screenCode={route.screenCode} />;
    }
    return (
      <DynamicScreen
        screenDef={screenDef}
        config={config}
        navigate={navigate}
        goBack={() => window.history.back()}
        actionDeps={actionDeps}
      />
    );
  }

  // Otherwise, fall back to hardcoded registry
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
function AppWithConfig({
  registry,
  widgetRegistry,
}: {
  registry: ComponentRegistry;
  widgetRegistry: WidgetRegistry;
}) {
  return (
    <ThemeModeProvider>
      <ConfigProvider useFallbackOnError={true}>
        <RegistryProvider registry={registry}>
          <WidgetRegistryProvider registry={widgetRegistry}>
            <AppWithAuth registry={registry} />
          </WidgetRegistryProvider>
        </RegistryProvider>
      </ConfigProvider>
    </ThemeModeProvider>
  );
}

export function App() {
  const registry = useMemo(() => createRegistry(), []);
  const widgetRegistry = useMemo(() => createWidgetReg(), []);

  return (
    <ErrorBoundary onError={handleGlobalError} onReset={() => window.location.reload()}>
      <TamaguiProvider config={config}>
        <Theme name="light">
          <AppProvider>
            <AppWithConfig registry={registry} widgetRegistry={widgetRegistry} />
          </AppProvider>
        </Theme>
      </TamaguiProvider>
    </ErrorBoundary>
  );
}
