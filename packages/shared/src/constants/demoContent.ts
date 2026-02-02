import type { ContentItem } from '@app/types';

/**
 * Demo content for development and fallback when API is unavailable
 */
export const demoContentList: ContentItem[] = [
  {
    id: '1',
    type: 'article',
    title: 'Getting Started with Cross-Platform Development',
    body: 'Learn how to build applications that run on iOS, Android, and the web using a shared codebase.',
    imageUrl: 'https://picsum.photos/seed/1/400/200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'article',
    title: 'Building Reusable UI Components',
    body: 'Discover best practices for creating components that work across all platforms.',
    imageUrl: 'https://picsum.photos/seed/2/400/200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'card',
    title: 'Configurable Content System',
    body: 'Explore how to make your app content easily configurable and manageable.',
    imageUrl: 'https://picsum.photos/seed/3/400/200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Detailed demo content (with full body text) indexed by ID
 */
export const demoContentDetails: Record<string, ContentItem> = {
  '1': {
    id: '1',
    type: 'article',
    title: 'Getting Started with Cross-Platform Development',
    body: `Cross-platform development allows you to write code once and deploy it across multiple platforms.
This approach saves time and resources while ensuring a consistent user experience.

Key Benefits:
• Single Codebase: Maintain one codebase for iOS, Android, and web
• Shared Components: Reuse UI components across all platforms
• Consistent Experience: Provide users with the same features everywhere
• Faster Development: Ship features to all platforms simultaneously

Getting Started:
This template provides everything you need to build cross-platform applications:

1. Monorepo Structure: Organized workspace with shared packages
2. Tamagui: Universal UI components that work everywhere
3. TanStack Query: Powerful data fetching and caching
4. TypeScript: Full type safety across your entire codebase`,
    imageUrl: 'https://picsum.photos/seed/1/800/400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  '2': {
    id: '2',
    type: 'article',
    title: 'Building Reusable UI Components',
    body: 'Discover best practices for creating components that work across all platforms. Learn how to use Tamagui to build beautiful, responsive interfaces.',
    imageUrl: 'https://picsum.photos/seed/2/800/400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  '3': {
    id: '3',
    type: 'card',
    title: 'Configurable Content System',
    body: 'Explore how to make your app content easily configurable and manageable. Build dynamic applications that can be customized without code changes.',
    imageUrl: 'https://picsum.photos/seed/3/800/400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

/**
 * Get demo content by ID
 */
export function getDemoContent(id: string): ContentItem | undefined {
  return demoContentDetails[id];
}
