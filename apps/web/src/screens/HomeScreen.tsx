import { useHomeScreenLogic } from '@app/shared';
import { YStack, XStack, Section, Heading, BodyText, ContentCard, Button, Spinner } from '@app/ui';
import { useNavigate } from 'react-router-dom';

export function HomeScreen() {
  const navigate = useNavigate();
  const { config, content, isLoading, error, features } = useHomeScreenLogic();

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
          {Object.entries(features).map(([key, enabled]) => (
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
