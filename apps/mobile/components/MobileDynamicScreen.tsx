import { useRemoteConfig, useAuth, useThemeMode, DynamicScreen, ScreenNotFound } from '@app/shared';
import type { ActionExecutorDeps } from '@app/shared';
import { YStack, Spinner, BodyText } from '@app/ui';
import * as Clipboard from 'expo-clipboard';
import * as ExpoLinking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from 'tamagui';

interface MobileDynamicScreenProps {
  screenCode: string;
}

/**
 * Wrapper for DynamicScreen in Expo Router.
 * Each route file passes its screenCode and this component handles the rest.
 */
export function MobileDynamicScreen({ screenCode }: MobileDynamicScreenProps) {
  const { config, isLoading } = useRemoteConfig();
  const router = useRouter();
  const { logout } = useAuth();
  const { toggleMode } = useThemeMode();
  const theme = useTheme();

  const bgColor = theme.background?.val ?? '#f1f5f9';

  const navigate = useCallback(
    (path: string) => {
      router.push(path as Parameters<typeof router.push>[0]);
    },
    [router]
  );

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const actionDeps: ActionExecutorDeps = useMemo(
    () => ({
      logout,
      toggleTheme: toggleMode,
      refresh: () => {
        const path = router.canGoBack()
          ? (router as unknown as { pathname: string }).pathname || '/(tabs)'
          : '/(tabs)';
        router.replace(path as Parameters<typeof router.replace>[0]);
      },
      copyToClipboard: async (text: string) => {
        await Clipboard.setStringAsync(text);
      },
    }),
    [logout, toggleMode, router]
  );

  const openUrl = useCallback((url: string, external: boolean) => {
    ExpoLinking.openURL(url);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" />
          <BodyText muted marginTop="$2">
            Loading...
          </BodyText>
        </YStack>
      </View>
    );
  }

  const screenDef = config?.screens?.[screenCode];

  if (!screenDef) {
    return (
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        <ScreenNotFound screenCode={screenCode} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <DynamicScreen
        screenDef={screenDef}
        config={config}
        navigate={navigate}
        goBack={goBack}
        actionDeps={actionDeps}
        openUrl={openUrl}
      />
    </View>
  );
}
