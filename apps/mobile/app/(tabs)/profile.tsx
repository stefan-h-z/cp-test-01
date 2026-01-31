import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { YStack, XStack, Section, Heading, BodyText, Button, Separator, Image } from '@app/ui';
import { useAppConfig, useFeatureFlag, useAuth } from '@app/shared';

export default function ProfileScreen() {
  const router = useRouter();
  const config = useAppConfig();
  const darkModeEnabled = useFeatureFlag('darkMode');
  const { user, isAuthenticated, logout, authConfig } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  // Get display name and email (use auth user if available, otherwise defaults)
  const displayName = user?.name || 'Guest User';
  const displayEmail = user?.email || 'Not signed in';
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <ScrollView style={{ flex: 1 }}>
      <YStack padding="$4" gap="$6">
        {/* Profile Header */}
        <Section alignItems="center" gap="$4">
          {user?.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              width={100}
              height={100}
              borderRadius={50}
            />
          ) : (
            <YStack
              width={100}
              height={100}
              borderRadius={50}
              backgroundColor="$blue5"
              alignItems="center"
              justifyContent="center"
            >
              <Heading level={2}>{displayInitial}</Heading>
            </YStack>
          )}
          <YStack alignItems="center" gap="$1">
            <Heading level={3}>{displayName}</Heading>
            <BodyText muted>{displayEmail}</BodyText>
            {user?.provider && (
              <BodyText size="sm" muted>
                Signed in with {user.provider === 'google' ? 'Google' : 'Microsoft'}
              </BodyText>
            )}
          </YStack>
          {isAuthenticated && (
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          )}
        </Section>

        <Separator />

        {/* App Info */}
        <Section gap="$4">
          <Heading level={4}>App Information</Heading>
          <YStack gap="$3">
            <XStack justifyContent="space-between">
              <BodyText muted>App Name</BodyText>
              <BodyText>{config.name}</BodyText>
            </XStack>
            <XStack justifyContent="space-between">
              <BodyText muted>Version</BodyText>
              <BodyText>{config.version}</BodyText>
            </XStack>
            <XStack justifyContent="space-between">
              <BodyText muted>API Endpoint</BodyText>
              <BodyText numberOfLines={1} flex={1} textAlign="right">
                {config.api.baseUrl}
              </BodyText>
            </XStack>
          </YStack>
        </Section>

        <Separator />

        {/* Settings */}
        <Section gap="$4">
          <Heading level={4}>Settings</Heading>
          <YStack gap="$3">
            <XStack
              backgroundColor="$background"
              padding="$4"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$borderColor"
              justifyContent="space-between"
              alignItems="center"
            >
              <BodyText>Dark Mode</BodyText>
              <BodyText muted>{darkModeEnabled ? 'Available' : 'Not Available'}</BodyText>
            </XStack>
            <XStack
              backgroundColor="$background"
              padding="$4"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$borderColor"
              justifyContent="space-between"
              alignItems="center"
            >
              <BodyText>Notifications</BodyText>
              <BodyText muted>
                {config.features.notifications ? 'Enabled' : 'Disabled'}
              </BodyText>
            </XStack>
            <XStack
              backgroundColor="$background"
              padding="$4"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$borderColor"
              justifyContent="space-between"
              alignItems="center"
            >
              <BodyText>Offline Mode</BodyText>
              <BodyText muted>
                {config.features.offlineMode ? 'Enabled' : 'Disabled'}
              </BodyText>
            </XStack>
          </YStack>
        </Section>

        <Separator />

        {/* Actions */}
        <Section gap="$3">
          <Button variant="outline" width="100%">
            Help & Support
          </Button>
          <Button variant="outline" width="100%">
            Privacy Policy
          </Button>
          {authConfig.enabled && isAuthenticated && (
            <Button
              variant="ghost"
              width="100%"
              color="$red10"
              onPress={handleLogout}
            >
              Sign Out
            </Button>
          )}
        </Section>
      </YStack>
    </ScrollView>
  );
}
