import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ScrollView } from 'react-native';
import { YStack, XStack, Heading, BodyText, Button, Spinner, Image, Section } from '@app/ui';
import { useContent } from '@app/shared';
import type { ContentItem } from '@app/types';

// Demo content for development
const demoContent: Record<string, ContentItem> = {
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
• Faster Development: Ship features to all platforms simultaneously`,
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

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
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
      <>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <YStack flex={1} alignItems="center" justifyContent="center" gap="$4" padding="$4">
          <Heading level={3}>Content Not Found</Heading>
          <BodyText muted textAlign="center">
            The requested content could not be found.
          </BodyText>
          <Button variant="primary" onPress={() => router.back()}>
            Go Back
          </Button>
        </YStack>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: content.title }} />
      <ScrollView style={{ flex: 1 }}>
        <YStack>
          {content.imageUrl && (
            <Image
              source={{ uri: content.imageUrl }}
              width="100%"
              height={250}
              resizeMode="cover"
            />
          )}

          <YStack padding="$4" gap="$4">
            <Section gap="$2">
              <BodyText muted size="sm">
                {content.type.toUpperCase()} • {new Date(content.createdAt).toLocaleDateString()}
              </BodyText>
              <Heading level={2}>{content.title}</Heading>
            </Section>

            {content.body && (
              <BodyText size="lg">{content.body}</BodyText>
            )}

            <XStack gap="$3" paddingTop="$4">
              <Button variant="primary" flex={1}>
                Share
              </Button>
              <Button variant="outline" flex={1}>
                Save
              </Button>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </>
  );
}
