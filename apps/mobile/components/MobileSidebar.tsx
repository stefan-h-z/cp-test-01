import { useAuth, useRemoteNavigation, useRemoteConfig, useThemeMode } from '@app/shared';
import type { RouteDefinition, SidebarRouteItem, SidebarGroup, LocalizedString } from '@app/types';
import { XStack, YStack, BodyText, Heading, Button } from '@app/ui';
import { Activity, Calendar, List, CreditCard, Settings, QrCode, X } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { Switch } from 'tamagui';

const IconComponents: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Activity,
  Calendar,
  List,
  CreditCard,
  Settings,
  QrCode,
};

function getIcon(iconName: string | undefined, color: string) {
  if (!iconName) return null;
  const IconComponent = IconComponents[iconName];
  if (IconComponent) {
    return <IconComponent size={20} color={color} />;
  }
  return null;
}

function getTitle(title: string | LocalizedString | undefined, fallback: string): string {
  if (!title) return fallback;
  if (typeof title === 'string') return title;
  return title.defaultValue || fallback;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Map route IDs to Expo Router paths
const routeToPath: Record<string, string> = {
  home: '/(tabs)',
  dashboard: '/(tabs)',
  budget: '/(tabs)/budget',
  transactions: '/(tabs)/transactions',
  accounts: '/(tabs)/accounts',
  settings: '/(tabs)/settings',
  'qr-scanner': '/(tabs)/qr-scanner',
  'workflow-demo': '/(tabs)/workflow-demo',
};

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { routes, sidebarConfig } = useRemoteNavigation();
  const { isFeatureEnabled } = useRemoteConfig();
  const { resolvedMode, toggleMode } = useThemeMode();
  const isDarkMode = resolvedMode === 'dark';

  const handleNavigation = (route: RouteDefinition) => {
    const path = routeToPath[route.id] || route.path;
    router.push(path as Parameters<typeof router.push>[0]);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
    onClose();
  };

  const getRouteForItem = (item: SidebarRouteItem): RouteDefinition | undefined => {
    return routes.find((r) => r.id === item.route);
  };

  const isItemVisible = (item: SidebarRouteItem): boolean => {
    const route = getRouteForItem(item);
    if (!route) return false;
    if (route.featureFlag && !isFeatureEnabled(route.featureFlag)) return false;
    return true;
  };

  const iconColor = isDarkMode ? 'white' : 'black';

  const renderItem = (item: SidebarRouteItem) => {
    const route = getRouteForItem(item);
    if (!route || !isItemVisible(item)) return null;

    const title = getTitle(item.title, getTitle(route.title, route.id));
    const icon = item.icon || route.icon;

    return (
      <Pressable key={item.route} onPress={() => handleNavigation(route)}>
        <XStack padding="$3" borderRadius="$3" alignItems="center" gap="$3">
          {getIcon(icon, iconColor)}
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
      </Pressable>
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

  const groups = sidebarConfig?.groups || [
    {
      id: 'default',
      items: routes
        .filter((r) => r.visibility?.showInSidebar)
        .map((r) => ({ route: r.id, icon: r.icon })),
    },
  ];

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Sidebar panel - stop propagation so tapping inside doesn't close */}
        <Pressable
          style={[styles.panel, { backgroundColor: isDarkMode ? '#1a1a1a' : 'white' }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <XStack justifyContent="space-between" alignItems="center" marginBottom="$6">
            <Heading level={4} color={isDarkMode ? 'white' : undefined}>
              {sidebarConfig?.header?.title || 'Menu'}
            </Heading>
            <Pressable onPress={onClose}>
              <YStack padding="$2" borderRadius="$2">
                <X size={24} color={isDarkMode ? 'white' : 'black'} />
              </YStack>
            </Pressable>
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  panel: {
    width: 300,
    flex: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
});
