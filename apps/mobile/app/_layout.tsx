import {
  AppProvider,
  AuthProvider,
  useAuth,
  useAppConfig,
  ConfigProvider,
  ThemeModeProvider,
} from '@app/shared';
import { TamaguiProvider, Theme } from '@app/ui';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { MobileAuthProvider } from '../auth';
import { config } from '../tamagui.config';

SplashScreen.preventAutoHideAsync();

// Auth navigation guard
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, authConfig } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // If auth is disabled, don't redirect
    if (!authConfig.enabled) return;

    // Wait for loading to complete
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home
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
            <Stack.Screen name="details/[id]" options={{ headerShown: true, title: 'Details' }} />
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
          </Stack>
          <StatusBar style="auto" />
        </AuthGuard>
      </MobileAuthProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Hide splash screen after a short delay
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
              <InnerLayout />
            </ConfigProvider>
          </ThemeModeProvider>
        </AppProvider>
      </Theme>
    </TamaguiProvider>
  );
}
