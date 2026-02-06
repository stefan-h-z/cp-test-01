import { useSettingsScreenLogic } from '@app/shared';
import { YStack, XStack, Heading, BodyText, Button, Section, Separator } from '@app/ui';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Switch } from 'tamagui';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    config,
    themeMode,
    resolvedTheme,
    setThemeMode,
    toggleTheme,
    isAuthenticated,
    user,
    logout,
    features,
  } = useSettingsScreenLogic();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const isDarkMode = resolvedTheme === 'dark';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }}>
      <ScrollView style={{ flex: 1 }}>
        <YStack padding="$4" gap="$6">
          <XStack justifyContent="space-between" alignItems="center">
            <Heading level={3}>Settings</Heading>
            <Button variant="ghost" size="sm" onPress={() => router.back()}>
              Close
            </Button>
          </XStack>

          {/* Appearance Section */}
          <Section gap="$4">
            <Heading level={5}>Appearance</Heading>

            {/* Dark Mode Toggle */}
            <XStack
              backgroundColor="$background"
              padding="$4"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$borderColor"
              justifyContent="space-between"
              alignItems="center"
            >
              <YStack flex={1}>
                <BodyText fontWeight="600">Dark Mode</BodyText>
                <BodyText size="sm" muted>
                  {isDarkMode ? 'Dark theme is active' : 'Light theme is active'}
                </BodyText>
              </YStack>
              <Switch
                checked={isDarkMode}
                onCheckedChange={() => toggleTheme()}
                size="$4"
              >
                <Switch.Thumb animation="quick" />
              </Switch>
            </XStack>

            {/* Theme Mode Selection */}
            <YStack
              backgroundColor="$background"
              padding="$4"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$borderColor"
              gap="$3"
            >
              <BodyText fontWeight="600">Theme Preference</BodyText>
              <XStack gap="$2" flexWrap="wrap">
                {(['light', 'dark', 'system'] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={themeMode === mode ? 'primary' : 'outline'}
                    size="sm"
                    onPress={() => setThemeMode(mode)}
                  >
                    {mode === 'light' && 'Light'}
                    {mode === 'dark' && 'Dark'}
                    {mode === 'system' && 'System'}
                  </Button>
                ))}
              </XStack>
              <BodyText size="sm" muted>
                Current: {themeMode === 'system' ? `System (${resolvedTheme})` : themeMode}
              </BodyText>
            </YStack>
          </Section>

          <Separator />

          {/* App Info Section */}
          <Section gap="$4">
            <Heading level={5}>About</Heading>
            <YStack
              backgroundColor="$background"
              padding="$4"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$borderColor"
              gap="$3"
            >
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

          {/* Features Section */}
          <Section gap="$4">
            <Heading level={5}>Features</Heading>
            <YStack
              backgroundColor="$background"
              padding="$4"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$borderColor"
              gap="$3"
            >
              {Object.entries(features).map(([key, enabled]) => (
                <XStack key={key} justifyContent="space-between" alignItems="center">
                  <BodyText>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                  </BodyText>
                  <BodyText
                    color={enabled ? '$green10' : '$gray10'}
                    fontWeight="500"
                  >
                    {enabled ? 'Enabled' : 'Disabled'}
                  </BodyText>
                </XStack>
              ))}
            </YStack>
          </Section>

          <Separator />

          {/* Account Section */}
          {isAuthenticated && user && (
            <>
              <Section gap="$4">
                <Heading level={5}>Account</Heading>
                <YStack
                  backgroundColor="$background"
                  padding="$4"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$borderColor"
                  gap="$3"
                >
                  <XStack justifyContent="space-between">
                    <BodyText muted>Name</BodyText>
                    <BodyText>{user.name}</BodyText>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <BodyText muted>Email</BodyText>
                    <BodyText>{user.email}</BodyText>
                  </XStack>
                </YStack>
                <Button
                  variant="outline"
                  onPress={handleLogout}
                  color="$red10"
                >
                  Sign Out
                </Button>
              </Section>
              <Separator />
            </>
          )}

          {/* Links Section */}
          <Section gap="$3">
            <Button variant="outline" width="100%">
              Help & Support
            </Button>
            <Button variant="outline" width="100%">
              Privacy Policy
            </Button>
            <Button variant="outline" width="100%">
              Terms of Service
            </Button>
          </Section>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
