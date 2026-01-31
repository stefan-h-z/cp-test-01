import { styled, Text, GetProps } from 'tamagui';

export const Heading = styled(Text, {
  name: 'Heading',
  fontFamily: '$heading',
  fontWeight: '700',
  color: '$color',
  variants: {
    level: {
      1: { fontSize: '$10', lineHeight: '$10' },
      2: { fontSize: '$9', lineHeight: '$9' },
      3: { fontSize: '$8', lineHeight: '$8' },
      4: { fontSize: '$7', lineHeight: '$7' },
      5: { fontSize: '$6', lineHeight: '$6' },
    },
  } as const,
  defaultVariants: {
    level: 1,
  },
});

export type HeadingProps = GetProps<typeof Heading>;

export const BodyText = styled(Text, {
  name: 'BodyText',
  fontFamily: '$body',
  color: '$color',
  variants: {
    size: {
      xs: { fontSize: '$1' },
      sm: { fontSize: '$2' },
      md: { fontSize: '$3' },
      lg: { fontSize: '$4' },
      xl: { fontSize: '$5' },
    },
    muted: {
      true: {
        color: '$gray11',
      },
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
});

export type BodyTextProps = GetProps<typeof BodyText>;

export const Label = styled(Text, {
  name: 'Label',
  fontFamily: '$body',
  fontSize: '$2',
  fontWeight: '500',
  color: '$gray11',
});

export type LabelProps = GetProps<typeof Label>;
