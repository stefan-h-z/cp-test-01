import { useAuth, useRemoteNavigation, useRemoteConfig, useThemeMode } from '@app/shared';
import type { RouteDefinition, SidebarRouteItem, SidebarGroup, LocalizedString } from '@app/types';
import { XStack, YStack, BodyText, Heading, Button } from '@app/ui';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from 'tamagui';
import { getIcon } from '../utils/iconRegistry';

function getTitle(title: string | LocalizedString | undefined, fallback: string): string {
  if (!title) return fallback;
  if (typeof title === 'string') return title;
  return title.defaultValue || fallback;
}

// Close icon component
function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface ConfigurableSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigurableSidebar({ isOpen, onClose }: ConfigurableSidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { routes, sidebarConfig } = useRemoteNavigation();
  const { isFeatureEnabled } = useRemoteConfig();
  const { resolvedMode, toggleMode } = useThemeMode();
  const isDarkMode = resolvedMode === 'dark';

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    onClose();
  };

  // Get route definition for a sidebar item
  const getRouteForItem = (item: SidebarRouteItem): RouteDefinition | undefined => {
    return routes.find((r) => r.id === item.route);
  };

  // Filter visible items (feature flag enabled if specified)
  const isItemVisible = (item: SidebarRouteItem): boolean => {
    const route = getRouteForItem(item);
    if (!route) return false;
    if (route.featureFlag && !isFeatureEnabled(route.featureFlag)) return false;
    return true;
  };

  const renderItem = (item: SidebarRouteItem) => {
    const route = getRouteForItem(item);
    if (!route || !isItemVisible(item)) return null;

    const title = getTitle(item.title, getTitle(route.title, route.id));
    const icon = item.icon || route.icon;

    return (
      <XStack
        key={item.route}
        padding="$3"
        borderRadius="$3"
        cursor="pointer"
        hoverStyle={{ backgroundColor: isDarkMode ? '$neutral800' : '$neutral100' }}
        alignItems="center"
        gap="$3"
        onPress={() => handleNavigation(route.path)}
      >
        {getIcon(icon)}
        <BodyText color={isDarkMode ? 'white' : undefined}>{title}</BodyText>
        {item.badge && (
          <YStack
            backgroundColor="$primary500"
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$full"
            marginLeft="auto"
          >
            <BodyText size="xs" color="white">
              {item.badge}
            </BodyText>
          </YStack>
        )}
      </XStack>
    );
  };

  const renderGroup = (group: SidebarGroup) => {
    const visibleItems = group.items.filter(isItemVisible);
    if (visibleItems.length === 0) return null;

    const title = group.title ? getTitle(group.title, group.id) : undefined;

    return (
      <YStack key={group.id} gap="$1">
        {title && (
          <BodyText
            size="sm"
            color={isDarkMode ? '$neutral400' : '$neutral500'}
            paddingHorizontal="$3"
            paddingVertical="$2"
            fontWeight="600"
          >
            {title}
          </BodyText>
        )}
        {visibleItems.map(renderItem)}
      </YStack>
    );
  };

  if (!isOpen) return null;

  // Get groups from config, or create a default group from sidebar routes
  const groups = sidebarConfig?.groups || [
    {
      id: 'default',
      items: routes
        .filter((r) => r.visibility?.showInSidebar)
        .map((r) => ({ route: r.id, icon: r.icon })),
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <YStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor="rgba(0, 0, 0, 0.5)"
        zIndex={200}
        onPress={onClose}
        style={{ cursor: 'pointer', position: 'fixed' } as CSSProperties}
      />

      {/* Sidebar */}
      <YStack
        position="absolute"
        top={0}
        right={0}
        bottom={0}
        width={300}
        backgroundColor={isDarkMode ? '#1a1a1a' : 'white'}
        zIndex={300}
        padding="$4"
        style={
          {
            position: 'fixed',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
            animation: 'slideIn 0.2s ease-out',
          } as CSSProperties
        }
      >
        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$6">
          <Heading level={4} color={isDarkMode ? 'white' : undefined}>
            {sidebarConfig?.header?.title || 'Menu'}
          </Heading>
          <YStack
            padding="$2"
            borderRadius="$2"
            cursor="pointer"
            hoverStyle={{ backgroundColor: isDarkMode ? '$neutral800' : '$neutral100' }}
            onPress={onClose}
          >
            <CloseIcon />
          </YStack>
        </XStack>

        {/* User Info */}
        {sidebarConfig?.header?.showUserInfo !== false && user && (
          <YStack
            backgroundColor={isDarkMode ? '$neutral800' : '$neutral100'}
            padding="$4"
            borderRadius="$4"
            marginBottom="$4"
          >
            <BodyText fontWeight="600" color={isDarkMode ? 'white' : undefined}>
              {user.name}
            </BodyText>
            <BodyText size="sm" color={isDarkMode ? '$neutral400' : '$neutral500'}>
              {user.email}
            </BodyText>
          </YStack>
        )}

        {/* Dark Mode Toggle */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          padding="$3"
          backgroundColor={isDarkMode ? '$neutral800' : '$neutral100'}
          borderRadius="$3"
          marginBottom="$4"
        >
          <BodyText color={isDarkMode ? 'white' : undefined}>Dark Mode</BodyText>
          <Switch checked={isDarkMode} onCheckedChange={() => toggleMode()} size="$3">
            <Switch.Thumb animation="quick" />
          </Switch>
        </XStack>

        {/* Menu Groups */}
        <YStack gap="$4" flex={1}>
          {groups.map(renderGroup)}
        </YStack>

        {/* Logout Button */}
        {user && (
          <Button variant="outline" onPress={handleLogout} marginTop="$4">
            Sign Out
          </Button>
        )}
      </YStack>
    </>
  );
}
