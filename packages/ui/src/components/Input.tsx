import { styled, Input as TamaguiInput, TextArea as TamaguiTextArea, GetProps } from 'tamagui';

export const Input = styled(TamaguiInput, {
  name: 'Input',
  backgroundColor: '$background',
  borderWidth: 1,
  borderColor: '$borderColor',
  borderRadius: '$3',
  paddingHorizontal: '$3',
  paddingVertical: '$2',
  fontSize: '$3',
  color: '$color',
  placeholderTextColor: '$gray10',

  focusStyle: {
    borderColor: '$blue10',
    outlineColor: '$blue5',
    outlineWidth: 2,
    outlineStyle: 'solid',
  },

  variants: {
    variant: {
      default: {},
      filled: {
        backgroundColor: '$gray3',
        borderColor: 'transparent',
      },
    },
    size: {
      sm: {
        height: 36,
        fontSize: '$2',
      },
      md: {
        height: 44,
        fontSize: '$3',
      },
      lg: {
        height: 52,
        fontSize: '$4',
      },
    },
    error: {
      true: {
        borderColor: '$red10',
      },
    },
  } as const,
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export type InputProps = GetProps<typeof Input>;

export const TextArea = styled(TamaguiTextArea, {
  name: 'TextArea',
  backgroundColor: '$background',
  borderWidth: 1,
  borderColor: '$borderColor',
  borderRadius: '$3',
  padding: '$3',
  fontSize: '$3',
  color: '$color',
  placeholderTextColor: '$gray10',
  minHeight: 100,

  focusStyle: {
    borderColor: '$blue10',
    outlineColor: '$blue5',
    outlineWidth: 2,
    outlineStyle: 'solid',
  },

  variants: {
    error: {
      true: {
        borderColor: '$red10',
      },
    },
  } as const,
});

export type TextAreaProps = GetProps<typeof TextArea>;
