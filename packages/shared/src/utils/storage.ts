import { Platform } from 'react-native';

// Storage interface that works on both web and native
export interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

// Web storage adapter using localStorage
const webStorage: StorageAdapter = {
  getItem: async (key: string) => {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  },
  clear: async () => {
    if (typeof localStorage === 'undefined') return;
    localStorage.clear();
  },
};

// Memory storage fallback
const memoryStore = new Map<string, string>();

const memoryStorage: StorageAdapter = {
  getItem: async (key: string) => memoryStore.get(key) ?? null,
  setItem: async (key: string, value: string) => {
    memoryStore.set(key, value);
  },
  removeItem: async (key: string) => {
    memoryStore.delete(key);
  },
  clear: async () => {
    memoryStore.clear();
  },
};

// Get the appropriate storage adapter for the platform
function getStorageAdapter(): StorageAdapter {
  if (Platform.OS === 'web') {
    return typeof localStorage !== 'undefined' ? webStorage : memoryStorage;
  }

  // For native, we'll use a memory store by default
  // In a real app, you would use expo-secure-store or AsyncStorage here
  // This can be replaced with secure storage in the app initialization
  return memoryStorage;
}

// Default storage instance
let storageAdapter: StorageAdapter = getStorageAdapter();

// Allow replacing the storage adapter (useful for native apps to inject SecureStore)
export function setStorageAdapter(adapter: StorageAdapter): void {
  storageAdapter = adapter;
}

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@app/auth_token',
  AUTH_USER: '@app/auth_user',
  AUTH_PROVIDER: '@app/auth_provider',
  THEME: '@app/theme',
  LOCALE: '@app/locale',
  ONBOARDING_COMPLETED: '@app/onboarding_completed',
} as const;

// Typed storage helpers
export const storage = {
  // Raw methods
  get: (key: string) => storageAdapter.getItem(key),
  set: (key: string, value: string) => storageAdapter.setItem(key, value),
  remove: (key: string) => storageAdapter.removeItem(key),
  clear: () => storageAdapter.clear(),

  // JSON helpers
  getJSON: async <T>(key: string): Promise<T | null> => {
    const value = await storageAdapter.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },
  setJSON: async <T>(key: string, value: T): Promise<void> => {
    await storageAdapter.setItem(key, JSON.stringify(value));
  },

  // Auth helpers
  getAuthToken: () => storageAdapter.getItem(STORAGE_KEYS.AUTH_TOKEN),
  setAuthToken: (token: string) =>
    storageAdapter.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  removeAuthToken: () => storageAdapter.removeItem(STORAGE_KEYS.AUTH_TOKEN),

  getAuthUser: async <T>(): Promise<T | null> => {
    const value = await storageAdapter.getItem(STORAGE_KEYS.AUTH_USER);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },
  setAuthUser: async <T>(user: T): Promise<void> => {
    await storageAdapter.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  },
  removeAuthUser: () => storageAdapter.removeItem(STORAGE_KEYS.AUTH_USER),

  // Clear all auth data
  clearAuth: async (): Promise<void> => {
    await Promise.all([
      storageAdapter.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      storageAdapter.removeItem(STORAGE_KEYS.AUTH_USER),
      storageAdapter.removeItem(STORAGE_KEYS.AUTH_PROVIDER),
    ]);
  },
};
