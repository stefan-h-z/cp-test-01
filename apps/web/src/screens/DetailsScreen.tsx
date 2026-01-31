import { useParams, useNavigate } from 'react-router-dom';
import { YStack, XStack, Heading, BodyText, Button, Spinner, Image, Section } from '@app/ui';
import { useContent } from '@app/shared';
import type { ContentItem } from '@app/types';

// Demo content for development
const demoContent: Record<string, ContentItem> = {
  '1': {
    id: '1',
    type: 'article',
    title: 'Getting Started with Cross-Platform Development',
    body: `
Cross-platform development allows you to write code once and deploy it across multiple platforms.
This approach saves time and resources while ensuring a consistent user experience.

## Key Benefits

- **Single Codebase**: Maintain one codebase for iOS, Android, and web
- **Shared Components**: Reuse UI components across all platforms
- **Consistent Experience**: Provide users with the same features everywhere
- **Faster Development**: Ship features to all platforms simultaneously

## Getting Started

This template provides everything you need to build cross-platform applications:

1. **Monorepo Structure**: Organized workspace with shared packages
2. **Tamagui**: Universal UI components that work everywhere
3. **TanStack Query**: Powerful data fetching and caching
4. **TypeScript**: Full type safety across your entire codebase
    `,
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

export function DetailsScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useContent(id || '');

  // Use demo content if API is not available
  const content = data ?? (id ? demoContent[id] : undefined);

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$6">
        <Spinner size="large" />
      </YStack>
    );
  }

  if (error || !content) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" gap="$4">
        <Heading level={3}>Content Not Found</Heading>
        <BodyText muted>The requested content could not be found.</BodyText>
        <Button variant="primary" onPress={() => navigate('/')}>
          Go Home
        </Button>
      </YStack>
    );
  }

  return (
    <YStack gap="$6" paddingVertical="$4" maxWidth={800}>
      <Button variant="ghost" alignSelf="flex-start" onPress={() => navigate(-1)}>
        ← Back
      </Button>

      {content.imageUrl && (
        <Image
          source={{ uri: content.imageUrl }}
          width="100%"
          height={400}
          borderRadius="$4"
          resizeMode="cover"
        />
      )}

      <Section gap="$4">
        <YStack gap="$2">
          <BodyText muted size="sm">
            {content.type.toUpperCase()} • {new Date(content.createdAt).toLocaleDateString()}
          </BodyText>
          <Heading level={1}>{content.title}</Heading>
        </YStack>

        {content.body && (
          <BodyText size="lg" whiteSpace="pre-wrap">
            {content.body}
          </BodyText>
        )}
      </Section>

      <XStack gap="$3">
        <Button variant="primary">Share</Button>
        <Button variant="outline">Save</Button>
      </XStack>
    </YStack>
  );
}
