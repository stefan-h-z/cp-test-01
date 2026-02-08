import type { TabBarProps } from '@app/types';
import {
  Home,
  Search,
  User,
  Settings,
  Bell,
  Heart,
  Star,
  Grid,
  List,
  MessageCircle,
  ShoppingCart,
  Bookmark,
} from '@tamagui/lucide-icons';
import React from 'react';
import { XStack, YStack, Text, styled } from 'tamagui';

type IconComponent = typeof Home;

// Icon mapping
const iconMap: Record<string, IconComponent> = {
  home: Home,
  search: Search,
  user: User,
  profile: User,
  settings: Settings,
  notifications: Bell,
  bell: Bell,
  favorites: Heart,
  heart: Heart,
  star: Star,
  grid: Grid,
  list: List,
  messages: MessageCircle,
  chat: MessageCircle,
  cart: ShoppingCart,
  bookmark: Bookmark,
};

const TabBarContainer = styled(XStack, {
  backgroundColor: '$background',
  borderTopWidth: 1,
  borderTopColor: '$gray5',
  paddingBottom: '$2', // Safe area padding
  variants: {
    position: {
      bottom: {
        borderTopWidth: 1,
        borderTopColor: '$gray5',
        borderBottomWidth: 0,
      },
      top: {
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '$gray5',
      },
    },
    variant: {
      default: {},
      floating: {
        margin: '$3',
        marginBottom: '$4',
        borderRadius: '$4',
        borderWidth: 1,
        borderColor: '$gray5',
        shadowColor: '$shadowColor',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      minimal: {
        borderTopWidth: 0,
        backgroundColor: 'transparent',
      },
    },
  } as const,
});

const TabItem = styled(YStack, {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: '$2',
  gap: '$1',
  cursor: 'pointer',
  pressStyle: {
    opacity: 0.7,
  },
});

const Badge = styled(XStack, {
  position: 'absolute',
  top: -4,
  right: -8,
  minWidth: 18,
  height: 18,
  borderRadius: 9,
  backgroundColor: '$red9',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: '$1',
});

const BadgeText = styled(Text, {
  color: 'white',
  fontSize: 10,
  fontWeight: '600',
});

export function TabBar({
  tabs,
  activeTab,
  onTabPress,
  position = 'bottom',
  showLabels = true,
  variant = 'default',
}: TabBarProps) {
  return (
    <TabBarContainer position={position as never} variant={variant as never}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        const IconComponent = iconMap[tab.icon.toLowerCase()] || Home;
        const showBadge = tab.showBadge !== false && tab.badge !== undefined;

        return (
          <TabItem key={tab.name} onPress={() => onTabPress(tab)}>
            <XStack position="relative">
              <IconComponent size={24} color={isActive ? '$blue10' : '$gray9'} />
              {showBadge && (
                <Badge>
                  <BadgeText>
                    {typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge}
                  </BadgeText>
                </Badge>
              )}
            </XStack>
            {showLabels && (
              <Text
                fontSize="$1"
                color={isActive ? '$blue10' : '$gray9'}
                fontWeight={isActive ? '600' : '400'}
              >
                {tab.title}
              </Text>
            )}
          </TabItem>
        );
      })}
    </TabBarContainer>
  );
}

// Compact tab bar for web headers
export function TabBarCompact({
  tabs,
  activeTab,
  onTabPress,
}: Pick<TabBarProps, 'tabs' | 'activeTab' | 'onTabPress'>) {
  return (
    <XStack gap="$1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;

        return (
          <XStack
            key={tab.name}
            paddingVertical="$2"
            paddingHorizontal="$3"
            borderRadius="$2"
            backgroundColor={isActive ? '$blue3' : 'transparent'}
            cursor="pointer"
            hoverStyle={{ backgroundColor: isActive ? '$blue3' : '$gray3' }}
            pressStyle={{ backgroundColor: '$gray4' }}
            onPress={() => onTabPress(tab)}
          >
            <Text
              fontSize="$3"
              color={isActive ? '$blue10' : '$gray11'}
              fontWeight={isActive ? '600' : '400'}
            >
              {tab.title}
            </Text>
          </XStack>
        );
      })}
    </XStack>
  );
}
