import { defaultAppConfig } from '@app/config';
import type { AppConfig } from '@app/types';
import { createContext, useContext } from 'react';

export const AppConfigContext = createContext<AppConfig>(defaultAppConfig);

export function useAppConfig(): AppConfig {
  const config = useContext(AppConfigContext);
  if (!config) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return config;
}

export function useFeatureFlag(flag: string): boolean {
  const config = useAppConfig();
  return config.features[flag] ?? false;
}

export function useTheme() {
  const config = useAppConfig();
  return config.theme;
}
