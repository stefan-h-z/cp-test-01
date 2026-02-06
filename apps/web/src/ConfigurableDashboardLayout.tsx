import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { XStack, YStack, Heading } from '@app/ui';
import { useRemoteConfig, useThemeMode } from '@app/shared';
import { ConfigurableSidebar } from './components/ConfigurableSidebar';
import { ConfigurableTabs } from './components/ConfigurableTabs';

// Menu icon component
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

// Header Component
function Header({ onMenuOpen }: { onMenuOpen: () => void }) {
  const { config } = useRemoteConfig();
  const { resolvedMode } = useThemeMode();
  const isDarkMode = resolvedMode === 'dark';

  const appName = config?.name || 'App';

  return (
    <XStack
      backgroundColor={isDarkMode ? '#1a1a1a' : 'white'}
      paddingHorizontal="$4"
      paddingVertical="$3"
      alignItems="center"
      justifyContent="space-between"
      borderBottomWidth={1}
      borderBottomColor={isDarkMode ? '$neutral700' : '$neutral200'}
    >
      <Heading level={4} color={isDarkMode ? 'white' : undefined}>
        {appName}
      </Heading>
      <YStack
        padding="$2"
        borderRadius="$2"
        cursor="pointer"
        hoverStyle={{ backgroundColor: isDarkMode ? '$neutral800' : '$neutral100' }}
        onPress={onMenuOpen}
      >
        <MenuIcon />
      </YStack>
    </XStack>
  );
}

export function ConfigurableDashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { resolvedMode } = useThemeMode();
  const isDarkMode = resolvedMode === 'dark';

  return (
    <YStack flex={1} minHeight="100vh" backgroundColor={isDarkMode ? '#121212' : '$neutral100'}>
      {/* Header with Menu */}
      <Header onMenuOpen={() => setMenuOpen(true)} />

      {/* Config-driven Sidebar Menu */}
      <ConfigurableSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main Content with padding for bottom tab */}
      <YStack flex={1} paddingBottom={80}>
        <Outlet />
      </YStack>

      {/* Config-driven Bottom Tab Bar */}
      <ConfigurableTabs />
    </YStack>
  );
}
