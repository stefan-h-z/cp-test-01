import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ContentItem, ContentSection, ApiResponse, PaginatedResponse } from '@app/types';

const CONTENT_QUERY_KEY = 'content';

async function fetchContent(id: string): Promise<ContentItem> {
  const response = await fetch(`/api/content/${id}`);
  if (!response.ok) throw new Error('Failed to fetch content');
  const result: ApiResponse<ContentItem> = await response.json();
  return result.data;
}

async function fetchContentList(page = 1, pageSize = 10): Promise<PaginatedResponse<ContentItem>> {
  const response = await fetch(`/api/content?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) throw new Error('Failed to fetch content list');
  return response.json();
}

async function fetchSections(): Promise<ContentSection[]> {
  const response = await fetch('/api/sections');
  if (!response.ok) throw new Error('Failed to fetch sections');
  const result: ApiResponse<ContentSection[]> = await response.json();
  return result.data;
}

export function useContent(id: string) {
  return useQuery({
    queryKey: [CONTENT_QUERY_KEY, id],
    queryFn: () => fetchContent(id),
    enabled: !!id,
  });
}

export function useContentList(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: [CONTENT_QUERY_KEY, 'list', page, pageSize],
    queryFn: () => fetchContentList(page, pageSize),
  });
}

export function useSections() {
  return useQuery({
    queryKey: [CONTENT_QUERY_KEY, 'sections'],
    queryFn: fetchSections,
  });
}

export function useInvalidateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id?: string) => {
      if (id) {
        await queryClient.invalidateQueries({ queryKey: [CONTENT_QUERY_KEY, id] });
      } else {
        await queryClient.invalidateQueries({ queryKey: [CONTENT_QUERY_KEY] });
      }
    },
  });
}
