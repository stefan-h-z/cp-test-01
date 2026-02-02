import { useContent } from '../hooks/useContent';
import { getDemoContent } from '../constants/demoContent';
import type { ContentItem } from '@app/types';

export interface DetailsScreenData {
  /** The content item to display */
  content: ContentItem | undefined;
  /** Whether content is loading */
  isLoading: boolean;
  /** Error message if content failed to load */
  error: Error | null;
  /** Whether content was found */
  notFound: boolean;
  /** Formatted date string for display */
  formattedDate: string | null;
  /** Content type in uppercase for display */
  typeLabel: string | null;
}

/**
 * Hook that provides all business logic for the details screen
 * Handles content loading with demo fallback
 */
export function useDetailsScreenLogic(id: string | undefined): DetailsScreenData {
  const { data, isLoading, error } = useContent(id || '');

  // Use demo content if API is not available
  const content = data ?? (id ? getDemoContent(id) : undefined);

  const notFound = !isLoading && (!!error || !content);
  const formattedDate = content
    ? new Date(content.createdAt).toLocaleDateString()
    : null;
  const typeLabel = content ? content.type.toUpperCase() : null;

  return {
    content,
    isLoading,
    error: error ?? null,
    notFound,
    formattedDate,
    typeLabel,
  };
}
