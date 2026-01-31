import React, { useState } from 'react';
import { YStack, XStack, Text, styled, ScrollView } from 'tamagui';
import {
  X,
  ChevronRight,
  ChevronDown,
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
  LogOut,
  HelpCircle,
  Info,
  type LucideIcon,
} from '@tamagui/lucide-icons';
import type { SidebarProps, SidebarItem, SidebarConfig } from '@app/types';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
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
  logout: LogOut,
  help: HelpCircle,
  info: Info,
};

const Overlay = styled(XStack, {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 999,
});

const SidebarContainer = styled(YStack, {
  backgroundColor: '$background',
  height: '100%',
  borderRightWidth: 1,
  borderRightColor: '$gray5',
  zIndex: 1000,
  variants: {
    position: {
      left: {
        borderRightWidth: 1,
        borderLeftWidth: 0,
      },
      right: {
        borderRightWidth: 0,
        borderLeftWidth: 1,
        borderLeftColor: '$gray5',
      },
    },
  } as const,
});

const SidebarHeader = styled(XStack, {
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  borderBottomWidth: 1,
  borderBottomColor: '$gray5',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const CloseButton = styled(XStack, {
  width: 32,
  height: 32,
  borderRadius: '$2',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  hoverStyle: {
    backgroundColor: '$gray4',
  },
  pressStyle: {
    backgroundColor: '$gray5',
  },
});

const MenuItem = styled(XStack, {
  paddingVertical: '$3',
  paddingHorizontal: '$4',
  alignItems: 'center',
  gap: '$3',
  cursor: 'pointer',
  borderRadius: '$2',
  marginHorizontal: '$2',
  marginVertical: '$0.5',
  hoverStyle: {
    backgroundColor: '$gray3',
  },
  pressStyle: {
    backgroundColor: '$gray4',
  },
  variants: {
    isActive: {
      true: {
        backgroundColor: '$blue3',
      },
    },
    isNested: {
      true: {
        paddingLeft: '$8',
      },
    },
  } as const,
});

const Divider = styled(XStack, {
  height: 1,
  backgroundColor: '$gray5',
  marginVertical: '$2',
  marginHorizontal: '$4',
});

const Badge = styled(XStack, {
  minWidth: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: '$red9',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: '$1',
});

const SidebarFooter = styled(YStack, {
  borderTopWidth: 1,
  borderTopColor: '$gray5',
  paddingVertical: '$2',
});

export function Sidebar({
  config,
  isOpen,
  onClose,
  activeItem,
  onItemPress,
  variant = 'temporary',
  position = 'left',
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderItem = (item: SidebarItem, isNested = false) => {
    if (item.divider) {
      return <Divider key={item.id} />;
    }

    const IconComponent = item.icon ? iconMap[item.icon.toLowerCase()] : null;
    const isActive = activeItem === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <React.Fragment key={item.id}>
        <MenuItem
          isActive={isActive}
          isNested={isNested}
          onPress={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else if (item.action) {
              item.action();
            } else {
              onItemPress(item);
            }
          }}
        >
          {IconComponent && (
            <IconComponent
              size={20}
              color={isActive ? '$blue10' : '$gray10'}
            />
          )}
          <Text
            flex={1}
            fontSize="$3"
            color={isActive ? '$blue10' : '$gray12'}
            fontWeight={isActive ? '500' : '400'}
          >
            {item.title}
          </Text>
          {item.badge !== undefined && (
            <Badge>
              <Text color="white" fontSize={11} fontWeight="600">
                {typeof item.badge === 'number' && item.badge > 99
                  ? '99+'
                  : item.badge}
              </Text>
            </Badge>
          )}
          {hasChildren && (
            isExpanded ? (
              <ChevronDown size={16} color="$gray9" />
            ) : (
              <ChevronRight size={16} color="$gray9" />
            )
          )}
        </MenuItem>
        {hasChildren && isExpanded && (
          <YStack>
            {item.children!.map((child) => renderItem(child, true))}
          </YStack>
        )}
      </React.Fragment>
    );
  };

  if (!isOpen && variant === 'temporary') {
    return null;
  }

  const sidebarContent = (
    <SidebarContainer
      position={position}
      width={280}
    >
      {/* Header */}
      {config.header && (
        <SidebarHeader>
          <YStack flex={1}>
            {config.header.title && (
              <Text fontSize="$5" fontWeight="600" color="$gray12">
                {config.header.title}
              </Text>
            )}
          </YStack>
          {variant === 'temporary' && (
            <CloseButton onPress={onClose}>
              <X size={20} color="$gray10" />
            </CloseButton>
          )}
        </SidebarHeader>
      )}

      {/* Navigation Items */}
      <ScrollView flex={1}>
        <YStack paddingVertical="$2">
          {config.items.map((item) => renderItem(item))}
        </YStack>
      </ScrollView>

      {/* Footer */}
      {config.footer && (
        <SidebarFooter>
          {config.footer.items?.map((item) => renderItem(item))}
          {config.footer.showVersion && (
            <Text
              fontSize="$1"
              color="$gray9"
              textAlign="center"
              paddingVertical="$2"
            >
              Version 1.0.0
            </Text>
          )}
        </SidebarFooter>
      )}
    </SidebarContainer>
  );

  // Temporary variant with overlay
  if (variant === 'temporary') {
    return (
      <Overlay
        onPress={onClose}
        style={{ position: 'fixed' } as never}
      >
        <XStack
          onPress={(e) => e.stopPropagation()}
          height="100%"
          {...(position === 'right' ? { marginLeft: 'auto' } : {})}
        >
          {sidebarContent}
        </XStack>
      </Overlay>
    );
  }

  // Permanent or persistent variant
  return sidebarContent;
}

// Hamburger menu button
export function MenuButton({ onPress }: { onPress: () => void }) {
  return (
    <XStack
      width={40}
      height={40}
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      borderRadius="$2"
      hoverStyle={{ backgroundColor: '$gray3' }}
      pressStyle={{ backgroundColor: '$gray4' }}
      onPress={onPress}
    >
      <YStack gap="$1">
        <XStack width={20} height={2} backgroundColor="$gray11" borderRadius={1} />
        <XStack width={20} height={2} backgroundColor="$gray11" borderRadius={1} />
        <XStack width={20} height={2} backgroundColor="$gray11" borderRadius={1} />
      </YStack>
    </XStack>
  );
}
