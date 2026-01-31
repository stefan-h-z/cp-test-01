import { ScrollView } from 'react-native';
import { YStack, XStack, Section, Heading, BodyText, Button, Separator } from '@app/ui';
import { useAppConfig, useFeatureFlag } from '@app/shared';

export default function ProfileScreen() {
  const config = useAppConfig();
  const darkModeEnabled = useFeatureFlag('darkMode');

  return (
    <ScrollView style={{ flex: 1 }}>
      <YStack padding="$4" gap="$6">
        {/* Profile Header */}
        <Section alignItems="center" gap="$4">
          <YStack
            width={100}
            height={100}
            borderRadius={50}
            backgroundColor="$blue5"
            alignItems="center"
            justifyContent="center"
          >
            <Heading level={2}>U</Heading>
          </YStack>
          <YStack alignItems="center" gap="$1">
            <Heading level={3}>User Name</Heading>
            <BodyText muted>user@example.com</BodyText>
          </YStack>
          <Button variant="outline" size="sm">
            Edit Profile
          </Button>
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
          <Button variant="ghost" width="100%" color="$red10">
            Sign Out
          </Button>
        </Section>
      </YStack>
    </ScrollView>
  );
}
