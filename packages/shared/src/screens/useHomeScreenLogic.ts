import { useContentList } from '../hooks/useContent';
import { useAppConfig } from '../hooks/useAppConfig';
import { demoContentList } from '../constants/demoContent';
import type { ContentItem, AppConfig } from '@app/types';

export interface HomeScreenData {
  /** App configuration */
  config: AppConfig;
  /** Content items to display */
  content: ContentItem[];
  /** Whether content is loading */
  isLoading: boolean;
  /** Error message if content failed to load */
  error: Error | null;
  /** Feature flags from config */
  features: Record<string, boolean>;
}

/**
 * Hook that provides all business logic for the home screen
 * Handles content loading with demo fallback
 */
export function useHomeScreenLogic(): HomeScreenData {
  const config = useAppConfig();
  const { data, isLoading, error } = useContentList();

  // Use demo content if API is not available or returns no data
  const content = data?.data ?? demoContentList;

  return {
    config,
    content,
    isLoading,
    error: error ?? null,
    features: config.features,
  };
}
