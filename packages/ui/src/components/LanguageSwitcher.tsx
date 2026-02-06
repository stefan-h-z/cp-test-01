import { Globe, Check } from '@tamagui/lucide-icons';
import React from 'react';
import { XStack, YStack, Text, styled } from 'tamagui';

export interface Language {
  code: string;
  name: string;
  isActive: boolean;
}

export interface LanguageSwitcherProps {
  currentLocale: string;
  languages: Language[];
  onLanguageChange: (locale: string) => void;
  variant?: 'dropdown' | 'inline' | 'minimal';
  showIcon?: boolean;
  showLabel?: boolean;
}

const LanguageButton = styled(XStack, {
  paddingVertical: '$2',
  paddingHorizontal: '$3',
  borderRadius: '$2',
  alignItems: 'center',
  gap: '$2',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: '$gray6',
  pressStyle: {
    backgroundColor: '$gray3',
  },
  hoverStyle: {
    backgroundColor: '$gray2',
  },
});

const LanguageOption = styled(XStack, {
  paddingVertical: '$2',
  paddingHorizontal: '$3',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$2',
  cursor: 'pointer',
  borderRadius: '$2',
  pressStyle: {
    backgroundColor: '$gray3',
  },
  hoverStyle: {
    backgroundColor: '$gray2',
  },
  variants: {
    isActive: {
      true: {
        backgroundColor: '$blue3',
      },
    },
  } as const,
});

export function LanguageSwitcher({
  currentLocale,
  languages,
  onLanguageChange,
  variant = 'inline',
  showIcon = true,
  showLabel = true,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentLanguage = languages.find((lang) => lang.code === currentLocale);

  if (variant === 'minimal') {
    return (
      <XStack gap="$2" alignItems="center">
        {languages.map((lang) => (
          <Text
            key={lang.code}
            fontSize="$2"
            color={lang.isActive ? '$blue10' : '$gray10'}
            fontWeight={lang.isActive ? '600' : '400'}
            textDecorationLine={lang.isActive ? 'underline' : 'none'}
            onPress={() => onLanguageChange(lang.code)}
            cursor="pointer"
            hoverStyle={{ color: '$blue10' }}
          >
            {lang.code.toUpperCase()}
          </Text>
        ))}
      </XStack>
    );
  }

  if (variant === 'inline') {
    return (
      <XStack gap="$1" alignItems="center">
        {showIcon && <Globe size={16} color="$gray10" />}
        {languages.map((lang, index) => (
          <React.Fragment key={lang.code}>
            {index > 0 && (
              <Text color="$gray8" fontSize="$2">
                |
              </Text>
            )}
            <Text
              fontSize="$2"
              color={lang.isActive ? '$blue10' : '$gray10'}
              fontWeight={lang.isActive ? '600' : '400'}
              onPress={() => onLanguageChange(lang.code)}
              cursor="pointer"
              hoverStyle={{ color: '$blue10' }}
              paddingHorizontal="$1"
            >
              {lang.name}
            </Text>
          </React.Fragment>
        ))}
      </XStack>
    );
  }

  // Dropdown variant
  return (
    <YStack position="relative">
      <LanguageButton onPress={() => setIsOpen(!isOpen)}>
        {showIcon && <Globe size={16} color="$gray11" />}
        {showLabel && (
          <Text fontSize="$2" color="$gray11">
            {currentLanguage?.name || currentLocale}
          </Text>
        )}
      </LanguageButton>

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
            {languages.map((lang) => (
              <LanguageOption
                key={lang.code}
                isActive={lang.isActive}
                onPress={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
              >
                <Text
                  fontSize="$3"
                  color={lang.isActive ? '$blue11' : '$gray11'}
                  fontWeight={lang.isActive ? '500' : '400'}
                >
                  {lang.name}
                </Text>
                {lang.isActive && <Check size={16} color="$blue10" />}
              </LanguageOption>
            ))}
          </YStack>
        </>
      )}
    </YStack>
  );
}

// Simple flag icons (emoji-based)
export const languageFlags: Record<string, string> = {
  en: '🇺🇸',
  de: '🇩🇪',
  fr: '🇫🇷',
  es: '🇪🇸',
  it: '🇮🇹',
  pt: '🇵🇹',
  nl: '🇳🇱',
  pl: '🇵🇱',
  ru: '🇷🇺',
  ja: '🇯🇵',
  zh: '🇨🇳',
  ko: '🇰🇷',
};
