import { useRemoteNavigation, useRemoteConfig, useThemeMode } from '@app/shared';
import type { RouteDefinition, TabDefinition, LocalizedString } from '@app/types';
import { XStack, YStack, BodyText } from '@app/ui';
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Icon components
const IconMap: Record<string, React.FC<{ active?: boolean }>> = {
  Activity: ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  Calendar: ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  List: ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  CreditCard: ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  Plus: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

function getIcon(iconName: string, active: boolean = false) {
  const IconComponent = IconMap[iconName];
  if (IconComponent) {
    return <IconComponent active={active} />;
  }
  return null;
}

function getTitle(title: string | LocalizedString | undefined, fallback: string): string {
  if (!title) return fallback;
  if (typeof title === 'string') return title;
  return title.defaultValue || fallback;
}

interface ConfigurableTabsProps {
  className?: string;
}

export function ConfigurableTabs({ className }: ConfigurableTabsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { routes, tabsConfig } = useRemoteNavigation();
  const { isFeatureEnabled } = useRemoteConfig();
  const { resolvedMode } = useThemeMode();
  const isDarkMode = resolvedMode === 'dark';

  if (!tabsConfig) return null;

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  // Get route definition for a tab
  const getRouteForTab = (tab: TabDefinition): RouteDefinition | undefined => {
    return routes.find((r) => r.id === tab.route);
  };

  // Filter visible tabs (not hidden and feature flag enabled if specified)
  const visibleTabs = tabsConfig.tabs.filter((tab) => {
    if (tab.hidden) return false;
    const route = getRouteForTab(tab);
    if (route?.featureFlag && !isFeatureEnabled(route.featureFlag)) return false;
    return true;
  });

  // Split tabs for FAB placement
  const fabIndex = tabsConfig.fab ? Math.floor(visibleTabs.length / 2) : -1;
  const leftTabs = fabIndex >= 0 ? visibleTabs.slice(0, fabIndex) : visibleTabs;
  const rightTabs = fabIndex >= 0 ? visibleTabs.slice(fabIndex) : [];

  const renderTab = (tab: TabDefinition) => {
    const route = getRouteForTab(tab);
    if (!route) return null;

    const active = isActive(route.path);
    const title = getTitle(tab.title, getTitle(route.title, route.id));
    const icon = tab.icon || route.icon;

    return (
      <YStack
        key={tab.route}
        alignItems="center"
        gap="$1"
        padding="$2"
        opacity={active ? 1 : 0.6}
        cursor="pointer"
        hoverStyle={{ opacity: 0.8 }}
        onPress={() => navigate(route.path)}
      >
        <YStack>
          {icon && getIcon(icon, active)}
        </YStack>
        {tabsConfig.showLabels !== false && (
          <BodyText
            size="xs"
            color={active ? '$primary500' : isDarkMode ? '$neutral400' : '$neutral500'}
            fontWeight={active ? '600' : '400'}
          >
            {title}
          </BodyText>
        )}
      </YStack>
    );
  };

  const renderFab = () => {
    if (!tabsConfig.fab) return null;

    const fabRoute = routes.find((r) => r.id === tabsConfig.fab?.route);
    if (!fabRoute) return null;

    return (
      <YStack
        width={56}
        height={56}
        borderRadius="$full"
        alignItems="center"
        justifyContent="center"
        marginTop="$-6"
        cursor="pointer"
        hoverStyle={{ transform: [{ scale: 1.05 }] }}
        pressStyle={{ transform: [{ scale: 0.95 }] }}
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
        }}
        onPress={() => navigate(fabRoute.path)}
      >
        {getIcon(tabsConfig.fab.icon)}
      </YStack>
    );
  };

  return (
    <XStack
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      backgroundColor={isDarkMode ? '#1a1a1a' : 'white'}
      borderTopWidth={1}
      borderTopColor={isDarkMode ? '$neutral700' : '$neutral200'}
      paddingBottom="$2"
      paddingTop="$2"
      justifyContent="space-around"
      alignItems="center"
      zIndex={100}
      className={className}
      style={{
        position: 'fixed',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
      } as CSSProperties}
    >
      {leftTabs.map(renderTab)}
      {renderFab()}
      {rightTabs.map(renderTab)}
    </XStack>
  );
}
