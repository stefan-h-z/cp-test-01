import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { YStack, XStack, Section, Heading, BodyText, ContentCard, Button, Spinner } from '@app/ui';
import { useContentList, useAppConfig } from '@app/shared';
import type { ContentItem } from '@app/types';

// Demo content for development
const demoContent: ContentItem[] = [
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

export default function HomeScreen() {
  const router = useRouter();
  const config = useAppConfig();
  const { data, isLoading, error } = useContentList();

  // Use demo content if API is not available
  const content = data?.data ?? demoContent;

  return (
    <ScrollView style={{ flex: 1 }}>
      <YStack padding="$4" gap="$6">
        {/* Hero Section */}
        <Section alignItems="center" gap="$4">
          <Heading level={2} textAlign="center">
            Welcome to {config.name}
          </Heading>
          <BodyText muted textAlign="center">
            A cross-platform application built with React Native and Expo.
          </BodyText>
          <XStack gap="$3">
            <Button variant="primary" onPress={() => router.push('/explore')}>
              Explore
            </Button>
            <Button variant="outline">Learn More</Button>
          </XStack>
        </Section>

        {/* Content Section */}
        <Section gap="$4">
          <Heading level={3}>Latest Content</Heading>
          {isLoading ? (
            <YStack alignItems="center" padding="$6">
              <Spinner size="large" />
            </YStack>
          ) : error ? (
            <BodyText color="$red10">Failed to load content</BodyText>
          ) : (
            <YStack gap="$4">
              {content.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  onPress={() => router.push(`/details/${item.id}`)}
                />
              ))}
            </YStack>
          )}
        </Section>

        {/* Features Section */}
        <Section gap="$4">
          <Heading level={3}>Features</Heading>
          <YStack gap="$3">
            {Object.entries(config.features).map(([key, enabled]) => (
              <XStack
                key={key}
                backgroundColor="$background"
                padding="$4"
                borderRadius="$4"
                borderWidth={1}
                borderColor="$borderColor"
                justifyContent="space-between"
                alignItems="center"
              >
                <BodyText fontWeight="600">{key}</BodyText>
                <BodyText muted>{enabled ? 'Enabled' : 'Disabled'}</BodyText>
              </XStack>
            ))}
          </YStack>
        </Section>
      </YStack>
    </ScrollView>
  );
}
