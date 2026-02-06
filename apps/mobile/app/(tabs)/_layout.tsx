import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Activity, Calendar, List, CreditCard, Plus, Settings, QrCode } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useRemoteNavigation, useRemoteConfig } from '@app/shared';
import type { TabDefinition, RouteDefinition, LocalizedString } from '@app/types';

// Icon mapping for dynamic icons
const IconComponents: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Activity,
  Calendar,
  List,
  CreditCard,
  Plus,
  Settings,
  QrCode,
};

function getIcon(iconName: string | undefined) {
  if (!iconName) return Activity;
  return IconComponents[iconName] || Activity;
}

function getTitle(title: string | LocalizedString | undefined, fallback: string): string {
  if (!title) return fallback;
  if (typeof title === 'string') return title;
  return title.defaultValue || fallback;
}

function FABButton() {
  const router = useRouter();
  const { tabsConfig, routes } = useRemoteNavigation();

  const fabRoute = tabsConfig?.fab
    ? routes.find((r) => r.id === tabsConfig.fab!.route)
    : null;

  const handlePress = () => {
    if (fabRoute) {
      router.push(fabRoute.path as any);
    } else {
      router.push('/add');
    }
  };

  const fabIcon = tabsConfig?.fab?.icon || 'Plus';
  const IconComponent = getIcon(fabIcon);

  return (
    <TouchableOpacity
      style={styles.fabContainer}
      onPress={handlePress}
      activeOpacity={0.8}
    >
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

  // Map route id to Expo Router screen name
  const getScreenName = (routeId: string): string => {
    const routeToScreen: Record<string, string> = {
      dashboard: 'index',
      budget: 'budget',
      transactions: 'transactions',
      accounts: 'accounts',
    };
    return routeToScreen[routeId] || routeId;
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
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

        const screenName = getScreenName(tab.route);
        const title = getTitle(tab.title, getTitle(route.title, route.id));
        const icon = tab.icon || route.icon;
        const IconComponent = getIcon(icon);

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
      {tabsConfig?.fab && (
        <Tabs.Screen
          name="add"
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
      {fabIndex >= 0 && visibleTabs.slice(fabIndex).map((tab) => {
        const route = getRouteForTab(tab);
        if (!route) return null;

        const screenName = getScreenName(tab.route);
        const title = getTitle(tab.title, getTitle(route.title, route.id));
        const icon = tab.icon || route.icon;
        const IconComponent = getIcon(icon);

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

      {/* Hidden screens - still need to be registered for Expo Router */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
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
