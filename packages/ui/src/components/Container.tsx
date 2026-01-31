import { styled, YStack, GetProps } from 'tamagui';

export const Container = styled(YStack, {
  name: 'Container',
  flex: 1,
  width: '100%',
  maxWidth: 1200,
  marginHorizontal: 'auto',
  paddingHorizontal: '$4',
  variants: {
    centered: {
      true: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    padded: {
      true: {
        padding: '$4',
      },
    },
  } as const,
});

export type ContainerProps = GetProps<typeof Container>;

export const Section = styled(YStack, {
  name: 'Section',
  width: '100%',
  paddingVertical: '$6',
  gap: '$4',
});

export type SectionProps = GetProps<typeof Section>;

export const Row = styled(YStack, {
  name: 'Row',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '$3',

  $gtSm: {
    flexDirection: 'row',
  },
});

export type RowProps = GetProps<typeof Row>;
