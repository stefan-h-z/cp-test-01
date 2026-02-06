import React from 'react';
import { styled, Button as TamaguiButton, GetProps, Spinner } from 'tamagui';

// Modern button with gradient and glass options
export const Button = styled(TamaguiButton, {
  name: 'Button',
  fontFamily: '$body',
  fontWeight: '600',
  borderRadius: '$4',
  borderWidth: 0,
  cursor: 'pointer',
  animation: 'fast',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',

  // Modern shadow
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 4,
  elevation: 2,

  hoverStyle: {
    transform: [{ translateY: -1 }],
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },

  pressStyle: {
    transform: [{ scale: 0.98 }],
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },

  focusStyle: {
    outlineWidth: 2,
    outlineColor: '$primary',
    outlineOffset: 2,
    outlineStyle: 'solid',
  },

  disabledStyle: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: 'white',
        hoverStyle: {
          backgroundColor: '$primaryHover',
        },
        pressStyle: {
          backgroundColor: '$primaryPress',
        },
      },
      secondary: {
        backgroundColor: '$backgroundStrong',
        color: '$color',
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
        pressStyle: {
          backgroundColor: '$backgroundPress',
        },
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '$primary',
        color: '$primary',
        shadowOpacity: 0,
        hoverStyle: {
          backgroundColor: '$primary',
          color: 'white',
        },
        pressStyle: {
          backgroundColor: '$primaryPress',
          color: 'white',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '$primary',
        shadowOpacity: 0,
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
        pressStyle: {
          backgroundColor: '$backgroundPress',
        },
      },
      destructive: {
        backgroundColor: '$error',
        color: 'white',
        hoverStyle: {
          backgroundColor: '$error',
          opacity: 0.9,
        },
        pressStyle: {
          backgroundColor: '$error',
          opacity: 0.8,
        },
      },
      success: {
        backgroundColor: '$success',
        color: 'white',
        hoverStyle: {
          backgroundColor: '$success',
          opacity: 0.9,
        },
      },
      gradient: {
        color: 'white',
        // @ts-expect-error - web specific
        style: {
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        },
        hoverStyle: {
          opacity: 0.9,
        },
      },
      glass: {
        backgroundColor: '$glassBackground',
        color: '$color',
        borderWidth: 1,
        borderColor: '$glassBorder',
        // @ts-expect-error - web specific CSS property
        style: {
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        },
        hoverStyle: {
          backgroundColor: '$glassBackground',
        },
      },
    },
    size: {
      xs: {
        height: 28,
        paddingHorizontal: '$2',
        fontSize: '$1',
        borderRadius: '$2',
      },
      sm: {
        height: 34,
        paddingHorizontal: '$3',
        fontSize: '$2',
        borderRadius: '$3',
      },
      md: {
        height: 42,
        paddingHorizontal: '$4',
        fontSize: '$3',
        borderRadius: '$4',
      },
      lg: {
        height: 50,
        paddingHorizontal: '$5',
        fontSize: '$4',
        borderRadius: '$4',
      },
      xl: {
        height: 58,
        paddingHorizontal: '$6',
        fontSize: '$5',
        borderRadius: '$5',
      },
    },
    rounded: {
      none: { borderRadius: 0 },
      sm: { borderRadius: '$2' },
      md: { borderRadius: '$4' },
      lg: { borderRadius: '$6' },
      full: { borderRadius: '$full' },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export type ButtonProps = GetProps<typeof Button> & {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

// Button with loading state
export function ButtonWithLoading({
  loading,
  disabled,
  children,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? (
        <Spinner size="small" color="$color" />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </Button>
  );
}

// Icon button
export const IconButton = styled(TamaguiButton, {
  name: 'IconButton',
  width: 40,
  height: 40,
  padding: 0,
  borderRadius: '$3',
  backgroundColor: 'transparent',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  animation: 'fast',

  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },

  pressStyle: {
    backgroundColor: '$backgroundPress',
    scale: 0.95,
  },

  variants: {
    size: {
      sm: {
        width: 32,
        height: 32,
        borderRadius: '$2',
      },
      md: {
        width: 40,
        height: 40,
        borderRadius: '$3',
      },
      lg: {
        width: 48,
        height: 48,
        borderRadius: '$4',
      },
    },
    variant: {
      default: {},
      filled: {
        backgroundColor: '$backgroundStrong',
      },
      primary: {
        backgroundColor: '$primary',
        hoverStyle: {
          backgroundColor: '$primaryHover',
        },
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export type IconButtonProps = GetProps<typeof IconButton>;

// Floating Action Button
export const FAB = styled(TamaguiButton, {
  name: 'FAB',
  position: 'absolute',
  bottom: 24,
  right: 24,
  width: 56,
  height: 56,
  borderRadius: '$full',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  animation: 'medium',
  zIndex: 100,

  shadowColor: '$shadowColorStrong',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 12,
  elevation: 6,

  hoverStyle: {
    scale: 1.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },

  pressStyle: {
    scale: 0.95,
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        // @ts-expect-error - web specific gradient
        style: {
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        },
      },
      secondary: {
        backgroundColor: '$secondary',
      },
      accent: {
        backgroundColor: '$accent',
      },
    },
    size: {
      md: {
        width: 56,
        height: 56,
      },
      lg: {
        width: 64,
        height: 64,
      },
    },
    extended: {
      true: {
        width: 'auto',
        paddingHorizontal: '$5',
        borderRadius: '$full',
        gap: '$2',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export type FABProps = GetProps<typeof FAB>;
