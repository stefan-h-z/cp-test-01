import type { RemoteAppConfig } from '@app/types';
import { defaultAppConfig, defaultAuthConfig, defaultI18nConfig } from '@app/config';

/**
 * Fallback configuration used when remote config is unavailable.
 * This provides a working app even when offline or backend is down.
 */
export const fallbackConfig: RemoteAppConfig = {
  ...defaultAppConfig,
  name: 'FinanceApp',
  version: '1.0.0',

  navigation: {
    ...defaultAppConfig.navigation,
    initialRoute: 'dashboard',
    routes: [
      {
        id: 'dashboard',
        path: '/',
        title: 'Dashboard',
        icon: 'Activity',
        screen: 'DashboardScreen',
        access: { type: 'authenticated' },
        visibility: { showInTabs: true, showInSidebar: true },
      },
      {
        id: 'dashboard-alias',
        path: '/dashboard',
        title: 'Dashboard',
        icon: 'Activity',
        screen: 'DashboardScreen',
        access: { type: 'authenticated' },
        visibility: { showInTabs: false, showInSidebar: false },
      },
      {
        id: 'budget',
        path: '/budget',
        title: 'Budget',
        icon: 'Calendar',
        screen: 'BudgetScreen',
        access: { type: 'authenticated' },
        visibility: { showInTabs: true, showInSidebar: true },
      },
      {
        id: 'transactions',
        path: '/transactions',
        title: 'Transactions',
        icon: 'List',
        screen: 'TransactionsScreen',
        access: { type: 'authenticated' },
        visibility: { showInTabs: true, showInSidebar: true },
      },
      {
        id: 'accounts',
        path: '/accounts',
        title: 'Accounts',
        icon: 'CreditCard',
        screen: 'AccountsScreen',
        access: { type: 'authenticated' },
        visibility: { showInTabs: true, showInSidebar: true },
      },
      {
        id: 'add-transaction',
        path: '/add',
        title: 'Add Transaction',
        icon: 'Plus',
        screen: 'AddTransactionScreen',
        access: { type: 'authenticated' },
        visibility: { showInTabs: false, showInSidebar: false },
      },
      {
        id: 'qr-scanner',
        path: '/qr-scanner',
        title: 'QR Scanner',
        icon: 'QrCode',
        screen: 'QRScannerScreen',
        access: { type: 'authenticated' },
        featureFlag: 'qrScanner',
        visibility: { showInTabs: false, showInSidebar: true },
      },
      {
        id: 'settings',
        path: '/settings',
        title: 'Settings',
        icon: 'Settings',
        screen: 'SettingsScreen',
        access: { type: 'authenticated' },
        visibility: { showInTabs: false, showInSidebar: true },
      },
      {
        id: 'details',
        path: '/details/:id',
        title: 'Details',
        screen: 'DetailsScreen',
        access: { type: 'authenticated' },
        visibility: { showInTabs: false, showInSidebar: false },
        params: [{ name: 'id', type: 'string', required: true }],
      },
      {
        id: 'login',
        path: '/login',
        title: 'Login',
        screen: 'LoginScreen',
        layout: 'AuthLayout',
        access: { type: 'public' },
        visibility: { showInTabs: false, showInSidebar: false },
      },
      {
        id: 'auth-callback',
        path: '/auth/callback',
        title: 'Auth Callback',
        screen: 'AuthCallbackScreen',
        layout: 'AuthLayout',
        access: { type: 'public' },
        visibility: { showInTabs: false, showInSidebar: false },
      },
    ],
    tabs: {
      position: 'bottom',
      showLabels: true,
      variant: 'default',
      tabs: [
        { route: 'dashboard', icon: 'Activity' },
        { route: 'budget', icon: 'Calendar' },
        { route: 'transactions', icon: 'List' },
        { route: 'accounts', icon: 'CreditCard' },
      ],
      fab: { route: 'add-transaction', icon: 'Plus' },
    },
    sidebar: {
      ...({} as any),
      header: {
        title: 'FinanceApp',
        showUserInfo: true,
      },
      items: [],
      groups: [
        {
          id: 'main',
          items: [
            { route: 'dashboard', icon: 'Activity' },
            { route: 'budget', icon: 'Calendar' },
            { route: 'transactions', icon: 'List' },
            { route: 'accounts', icon: 'CreditCard' },
          ],
        },
        {
          id: 'tools',
          title: 'Tools',
          items: [
            { route: 'qr-scanner', icon: 'QrCode' },
          ],
        },
        {
          id: 'settings',
          title: 'Settings',
          items: [
            { route: 'settings', icon: 'Settings' },
          ],
        },
      ],
      collapsible: true,
    },
    fallback: {
      notFound: '/',
      unauthorized: '/login',
    },
  },

  features: {
    darkMode: true,
    notifications: true,
    analytics: false,
    offlineMode: true,
    qrScanner: true,
    budgetTracking: true,
  },

  theme: {
    primaryColor: '#6366f1',
    secondaryColor: '#a855f7',
    fontFamily: 'Inter',
    darkMode: false,
  },

  api: defaultAppConfig.api,
  auth: defaultAuthConfig,
  i18n: defaultI18nConfig,

  _meta: {
    version: 'fallback-v1',
    fetchedAt: 0,
    expiresAt: Number.MAX_SAFE_INTEGER, // Never expires
  },
};

/**
 * Get a route definition by ID from the fallback config
 */
export function getRouteById(routeId: string) {
  return fallbackConfig.navigation.routes.find((r) => r.id === routeId);
}

/**
 * Get all routes that should be shown in tabs
 */
export function getTabRoutes() {
  return fallbackConfig.navigation.routes.filter(
    (r) => r.visibility?.showInTabs
  );
}

/**
 * Get all routes that should be shown in sidebar
 */
export function getSidebarRoutes() {
  return fallbackConfig.navigation.routes.filter(
    (r) => r.visibility?.showInSidebar
  );
}
