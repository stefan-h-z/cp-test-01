import type { AppConfig } from '@app/types';

export const defaultAppConfig: AppConfig = {
  name: 'Cross Platform App',
  version: '0.1.0',
  theme: {
    primaryColor: '#007AFF',
    secondaryColor: '#5856D6',
    fontFamily: 'Inter',
    darkMode: false,
  },
  navigation: {
    initialScreen: 'Home',
    screens: [
      {
        id: 'home',
        title: 'Home',
        icon: 'home',
        component: 'HomeScreen',
        showInNav: true,
      },
      {
        id: 'explore',
        title: 'Explore',
        icon: 'search',
        component: 'ExploreScreen',
        showInNav: true,
      },
      {
        id: 'profile',
        title: 'Profile',
        icon: 'user',
        component: 'ProfileScreen',
        showInNav: true,
      },
      {
        id: 'settings',
        title: 'Settings',
        icon: 'settings',
        component: 'SettingsScreen',
        showInNav: false,
      },
    ],
  },
  features: {
    darkMode: true,
    notifications: true,
    analytics: false,
    offlineMode: true,
  },
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 30000,
  },
};

export function createAppConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    ...defaultAppConfig,
    ...overrides,
    theme: {
      ...defaultAppConfig.theme,
      ...overrides.theme,
    },
    navigation: {
      ...defaultAppConfig.navigation,
      ...overrides.navigation,
      screens: overrides.navigation?.screens ?? defaultAppConfig.navigation.screens,
    },
    features: {
      ...defaultAppConfig.features,
      ...overrides.features,
    },
    api: {
      ...defaultAppConfig.api,
      ...overrides.api,
    },
  };
}

export { type AppConfig } from '@app/types';
