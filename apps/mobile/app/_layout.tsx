import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { TamaguiProvider, Theme } from '@app/ui';
import { AppProvider, AuthProvider, useAuth, useAppConfig } from '@app/shared';
import { config } from '../tamagui.config';
import { MobileAuthProvider } from '../auth';

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
  }, [isAuthenticated, isLoading, segments, authConfig.enabled]);

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
          <InnerLayout />
        </AppProvider>
      </Theme>
    </TamaguiProvider>
  );
}
