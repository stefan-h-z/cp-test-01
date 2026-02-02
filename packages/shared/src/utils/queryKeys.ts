/**
 * Query Key Factory
 *
 * Provides type-safe, consistent query keys for TanStack Query.
 * Following the query key factory pattern for predictable cache management.
 *
 * Usage:
 * ```ts
 * // In a hook
 * useQuery({
 *   queryKey: queryKeys.content.list({ page: 1 }),
 *   queryFn: () => fetchContentList({ page: 1 }),
 * });
 *
 * // Invalidating queries
 * queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
 * ```
 */

import type { FilterState, SortState, PaginationState } from '@app/types';

// Content query keys
export const contentKeys = {
  all: ['content'] as const,
  lists: () => [...contentKeys.all, 'list'] as const,
  list: (filters?: {
    filter?: FilterState;
    sort?: SortState;
    pagination?: PaginationState;
  }) => [...contentKeys.lists(), filters] as const,
  details: () => [...contentKeys.all, 'detail'] as const,
  detail: (id: string) => [...contentKeys.details(), id] as const,
};

// User query keys
export const userKeys = {
  all: ['user'] as const,
  current: () => [...userKeys.all, 'current'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: { search?: string; role?: string }) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  preferences: (userId: string) => [...userKeys.detail(userId), 'preferences'] as const,
};

// Auth query keys
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  permissions: () => [...authKeys.all, 'permissions'] as const,
};

// Transaction/Budget query keys (for the dashboard)
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    type?: 'income' | 'expense';
  }) => [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  summary: (period?: { month?: number; year?: number }) =>
    [...transactionKeys.all, 'summary', period] as const,
  categories: () => [...transactionKeys.all, 'categories'] as const,
};

export const budgetKeys = {
  all: ['budget'] as const,
  current: () => [...budgetKeys.all, 'current'] as const,
  history: (year?: number) => [...budgetKeys.all, 'history', year] as const,
  categories: () => [...budgetKeys.all, 'categories'] as const,
  category: (id: string) => [...budgetKeys.categories(), id] as const,
};

// Settings/Config query keys
export const settingsKeys = {
  all: ['settings'] as const,
  app: () => [...settingsKeys.all, 'app'] as const,
  user: () => [...settingsKeys.all, 'user'] as const,
  notifications: () => [...settingsKeys.all, 'notifications'] as const,
};

// Combined query keys export
export const queryKeys = {
  content: contentKeys,
  user: userKeys,
  auth: authKeys,
  transactions: transactionKeys,
  budget: budgetKeys,
  settings: settingsKeys,
} as const;

// Type helpers for query key inference
export type ContentQueryKey = ReturnType<typeof contentKeys[keyof typeof contentKeys]>;
export type UserQueryKey = ReturnType<typeof userKeys[keyof typeof userKeys]>;
export type AuthQueryKey = ReturnType<typeof authKeys[keyof typeof authKeys]>;
export type TransactionQueryKey = ReturnType<typeof transactionKeys[keyof typeof transactionKeys]>;
export type BudgetQueryKey = ReturnType<typeof budgetKeys[keyof typeof budgetKeys]>;
export type SettingsQueryKey = ReturnType<typeof settingsKeys[keyof typeof settingsKeys]>;

export type QueryKey =
  | ContentQueryKey
  | UserQueryKey
  | AuthQueryKey
  | TransactionQueryKey
  | BudgetQueryKey
  | SettingsQueryKey;
