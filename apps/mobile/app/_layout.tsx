import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { TamaguiProvider, Theme } from '@app/ui';
import { AppProvider } from '@app/shared';
import { config } from '../tamagui.config';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <AppProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
          <StatusBar style="auto" />
        </AppProvider>
      </Theme>
    </TamaguiProvider>
  );
}
