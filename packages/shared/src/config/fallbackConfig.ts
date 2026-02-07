import { defaultAppConfig, defaultAuthConfig, defaultI18nConfig } from '@app/config';
import type { RemoteAppConfig, ScreenDefinition } from '@app/types';

/**
 * Screen definitions for config-driven screens.
 * Each screen defines its widget tree, referenced by routes via screenCode.
 */
const screens: Record<string, ScreenDefinition> = {
  home: {
    code: 'home',
    title: 'Home',
    components: [
      {
        type: 'Header',
        width: 12,
        label: 'Welcome to FinanceApp!',
        level: 1,
      },
      {
        type: 'Text',
        width: 12,
        label: 'Select a tile below to get started.',
        muted: true,
        size: 'lg',
      },
      {
        type: 'Spacer',
        width: 12,
        size: '$2',
      },
      {
        type: 'Card',
        width: 4,
        responsiveWidth: { xs: 12, sm: 6 },
        variant: 'elevated',
        header: 'Budget',
        description: 'Track your monthly budget and spending habits.',
        buttons: [
          {
            type: 'Button',
            label: 'View Budget',
            variant: 'primary',
            fullWidth: true,
            link: { type: 'SCREEN', code: 'budget' },
          },
        ],
      },
      {
        type: 'Card',
        width: 4,
        responsiveWidth: { xs: 12, sm: 6 },
        variant: 'elevated',
        header: 'Transactions',
        description: 'View and manage your recent transactions.',
        buttons: [
          {
            type: 'Button',
            label: 'View Transactions',
            variant: 'primary',
            fullWidth: true,
            link: { type: 'SCREEN', code: 'transactions' },
          },
        ],
      },
      {
        type: 'Card',
        width: 4,
        responsiveWidth: { xs: 12, sm: 6 },
        variant: 'elevated',
        header: 'Accounts',
        description: 'Manage your bank accounts and credit cards.',
        buttons: [
          {
            type: 'Button',
            label: 'View Accounts',
            variant: 'primary',
            fullWidth: true,
            link: { type: 'SCREEN', code: 'accounts' },
          },
        ],
      },
      {
        type: 'Spacer',
        width: 12,
        size: '$4',
      },
      {
        type: 'Card',
        width: 4,
        responsiveWidth: { xs: 12, sm: 6 },
        variant: 'outlined',
        featureFlag: 'qrScanner',
        header: 'QR Scanner',
        description: 'Scan QR codes to quickly add transactions or links.',
        buttons: [
          {
            type: 'Button',
            label: 'Open Scanner',
            variant: 'outline',
            fullWidth: true,
            link: { type: 'SCREEN', code: 'qr-scanner' },
          },
        ],
      },
    ],
  },

  budget: {
    code: 'budget',
    title: 'Budget',
    components: [
      {
        type: 'Header',
        width: 12,
        label: 'Budget Overview',
        level: 2,
      },
      {
        type: 'Text',
        width: 12,
        label: 'Track your monthly spending and stay within your budget.',
        muted: true,
      },
      {
        type: 'Divider',
        width: 12,
      },
      {
        type: 'Card',
        width: 6,
        responsiveWidth: { xs: 12 },
        variant: 'elevated',
        header: 'Monthly Budget',
        description: 'You have spent $1,250 of your $2,000 monthly budget.',
      },
      {
        type: 'Card',
        width: 6,
        responsiveWidth: { xs: 12 },
        variant: 'elevated',
        header: 'Savings Goal',
        description: 'You are 65% towards your $5,000 savings goal.',
      },
      {
        type: 'Spacer',
        width: 12,
        size: '$3',
      },
      {
        type: 'Button',
        width: 4,
        responsiveWidth: { xs: 12 },
        label: 'Back to Home',
        variant: 'outline',
        link: { type: 'SCREEN', code: 'home' },
      },
    ],
  },

  transactions: {
    code: 'transactions',
    title: 'Transactions',
    components: [
      {
        type: 'Header',
        width: 12,
        label: 'Transactions',
        level: 2,
      },
      {
        type: 'Text',
        width: 12,
        label: 'View and manage your recent transactions.',
        muted: true,
      },
      {
        type: 'Divider',
        width: 12,
      },
      {
        type: 'Card',
        width: 12,
        variant: 'outlined',
        header: 'Recent Transactions',
        description: 'No transactions to display yet. Add your first transaction to get started.',
        buttons: [
          {
            type: 'Button',
            label: 'Add Transaction',
            variant: 'primary',
            link: { type: 'SCREEN', code: 'add-transaction' },
          },
        ],
      },
      {
        type: 'Spacer',
        width: 12,
        size: '$3',
      },
      {
        type: 'Button',
        width: 4,
        responsiveWidth: { xs: 12 },
        label: 'Back to Home',
        variant: 'outline',
        link: { type: 'SCREEN', code: 'home' },
      },
    ],
  },

  accounts: {
    code: 'accounts',
    title: 'Accounts',
    components: [
      {
        type: 'Header',
        width: 12,
        label: 'Accounts',
        level: 2,
      },
      {
        type: 'Text',
        width: 12,
        label: 'Manage your bank accounts and credit cards.',
        muted: true,
      },
      {
        type: 'Divider',
        width: 12,
      },
      {
        type: 'Card',
        width: 6,
        responsiveWidth: { xs: 12 },
        variant: 'elevated',
        header: 'Checking Account',
        description: 'Balance: $3,450.00',
      },
      {
        type: 'Card',
        width: 6,
        responsiveWidth: { xs: 12 },
        variant: 'elevated',
        header: 'Savings Account',
        description: 'Balance: $12,800.00',
      },
      {
        type: 'Spacer',
        width: 12,
        size: '$3',
      },
      {
        type: 'Button',
        width: 4,
        responsiveWidth: { xs: 12 },
        label: 'Back to Home',
        variant: 'outline',
        link: { type: 'SCREEN', code: 'home' },
      },
    ],
  },

  'qr-scanner': {
    code: 'qr-scanner',
    title: 'QR Scanner',
    components: [
      {
        type: 'Header',
        width: 12,
        label: 'QR Scanner',
        level: 2,
      },
      {
        type: 'Text',
        width: 12,
        label: 'Scan a QR code to quickly capture data.',
        muted: true,
      },
      {
        type: 'QRScanner',
        width: 12,
        showHistory: true,
      },
      {
        type: 'Spacer',
        width: 12,
        size: '$3',
      },
      {
        type: 'Button',
        width: 4,
        responsiveWidth: { xs: 12 },
        label: 'Back to Home',
        variant: 'outline',
        link: { type: 'SCREEN', code: 'home' },
      },
    ],
  },

  'add-transaction': {
    code: 'add-transaction',
    title: 'Add Transaction',
    components: [
      {
        type: 'Header',
        width: 12,
        label: 'Add Transaction',
        level: 2,
      },
      {
        type: 'Text',
        width: 12,
        label: 'Enter the details for your new transaction.',
        muted: true,
      },
      {
        type: 'Divider',
        width: 12,
      },
      {
        type: 'FormField',
        width: 12,
        name: 'description',
        label: 'Description',
        placeholder: 'e.g. Grocery shopping',
        fieldType: 'text',
        required: true,
      },
      {
        type: 'FormField',
        width: 6,
        responsiveWidth: { xs: 12 },
        name: 'amount',
        label: 'Amount',
        placeholder: '0.00',
        fieldType: 'number',
        required: true,
      },
      {
        type: 'FormField',
        width: 6,
        responsiveWidth: { xs: 12 },
        name: 'category',
        label: 'Category',
        fieldType: 'select',
        options: [
          { value: 'food', label: 'Food & Dining' },
          { value: 'transport', label: 'Transportation' },
          { value: 'shopping', label: 'Shopping' },
          { value: 'bills', label: 'Bills & Utilities' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        type: 'Spacer',
        width: 12,
        size: '$3',
      },
      {
        type: 'Row',
        width: 12,
        children: [
          {
            type: 'Button',
            width: 4,
            responsiveWidth: { xs: 6 },
            label: 'Cancel',
            variant: 'outline',
            link: { type: 'SCREEN', code: 'transactions' },
          },
          {
            type: 'Button',
            width: 4,
            responsiveWidth: { xs: 6 },
            label: 'Save Transaction',
            variant: 'primary',
            link: {
              type: 'ACTION',
              action: 'showToast',
              payload: { message: 'Transaction saved!' },
            },
          },
        ],
      },
    ],
  },
};

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
    initialRoute: 'home',
    routes: [
      {
        id: 'home',
        path: '/',
        title: 'Home',
        icon: 'Activity',
        screen: 'DynamicScreen',
        screenCode: 'home',
        access: { type: 'authenticated' },
        visibility: { showInTabs: true, showInSidebar: true },
      },
      {
        id: 'budget',
        path: '/budget',
        title: 'Budget',
        icon: 'Calendar',
        screen: 'DynamicScreen',
        screenCode: 'budget',
        access: { type: 'authenticated' },
        visibility: { showInTabs: true, showInSidebar: true },
      },
      {
        id: 'transactions',
        path: '/transactions',
        title: 'Transactions',
        icon: 'List',
        screen: 'DynamicScreen',
        screenCode: 'transactions',
        access: { type: 'authenticated' },
        visibility: { showInTabs: true, showInSidebar: true },
      },
      {
        id: 'accounts',
        path: '/accounts',
        title: 'Accounts',
        icon: 'CreditCard',
        screen: 'DynamicScreen',
        screenCode: 'accounts',
        access: { type: 'authenticated' },
        visibility: { showInTabs: true, showInSidebar: true },
      },
      {
        id: 'add-transaction',
        path: '/add',
        title: 'Add Transaction',
        icon: 'Plus',
        screen: 'DynamicScreen',
        screenCode: 'add-transaction',
        access: { type: 'authenticated' },
        visibility: { showInTabs: false, showInSidebar: false },
      },
      {
        id: 'qr-scanner',
        path: '/qr-scanner',
        title: 'QR Scanner',
        icon: 'QrCode',
        screen: 'DynamicScreen',
        screenCode: 'qr-scanner',
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
        { route: 'home', icon: 'Activity' },
        { route: 'budget', icon: 'Calendar' },
        { route: 'transactions', icon: 'List' },
        { route: 'accounts', icon: 'CreditCard' },
      ],
      fab: { route: 'add-transaction', icon: 'Plus' },
    },
    sidebar: {
      header: {
        title: 'FinanceApp',
        showUserInfo: true,
      },
      items: [],
      footer: undefined,
      groups: [
        {
          id: 'main',
          items: [
            { route: 'home', icon: 'Activity' },
            { route: 'budget', icon: 'Calendar' },
            { route: 'transactions', icon: 'List' },
            { route: 'accounts', icon: 'CreditCard' },
          ],
        },
        {
          id: 'tools',
          title: 'Tools',
          items: [{ route: 'qr-scanner', icon: 'QrCode' }],
        },
        {
          id: 'settings',
          title: 'Settings',
          items: [{ route: 'settings', icon: 'Settings' }],
        },
      ],
      collapsible: true,
    },
    fallback: {
      notFound: '/',
      unauthorized: '/login',
    },
  },

  screens,

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
    expiresAt: Number.MAX_SAFE_INTEGER,
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
  return fallbackConfig.navigation.routes.filter((r) => r.visibility?.showInTabs);
}

/**
 * Get all routes that should be shown in sidebar
 */
export function getSidebarRoutes() {
  return fallbackConfig.navigation.routes.filter((r) => r.visibility?.showInSidebar);
}
