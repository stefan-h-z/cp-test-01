import {
  AppProvider,
  AuthProvider,
  useAuth,
  useAppConfig,
  ConfigProvider,
  ThemeModeProvider,
  WidgetRegistry,
  WidgetRegistryProvider,
  registerDefaultWidgets,
} from '@app/shared';
import { TamaguiProvider, Theme, ErrorBoundary } from '@app/ui';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { MobileAuthProvider } from '../auth';
import { config } from '../tamagui.config';
import { registerMobileWidgets } from '../widgets';

SplashScreen.preventAutoHideAsync();

function createWidgetRegistry(): WidgetRegistry {
  const reg = new WidgetRegistry();
  registerDefaultWidgets(reg);
  registerMobileWidgets(reg);
  return reg;
}

// Auth navigation guard
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, authConfig } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!authConfig.enabled) return;
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, authConfig.enabled, router]);

  return <>{children}</>;
}

// Inner layout with auth
function InnerLayout() {
  const appConfig = useAppConfig();

  return (
    <AuthProvider config={appConfig.auth}>
      <MobileAuthProvider>
        <AuthGuard>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="add"
              options={{
                headerShown: false,
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                headerShown: false,
                presentation: 'modal',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="qr-scanner"
              options={{
                headerShown: false,
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </AuthGuard>
      </MobileAuthProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const widgetRegistry = useMemo(() => createWidgetRegistry(), []);

  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.hideAsync();
      setAppReady(true);
    };
    prepare();
  }, []);

  if (!appReady) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <AppProvider>
          <ThemeModeProvider>
            <ConfigProvider useFallbackOnError={true}>
              <WidgetRegistryProvider registry={widgetRegistry}>
                <ErrorBoundary
                  onError={(error, errorInfo) => {
                    console.error('Mobile app error:', error);
                    console.error('Component stack:', errorInfo.componentStack);
                  }}
                >
                  <InnerLayout />
                </ErrorBoundary>
              </WidgetRegistryProvider>
            </ConfigProvider>
          </ThemeModeProvider>
        </AppProvider>
      </Theme>
    </TamaguiProvider>
  );
}
