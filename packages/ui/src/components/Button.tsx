import { styled, Button as TamaguiButton, GetProps } from 'tamagui';

export const Button = styled(TamaguiButton, {
  name: 'Button',
  backgroundColor: '$blue10',
  color: '$white',
  borderRadius: '$4',
  pressStyle: {
    opacity: 0.8,
    scale: 0.98,
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: '$blue10',
        color: '$white',
      },
      secondary: {
        backgroundColor: '$gray5',
        color: '$gray12',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$blue10',
        color: '$blue10',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '$blue10',
      },
    },
    size: {
      sm: {
        paddingHorizontal: '$3',
        paddingVertical: '$2',
        fontSize: '$2',
      },
      md: {
        paddingHorizontal: '$4',
        paddingVertical: '$3',
        fontSize: '$3',
      },
      lg: {
        paddingHorizontal: '$5',
        paddingVertical: '$4',
        fontSize: '$4',
      },
    },
  } as const,
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export type ButtonProps = GetProps<typeof Button>;
