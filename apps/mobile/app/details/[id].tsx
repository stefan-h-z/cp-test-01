import { useDetailsScreenLogic } from '@app/shared';
import { YStack, XStack, Heading, BodyText, Button, Spinner, Image, Section } from '@app/ui';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ScrollView } from 'react-native';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { content, isLoading, notFound, formattedDate, typeLabel } = useDetailsScreenLogic(id);

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$6">
        <Spinner size="large" />
      </YStack>
    );
  }

  if (notFound || !content) {
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
                {typeLabel} • {formattedDate}
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
