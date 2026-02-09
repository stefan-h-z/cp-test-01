import { useRemoteConfig, useThemeMode } from '@app/shared';
import { XStack, Heading } from '@app/ui';
import { Menu } from '@tamagui/lucide-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack } from 'tamagui';

interface MobileHeaderProps {
  onMenuOpen: () => void;
}

export function MobileHeader({ onMenuOpen }: MobileHeaderProps) {
  const { config } = useRemoteConfig();
  const { resolvedMode } = useThemeMode();
  const isDarkMode = resolvedMode === 'dark';

  const appName = config?.name || 'App';

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: isDarkMode ? '#1a1a1a' : 'white' }}>
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
        <YStack padding="$2" borderRadius="$2" onPress={onMenuOpen}>
          <Menu size={24} color={isDarkMode ? 'white' : 'black'} />
        </YStack>
      </XStack>
    </SafeAreaView>
  );
}
