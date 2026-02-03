import { useAppConfig } from '../hooks/useAppConfig';
import { useThemeMode } from '../theme/ThemeModeProvider';
import { useAuth } from '../auth/AuthContext';
import type { ThemeMode, AppConfig } from '@app/types';

export interface SettingsScreenData {
  /** App configuration */
  config: AppConfig;
  /** Current theme mode (light/dark/system) */
  themeMode: ThemeMode;
  /** Resolved theme (actual light/dark being displayed) */
  resolvedTheme: 'light' | 'dark';
  /** Whether system is in dark mode */
  isSystemDark: boolean;
  /** Change theme mode */
  setThemeMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark */
  toggleTheme: () => void;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Current user info */
  user: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
  /** Logout function */
  logout: () => Promise<void>;
  /** Feature flags */
  features: {
    darkMode: boolean;
    notifications: boolean;
    offlineMode: boolean;
    analytics: boolean;
  };
}

/**
 * Hook that provides all business logic for the settings screen
 */
export function useSettingsScreenLogic(): SettingsScreenData {
  const config = useAppConfig();
  const { mode, resolvedMode, isSystemDark, setMode, toggleMode } = useThemeMode();
  const { user, isAuthenticated, logout } = useAuth();

  return {
    config,
    themeMode: mode,
    resolvedTheme: resolvedMode,
    isSystemDark,
    setThemeMode: setMode,
    toggleTheme: toggleMode,
    isAuthenticated,
    user: user
      ? {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }
      : null,
    logout,
    features: {
      darkMode: config.features.darkMode ?? false,
      notifications: config.features.notifications ?? false,
      offlineMode: config.features.offlineMode ?? false,
      analytics: config.features.analytics ?? false,
    },
  };
}
