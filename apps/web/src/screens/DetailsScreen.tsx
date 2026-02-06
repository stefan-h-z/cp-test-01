import { useDetailsScreenLogic } from '@app/shared';
import { YStack, XStack, Heading, BodyText, Button, Spinner, Image, Section } from '@app/ui';
import { useParams, useNavigate } from 'react-router-dom';

export function DetailsScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
            {typeLabel} • {formattedDate}
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
