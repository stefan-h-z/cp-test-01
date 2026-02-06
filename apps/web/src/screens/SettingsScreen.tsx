import { useNavigate } from 'react-router-dom';
import { YStack, XStack, Heading, BodyText, Button, Section, Separator } from '@app/ui';
import { Switch } from 'tamagui';
import { useSettingsScreenLogic } from '@app/shared';

export function SettingsScreen() {
  const navigate = useNavigate();
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
    navigate('/login');
  };

  const isDarkMode = resolvedTheme === 'dark';

  return (
    <YStack gap="$6" paddingVertical="$4" maxWidth={600}>
      <XStack justifyContent="space-between" alignItems="center">
        <Heading level={2}>Settings</Heading>
        <Button variant="ghost" onPress={() => navigate(-1)}>
          ← Back
        </Button>
      </XStack>

      {/* Appearance Section */}
      <Section gap="$4">
        <Heading level={4}>Appearance</Heading>

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
          <YStack>
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
                {mode === 'light' && '☀️ Light'}
                {mode === 'dark' && '🌙 Dark'}
                {mode === 'system' && '💻 System'}
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
        <Heading level={4}>About</Heading>
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
            <BodyText numberOfLines={1} maxWidth={200} textAlign="right">
              {config.api.baseUrl}
            </BodyText>
          </XStack>
        </YStack>
      </Section>

      <Separator />

      {/* Features Section */}
      <Section gap="$4">
        <Heading level={4}>Features</Heading>
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
              <BodyText>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</BodyText>
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
        <Section gap="$4">
          <Heading level={4}>Account</Heading>
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
  );
}
