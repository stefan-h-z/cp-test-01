import { useRemoteNavigation, useRemoteConfig } from '@app/shared';
import type { TabDefinition, RouteDefinition, LocalizedString } from '@app/types';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, useRouter } from 'expo-router';
import { useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useTheme } from 'tamagui';
import { MobileHeader } from '../../components/MobileHeader';
import { MobileSidebar } from '../../components/MobileSidebar';
import { getIconComponent } from '../../utils/iconRegistry';
import { getScreenName, getExpoTabPath } from '../../utils/routeMapping';

function getTitle(title: string | LocalizedString | undefined, fallback: string): string {
  if (!title) return fallback;
  if (typeof title === 'string') return title;
  return title.defaultValue || fallback;
}

function FABButton() {
  const router = useRouter();
  const { tabsConfig, routes } = useRemoteNavigation();

  const fabRoute = tabsConfig?.fab ? routes.find((r) => r.id === tabsConfig.fab?.route) : null;

  const handlePress = () => {
    if (fabRoute) {
      const path = getExpoTabPath(fabRoute);
      router.push(path as Parameters<typeof router.push>[0]);
    } else {
      router.push('/(tabs)/add' as Parameters<typeof router.push>[0]);
    }
  };

  const fabIcon = tabsConfig?.fab?.icon || 'Plus';
  const IconComponent = getIconComponent(fabIcon);

  return (
    <TouchableOpacity style={styles.fabContainer} onPress={handlePress} activeOpacity={0.8}>
      <LinearGradient
        colors={['#6366f1', '#a855f7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fab}
      >
        <IconComponent size={24} color="white" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { tabsConfig, routes } = useRemoteNavigation();
  const { isFeatureEnabled } = useRemoteConfig();
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get route for a tab
  const getRouteForTab = (tab: TabDefinition): RouteDefinition | undefined => {
    return routes.find((r) => r.id === tab.route);
  };

  // Filter visible tabs
  const visibleTabs = (tabsConfig?.tabs || []).filter((tab) => {
    if (tab.hidden) return false;
    const route = getRouteForTab(tab);
    if (route?.featureFlag && !isFeatureEnabled(route.featureFlag)) return false;
    return true;
  });

  // Split tabs for FAB placement
  const fabIndex = tabsConfig?.fab ? Math.floor(visibleTabs.length / 2) : -1;

  // Derive FAB screen name for exclusion from hidden screens
  const fabRoute = tabsConfig?.fab ? routes.find((r) => r.id === tabsConfig.fab!.route) : null;
  const fabScreenName = fabRoute ? getScreenName(fabRoute) : null;

  // Compute hidden screens dynamically from config
  const visibleTabRouteIds = new Set(visibleTabs.map((t) => t.route));
  const hiddenScreens = routes
    .filter((r) => {
      if (visibleTabRouteIds.has(r.id)) return false;
      if (r.access?.type === 'public') return false;
      if (r.path.includes('/', 1)) return false;
      const screenName = getScreenName(r);
      if (screenName === fabScreenName) return false;
      return true;
    })
    .map((r) => getScreenName(r));

  return (
    <View style={{ flex: 1 }}>
      <MobileHeader onMenuOpen={() => setSidebarOpen(true)} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.blue9?.val ?? '#6366f1',
          tabBarInactiveTintColor: theme.gray10?.val ?? '#64748b',
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            backgroundColor: theme.background?.val ?? 'white',
            borderTopWidth: 1,
            borderTopColor: theme.borderColor?.val ?? '#e2e8f0',
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
          },
          tabBarShowLabel: tabsConfig?.showLabels !== false,
        }}
      >
        {/* Render tabs before FAB */}
        {visibleTabs.slice(0, fabIndex >= 0 ? fabIndex : visibleTabs.length).map((tab) => {
          const route = getRouteForTab(tab);
          if (!route) return null;

          const screenName = getScreenName(route);
          const title = getTitle(tab.title, getTitle(route.title, route.id));
          const icon = tab.icon || route.icon;
          const IconComponent = getIconComponent(icon);

          return (
            <Tabs.Screen
              key={tab.route}
              name={screenName}
              options={{
                title,
                tabBarIcon: ({ color, size }) => <IconComponent size={size} color={color} />,
              }}
            />
          );
        })}

        {/* FAB placeholder in the middle */}
        {tabsConfig?.fab && fabScreenName && (
          <Tabs.Screen
            name={fabScreenName}
            options={{
              title: '',
              tabBarButton: () => <FABButton />,
            }}
            listeners={{
              tabPress: (e) => {
                e.preventDefault();
              },
            }}
          />
        )}

        {/* Render tabs after FAB */}
        {fabIndex >= 0 &&
          visibleTabs.slice(fabIndex).map((tab) => {
            const route = getRouteForTab(tab);
            if (!route) return null;

            const screenName = getScreenName(route);
            const title = getTitle(tab.title, getTitle(route.title, route.id));
            const icon = tab.icon || route.icon;
            const IconComponent = getIconComponent(icon);

            return (
              <Tabs.Screen
                key={tab.route}
                name={screenName}
                options={{
                  title,
                  tabBarIcon: ({ color, size }) => <IconComponent size={size} color={color} />,
                }}
              />
            );
          })}

        {/* Hidden screens - registered for Expo Router but not shown in tab bar */}
        {hiddenScreens.map((name) => (
          <Tabs.Screen key={name} name={name} options={{ href: null }} />
        ))}
      </Tabs>
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
