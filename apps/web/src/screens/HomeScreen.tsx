import { useNavigate } from 'react-router-dom';
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

export function HomeScreen() {
  const navigate = useNavigate();
  const config = useAppConfig();
  const { data, isLoading, error } = useContentList();

  // Use demo content if API is not available
  const content = data?.data ?? demoContent;

  return (
    <YStack gap="$6" paddingVertical="$4">
      {/* Hero Section */}
      <Section alignItems="center" gap="$4">
        <Heading level={1}>Welcome to {config.name}</Heading>
        <BodyText size="lg" muted textAlign="center" maxWidth={600}>
          A cross-platform application built with React, React Native, Tamagui, and TanStack Query.
          This serves as a foundation for building configurable mobile and web applications.
        </BodyText>
        <XStack gap="$3">
          <Button variant="primary" onPress={() => navigate('/explore')}>
            Explore
          </Button>
          <Button variant="outline">Learn More</Button>
        </XStack>
      </Section>

      {/* Content Section */}
      <Section>
        <Heading level={2}>Latest Content</Heading>
        {isLoading ? (
          <YStack alignItems="center" padding="$6">
            <Spinner size="large" />
          </YStack>
        ) : error ? (
          <BodyText color="$red10">Failed to load content</BodyText>
        ) : (
          <XStack flexWrap="wrap" gap="$4">
            {content.map((item) => (
              <YStack key={item.id} width={350} $sm={{ width: '100%' }}>
                <ContentCard
                  item={item}
                  onPress={() => navigate(`/details/${item.id}`)}
                />
              </YStack>
            ))}
          </XStack>
        )}
      </Section>

      {/* Features Section */}
      <Section>
        <Heading level={2}>Features</Heading>
        <XStack flexWrap="wrap" gap="$4">
          {Object.entries(config.features).map(([key, enabled]) => (
            <YStack
              key={key}
              backgroundColor="$background"
              padding="$4"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$borderColor"
              width={200}
            >
              <BodyText fontWeight="600">{key}</BodyText>
              <BodyText muted size="sm">
                {enabled ? 'Enabled' : 'Disabled'}
              </BodyText>
            </YStack>
          ))}
        </XStack>
      </Section>
    </YStack>
  );
}
