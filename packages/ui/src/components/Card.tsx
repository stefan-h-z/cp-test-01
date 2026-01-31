import { styled, Card as TamaguiCard, XStack, YStack, Paragraph, H3, Image, GetProps } from 'tamagui';
import type { ContentItem } from '@app/types';

const StyledCard = styled(TamaguiCard, {
  name: 'Card',
  backgroundColor: '$background',
  borderRadius: '$4',
  overflow: 'hidden',
  elevate: true,
  bordered: true,
  variants: {
    variant: {
      elevated: {
        elevation: '$4',
      },
      outlined: {
        elevation: '$0',
        borderWidth: 1,
        borderColor: '$borderColor',
      },
      filled: {
        backgroundColor: '$gray2',
        elevation: '$0',
      },
    },
    size: {
      sm: {
        padding: '$2',
      },
      md: {
        padding: '$3',
      },
      lg: {
        padding: '$4',
      },
    },
  } as const,
  defaultVariants: {
    variant: 'elevated',
    size: 'md',
  },
});

export type CardProps = GetProps<typeof StyledCard>;

interface ContentCardProps extends CardProps {
  item: ContentItem;
  onPress?: () => void;
}

export function ContentCard({ item, onPress, ...props }: ContentCardProps) {
  return (
    <StyledCard pressStyle={{ scale: 0.98 }} onPress={onPress} {...props}>
      {item.imageUrl && (
        <TamaguiCard.Header padded>
          <Image
            source={{ uri: item.imageUrl }}
            width="100%"
            height={200}
            resizeMode="cover"
            borderRadius="$2"
          />
        </TamaguiCard.Header>
      )}
      <TamaguiCard.Footer padded>
        <YStack gap="$2">
          <H3>{item.title}</H3>
          {item.body && (
            <Paragraph size="$3" color="$gray11" numberOfLines={3}>
              {item.body}
            </Paragraph>
          )}
          <XStack gap="$2">
            <Paragraph size="$1" color="$gray10">
              {new Date(item.createdAt).toLocaleDateString()}
            </Paragraph>
          </XStack>
        </YStack>
      </TamaguiCard.Footer>
    </StyledCard>
  );
}

export { StyledCard as Card };
