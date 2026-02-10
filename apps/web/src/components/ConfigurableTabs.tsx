import { useRemoteNavigation, useRemoteConfig, useThemeMode } from '@app/shared';
import type { RouteDefinition, TabDefinition, LocalizedString } from '@app/types';
import { XStack, YStack, BodyText } from '@app/ui';
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getIcon } from '../utils/iconRegistry';

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
        <YStack>{icon && getIcon(icon, active)}</YStack>
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
      style={
        {
          position: 'fixed',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
        } as CSSProperties
      }
    >
      {leftTabs.map(renderTab)}
      {renderFab()}
      {rightTabs.map(renderTab)}
    </XStack>
  );
}
