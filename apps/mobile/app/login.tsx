import { useLoginScreenLogic } from '@app/shared';
import type { AuthProviderType } from '@app/types';
import { YStack, XStack, Heading, BodyText, Button, Spinner, Section } from '@app/ui';
import { useRouter } from 'expo-router';
import { useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const {
    appName,
    isLoading,
    error,
    isAuthenticated,
    availableProviders,
    getProviderLabel,
    handleLogin,
  } = useLoginScreenLogic();

  // Redirect if already authenticated (must be in useEffect, not during render)
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const onLogin = useCallback(
    async (provider: AuthProviderType) => {
      const success = await handleLogin(provider);
      if (success) {
        router.replace('/(tabs)');
      }
    },
    [handleLogin, router]
  );

  // Show nothing while redirecting
  if (isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$6">
        <YStack
          backgroundColor="$background"
          padding="$6"
          borderRadius="$4"
          width="100%"
          maxWidth={400}
          gap="$6"
          elevation={4}
        >
          <Section alignItems="center" gap="$2">
            <Heading level={2}>{appName}</Heading>
            <BodyText muted textAlign="center">
              Sign in to continue
            </BodyText>
          </Section>

          {error && (
            <YStack backgroundColor="$red2" padding="$3" borderRadius="$2">
              <BodyText color="$red10" textAlign="center">
                {error}
              </BodyText>
            </YStack>
          )}

          <YStack gap="$3">
            {availableProviders.map((provider) => (
              <Button
                key={provider.type}
                variant="outline"
                size="lg"
                disabled={isLoading}
                onPress={() => onLogin(provider.type)}
                backgroundColor="$background"
              >
                <XStack alignItems="center" gap="$2">
                  {isLoading ? <Spinner size="small" /> : null}
                  <BodyText>Continue with {getProviderLabel(provider.type)}</BodyText>
                </XStack>
              </Button>
            ))}
          </YStack>

          <BodyText size="sm" muted textAlign="center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </BodyText>

          {/* Developer Login */}
          {__DEV__ && (
            <>
              <XStack alignItems="center" gap="$2" opacity={0.5}>
                <YStack flex={1} height={1} backgroundColor="$gray6" />
                <BodyText size="sm" muted>
                  DEV
                </BodyText>
                <YStack flex={1} height={1} backgroundColor="$gray6" />
              </XStack>
              <Button
                variant="outline"
                size="lg"
                disabled={isLoading}
                onPress={() => handleLogin('dev')}
                backgroundColor="$background"
                borderColor="#10B981"
                borderStyle="dashed"
              >
                <XStack alignItems="center" gap="$2">
                  {isLoading ? (
                    <Spinner size="small" />
                  ) : (
                    <BodyText color="#10B981">{'</>'}</BodyText>
                  )}
                  <BodyText>Developer Login</BodyText>
                </XStack>
              </Button>
            </>
          )}
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
