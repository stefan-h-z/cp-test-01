import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Heading, BodyText, Button, Spinner, Section } from '@app/ui';
import { useAuth, useAppConfig } from '@app/shared';
import type { AuthProviderType } from '@app/types';

const providerLabels: Record<AuthProviderType, string> = {
  google: 'Google',
  entra: 'Microsoft',
};

export default function LoginScreen() {
  const router = useRouter();
  const config = useAppConfig();
  const { login, isLoading, error, clearError, availableProviders, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.replace('/(tabs)');
    return null;
  }

  const handleLogin = async (provider: AuthProviderType) => {
    clearError();
    try {
      await login(provider);
      router.replace('/(tabs)');
    } catch {
      // Error is handled by the auth context
    }
  };

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
          elevate
        >
          <Section alignItems="center" gap="$2">
            <Heading level={2}>{config.name}</Heading>
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
                onPress={() => handleLogin(provider.type)}
                backgroundColor="$background"
              >
                <XStack alignItems="center" gap="$2">
                  {isLoading ? (
                    <Spinner size="small" />
                  ) : null}
                  <BodyText>Continue with {providerLabels[provider.type]}</BodyText>
                </XStack>
              </Button>
            ))}
          </YStack>

          <BodyText size="sm" muted textAlign="center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </BodyText>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
