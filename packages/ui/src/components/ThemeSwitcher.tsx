import type { ThemeMode } from '@app/types';
import { Sun, Moon, Monitor, Check } from '@tamagui/lucide-icons';
import React from 'react';
import { XStack, YStack, Text, styled } from 'tamagui';

export interface ThemeSwitcherProps {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  onModeChange: (mode: ThemeMode) => void;
  onToggle?: () => void;
  variant?: 'toggle' | 'buttons' | 'dropdown' | 'icon-only';
  showLabels?: boolean;
  labels?: {
    light?: string;
    dark?: string;
    system?: string;
  };
}

const defaultLabels = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const ToggleButton = styled(XStack, {
  paddingVertical: '$2',
  paddingHorizontal: '$3',
  borderRadius: '$4',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  cursor: 'pointer',
  borderWidth: 1,
  borderColor: '$gray6',
  backgroundColor: '$background',
  pressStyle: {
    backgroundColor: '$gray3',
  },
  hoverStyle: {
    backgroundColor: '$gray2',
  },
});

const ModeButton = styled(XStack, {
  paddingVertical: '$2',
  paddingHorizontal: '$3',
  borderRadius: '$2',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  cursor: 'pointer',
  variants: {
    isActive: {
      true: {
        backgroundColor: '$blue3',
        borderWidth: 1,
        borderColor: '$blue8',
      },
      false: {
        backgroundColor: '$gray2',
        borderWidth: 1,
        borderColor: '$gray6',
        pressStyle: {
          backgroundColor: '$gray3',
        },
        hoverStyle: {
          backgroundColor: '$gray3',
        },
      },
    },
  } as const,
});

const IconButton = styled(XStack, {
  width: 40,
  height: 40,
  borderRadius: '$4',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  borderWidth: 1,
  borderColor: '$gray6',
  backgroundColor: '$background',
  pressStyle: {
    backgroundColor: '$gray3',
  },
  hoverStyle: {
    backgroundColor: '$gray2',
  },
});

export function ThemeSwitcher({
  mode,
  resolvedMode,
  onModeChange,
  onToggle,
  variant = 'buttons',
  showLabels = true,
  labels = defaultLabels,
}: ThemeSwitcherProps) {
  const mergedLabels = { ...defaultLabels, ...labels };

  const getIcon = (themeMode: ThemeMode | 'light' | 'dark', size = 18) => {
    switch (themeMode) {
      case 'light':
        return <Sun size={size} color={mode === 'light' || (mode === 'system' && resolvedMode === 'light') ? '$blue10' : '$gray10'} />;
      case 'dark':
        return <Moon size={size} color={mode === 'dark' || (mode === 'system' && resolvedMode === 'dark') ? '$blue10' : '$gray10'} />;
      case 'system':
        return <Monitor size={size} color={mode === 'system' ? '$blue10' : '$gray10'} />;
    }
  };

  // Simple toggle variant - just switches between light and dark
  if (variant === 'toggle') {
    return (
      <ToggleButton onPress={onToggle}>
        {resolvedMode === 'light' ? (
          <Sun size={18} color="$yellow10" />
        ) : (
          <Moon size={18} color="$blue10" />
        )}
        {showLabels && (
          <Text fontSize="$2" color="$gray11">
            {resolvedMode === 'light' ? mergedLabels.light : mergedLabels.dark}
          </Text>
        )}
      </ToggleButton>
    );
  }

  // Icon only variant
  if (variant === 'icon-only') {
    return (
      <IconButton onPress={onToggle}>
        {resolvedMode === 'light' ? (
          <Sun size={20} color="$yellow10" />
        ) : (
          <Moon size={20} color="$blue10" />
        )}
      </IconButton>
    );
  }

  // Dropdown variant
  if (variant === 'dropdown') {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <YStack position="relative">
        <ToggleButton onPress={() => setIsOpen(!isOpen)}>
          {getIcon(mode)}
          {showLabels && (
            <Text fontSize="$2" color="$gray11">
              {mergedLabels[mode]}
            </Text>
          )}
        </ToggleButton>

        {isOpen && (
          <>
            {/* Backdrop */}
            <XStack
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              zIndex={10}
              onPress={() => setIsOpen(false)}
              style={{ position: 'fixed', width: '100vw', height: '100vh' } as never}
            />

            {/* Dropdown menu */}
            <YStack
              position="absolute"
              top="100%"
              right={0}
              marginTop="$1"
              backgroundColor="$background"
              borderRadius="$3"
              borderWidth={1}
              borderColor="$gray6"
              shadowColor="$shadowColor"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
              zIndex={20}
              minWidth={150}
              overflow="hidden"
            >
              {(['light', 'dark', 'system'] as ThemeMode[]).map((themeMode) => (
                <XStack
                  key={themeMode}
                  paddingVertical="$2"
                  paddingHorizontal="$3"
                  alignItems="center"
                  justifyContent="space-between"
                  gap="$2"
                  cursor="pointer"
                  backgroundColor={mode === themeMode ? '$blue3' : 'transparent'}
                  hoverStyle={{ backgroundColor: mode === themeMode ? '$blue3' : '$gray2' }}
                  onPress={() => {
                    onModeChange(themeMode);
                    setIsOpen(false);
                  }}
                >
                  <XStack alignItems="center" gap="$2">
                    {getIcon(themeMode)}
                    <Text
                      fontSize="$3"
                      color={mode === themeMode ? '$blue11' : '$gray11'}
                      fontWeight={mode === themeMode ? '500' : '400'}
                    >
                      {mergedLabels[themeMode]}
                    </Text>
                  </XStack>
                  {mode === themeMode && <Check size={16} color="$blue10" />}
                </XStack>
              ))}
            </YStack>
          </>
        )}
      </YStack>
    );
  }

  // Buttons variant (default) - shows all three options
  return (
    <XStack gap="$2">
      {(['light', 'dark', 'system'] as ThemeMode[]).map((themeMode) => (
        <ModeButton
          key={themeMode}
          isActive={mode === themeMode}
          onPress={() => onModeChange(themeMode)}
        >
          {themeMode === 'light' && <Sun size={16} color={mode === 'light' ? '$blue10' : '$gray10'} />}
          {themeMode === 'dark' && <Moon size={16} color={mode === 'dark' ? '$blue10' : '$gray10'} />}
          {themeMode === 'system' && <Monitor size={16} color={mode === 'system' ? '$blue10' : '$gray10'} />}
          {showLabels && (
            <Text
              fontSize="$2"
              color={mode === themeMode ? '$blue11' : '$gray11'}
              fontWeight={mode === themeMode ? '500' : '400'}
            >
              {mergedLabels[themeMode]}
            </Text>
          )}
        </ModeButton>
      ))}
    </XStack>
  );
}

// Compact theme toggle for headers/navbars
export function ThemeToggle({
  resolvedMode,
  onToggle,
}: {
  resolvedMode: 'light' | 'dark';
  onToggle: () => void;
}) {
  return (
    <IconButton onPress={onToggle}>
      {resolvedMode === 'light' ? (
        <Moon size={20} color="$gray11" />
      ) : (
        <Sun size={20} color="$yellow10" />
      )}
    </IconButton>
  );
}
