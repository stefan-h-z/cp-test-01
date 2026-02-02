import { useNavigate } from 'react-router-dom';
import { YStack, XStack, Heading, BodyText, Button, Spinner, Section } from '@app/ui';
import { useLoginScreenLogic } from '@app/shared';
import type { AuthProviderType } from '@app/types';

export function LoginScreen() {
  const navigate = useNavigate();
  const {
    appName,
    isLoading,
    error,
    isAuthenticated,
    availableProviders,
    getProviderLabel,
    getProviderColor,
    handleLogin,
  } = useLoginScreenLogic();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const onLogin = async (provider: AuthProviderType) => {
    const success = await handleLogin(provider);
    if (success) {
      navigate('/', { replace: true });
    }
  };

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" padding="$6">
      <YStack
        backgroundColor="$background"
        padding="$6"
        borderRadius="$4"
        width="100%"
        maxWidth={400}
        gap="$6"
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
              borderColor={getProviderColor(provider.type)}
              pressStyle={{
                backgroundColor: '$gray2',
              }}
            >
              <XStack alignItems="center" gap="$2">
                {isLoading ? (
                  <Spinner size="small" />
                ) : (
                  <ProviderIcon provider={provider.type} />
                )}
                <BodyText>Continue with {getProviderLabel(provider.type)}</BodyText>
              </XStack>
            </Button>
          ))}
        </YStack>

        <BodyText size="sm" muted textAlign="center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </BodyText>
      </YStack>
    </YStack>
  );
}

function ProviderIcon({ provider }: { provider: AuthProviderType }) {
  if (provider === 'google') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    );
  }

  if (provider === 'entra') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#F25022" d="M1 1h10v10H1z" />
        <path fill="#00A4EF" d="M13 1h10v10H13z" />
        <path fill="#7FBA00" d="M1 13h10v10H1z" />
        <path fill="#FFB900" d="M13 13h10v10H13z" />
      </svg>
    );
  }

  return null;
}
