import type { TabConfig } from '@app/types';

// Tab routes configuration - single source of truth for navigation
export const tabRoutes: TabConfig[] = [
  { name: 'index', path: '/', title: 'Activity', icon: 'Activity' },
  { name: 'budget', path: '/budget', title: 'Budget', icon: 'Calendar' },
  { name: 'add', path: '/add', title: '', icon: 'Plus', isFab: true },
  { name: 'transactions', path: '/transactions', title: 'Transactions', icon: 'List' },
  { name: 'accounts', path: '/accounts', title: 'Accounts', icon: 'CreditCard' },
];

// Hidden routes (accessible but not in tab bar)
export const hiddenRoutes: TabConfig[] = [
  { name: 'explore', path: '/explore', title: 'Explore', icon: 'Activity', hidden: true },
  { name: 'profile', path: '/profile', title: 'Profile', icon: 'Activity', hidden: true },
];

// All routes combined
export const allRoutes: TabConfig[] = [...tabRoutes, ...hiddenRoutes];

// Helper functions for navigation
export function getVisibleTabs(): TabConfig[] {
  return tabRoutes.filter(route => !route.isFab && !route.hidden);
}

export function getFabRoute(): TabConfig | undefined {
  return tabRoutes.find(route => route.isFab);
}

export function getTabRouteByName(name: string): TabConfig | undefined {
  return allRoutes.find(route => route.name === name);
}

export function getTabRouteByPath(path: string): TabConfig | undefined {
  return allRoutes.find(route => route.path === path);
}
