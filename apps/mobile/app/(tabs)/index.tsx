import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { YStack, XStack, Section, Heading, BodyText, ContentCard, Button, Spinner } from '@app/ui';
import { useHomeScreenLogic } from '@app/shared';

export default function HomeScreen() {
  const router = useRouter();
  const { config, content, isLoading, error, features } = useHomeScreenLogic();

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
            {Object.entries(features).map(([key, enabled]) => (
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
