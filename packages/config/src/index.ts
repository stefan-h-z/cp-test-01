import type { AppConfig, AuthConfig, I18nAppConfig } from '@app/types';
import { getEnvironmentConfig } from './env';

// Re-export environment utilities
export * from './env';

// Default i18n configuration
export const defaultI18nConfig: I18nAppConfig = {
  defaultLocale: 'en',
  fallbackLocale: 'en',
  supportedLocales: ['en', 'de'],
  detectBrowserLanguage: true,
  persistLocale: true,
};

// Default auth configuration - replace with your actual client IDs
export const defaultAuthConfig: AuthConfig = {
  enabled: true,
  providers: [
    {
      type: 'google',
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
      iosClientId: process.env.GOOGLE_IOS_CLIENT_ID || 'YOUR_GOOGLE_IOS_CLIENT_ID',
      androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID || 'YOUR_GOOGLE_ANDROID_CLIENT_ID',
      scopes: ['openid', 'profile', 'email'],
    },
    {
      type: 'entra',
      enabled: true,
      clientId: process.env.ENTRA_CLIENT_ID || 'YOUR_ENTRA_CLIENT_ID',
      tenantId: process.env.ENTRA_TENANT_ID || 'common', // 'common' for multi-tenant, or specific tenant ID
      scopes: ['openid', 'profile', 'email', 'User.Read'],
    },
  ],
  redirectUri: process.env.AUTH_REDIRECT_URI || 'http://localhost:5173/auth/callback',
  postLogoutRedirectUri: process.env.AUTH_POST_LOGOUT_URI || 'http://localhost:5173',
};

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
    baseUrl: getEnvironmentConfig().apiBaseUrl,
    timeout: getEnvironmentConfig().apiTimeout,
  },
  auth: defaultAuthConfig,
  i18n: defaultI18nConfig,
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
    auth: {
      ...defaultAppConfig.auth,
      ...overrides.auth,
      providers: overrides.auth?.providers ?? defaultAppConfig.auth.providers,
    },
    i18n: {
      ...defaultAppConfig.i18n,
      ...overrides.i18n,
      supportedLocales: overrides.i18n?.supportedLocales ?? defaultAppConfig.i18n.supportedLocales,
    },
  };
}

export {
  type AppConfig,
  type AuthConfig,
  type AuthProviderConfig,
  type I18nAppConfig,
} from '@app/types';
