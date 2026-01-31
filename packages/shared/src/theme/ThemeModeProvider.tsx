import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useColorScheme } from 'react-native';
import type { ThemeMode, ThemeModeState, ThemeModeContextValue } from '@app/types';
import { storage, STORAGE_KEYS } from '../utils/storage';

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export interface ThemeModeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  persistKey?: string;
}

export function ThemeModeProvider({
  children,
  defaultMode = 'system',
  persistKey = STORAGE_KEYS.THEME,
}: ThemeModeProviderProps) {
  const systemColorScheme = useColorScheme();
  const isSystemDark = systemColorScheme === 'dark';

  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted theme on mount
  useEffect(() => {
    const loadPersistedTheme = async () => {
      try {
        const persistedMode = await storage.get(persistKey);
        if (persistedMode && isValidThemeMode(persistedMode)) {
          setModeState(persistedMode as ThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load persisted theme:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadPersistedTheme();
  }, [persistKey]);

  // Calculate the resolved mode based on current mode and system preference
  const resolvedMode = useMemo((): 'light' | 'dark' => {
    if (mode === 'system') {
      return isSystemDark ? 'dark' : 'light';
    }
    return mode;
  }, [mode, isSystemDark]);

  // Set mode and persist
  const setMode = useCallback(
    async (newMode: ThemeMode) => {
      setModeState(newMode);
      try {
        await storage.set(persistKey, newMode);
      } catch (error) {
        console.warn('Failed to persist theme:', error);
      }
    },
    [persistKey]
  );

  // Toggle between light and dark (skipping system)
  const toggleMode = useCallback(() => {
    const newMode = resolvedMode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  }, [resolvedMode, setMode]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      resolvedMode,
      isSystemDark,
      setMode,
      toggleMode,
    }),
    [mode, resolvedMode, isSystemDark, setMode, toggleMode]
  );

  // Don't render children until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
}

// Optional hook that doesn't throw if used outside provider
export function useThemeModeOptional(): ThemeModeContextValue | null {
  return useContext(ThemeModeContext);
}

// Helper to check if a value is a valid theme mode
function isValidThemeMode(value: string): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

// Export context for advanced use cases
export { ThemeModeContext };
