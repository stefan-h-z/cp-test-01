import React from 'react';
import { YStack, XStack, styled, GetProps } from 'tamagui';

// Base glass container with blur effect
const GlassBase = styled(YStack, {
  name: 'GlassCard',
  backgroundColor: '$glassBackground',
  borderWidth: 1,
  borderColor: '$glassBorder',
  borderRadius: '$5',
  overflow: 'hidden',
  // CSS backdrop-filter for web
  // @ts-ignore - web-specific property
  style: {
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  variants: {
    size: {
      sm: {
        padding: '$3',
        borderRadius: '$3',
      },
      md: {
        padding: '$4',
        borderRadius: '$4',
      },
      lg: {
        padding: '$5',
        borderRadius: '$5',
      },
      xl: {
        padding: '$6',
        borderRadius: '$6',
      },
    },
    variant: {
      default: {
        backgroundColor: '$glassBackground',
        borderColor: '$glassBorder',
      },
      solid: {
        backgroundColor: '$background',
        borderColor: '$borderColor',
        // @ts-ignore
        style: {
          backdropFilter: 'none',
        },
      },
      gradient: {
        backgroundColor: 'transparent',
        borderColor: '$glassBorder',
      },
    },
    elevated: {
      true: {
        shadowColor: '$shadowColor',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 24,
        elevation: 8,
      },
      false: {
        shadowColor: '$shadowColor',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
      },
    },
    interactive: {
      true: {
        cursor: 'pointer',
        animation: 'fast',
        hoverStyle: {
          scale: 1.02,
          shadowOffset: { width: 0, height: 12 },
          shadowRadius: 32,
        },
        pressStyle: {
          scale: 0.98,
        },
      },
    },
  } as const,
  defaultVariants: {
    size: 'md',
    variant: 'default',
    elevated: false,
  },
});

export type GlassCardProps = GetProps<typeof GlassBase>;

export function GlassCard(props: GlassCardProps) {
  return <GlassBase {...props} />;
}

// Glass card with gradient border
const GradientBorderWrapper = styled(YStack, {
  padding: 1,
  borderRadius: '$5',
  overflow: 'hidden',
  // @ts-ignore
  style: {
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.5) 0%, rgba(168, 85, 247, 0.5) 100%)',
  },
});

export function GlassCardGradient({
  children,
  ...props
}: GlassCardProps) {
  return (
    <GradientBorderWrapper>
      <GlassBase {...props} borderWidth={0}>
        {children}
      </GlassBase>
    </GradientBorderWrapper>
  );
}

// Elevated card with modern shadow
const ElevatedCardBase = styled(YStack, {
  name: 'ElevatedCard',
  backgroundColor: '$background',
  borderRadius: '$4',
  padding: '$4',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 16,
  elevation: 4,
  animation: 'fast',
  variants: {
    size: {
      sm: {
        padding: '$3',
        borderRadius: '$3',
      },
      md: {
        padding: '$4',
        borderRadius: '$4',
      },
      lg: {
        padding: '$5',
        borderRadius: '$5',
      },
    },
    interactive: {
      true: {
        cursor: 'pointer',
        hoverStyle: {
          shadowOffset: { width: 0, height: 8 },
          shadowRadius: 24,
          translateY: -2,
        },
        pressStyle: {
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 8,
          translateY: 0,
        },
      },
    },
    variant: {
      default: {},
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$borderColor',
        shadowOpacity: 0,
      },
      filled: {
        backgroundColor: '$backgroundStrong',
      },
    },
  } as const,
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export type ElevatedCardProps = GetProps<typeof ElevatedCardBase>;

export function ElevatedCard(props: ElevatedCardProps) {
  return <ElevatedCardBase {...props} />;
}

// Feature card with icon and gradient accent
const FeatureCardBase = styled(YStack, {
  name: 'FeatureCard',
  backgroundColor: '$background',
  borderRadius: '$5',
  padding: '$5',
  gap: '$3',
  borderWidth: 1,
  borderColor: '$borderColor',
  animation: 'medium',
  variants: {
    interactive: {
      true: {
        cursor: 'pointer',
        hoverStyle: {
          borderColor: '$primary',
          shadowColor: '$primary',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
        },
      },
    },
  } as const,
});

export interface FeatureCardProps extends GetProps<typeof FeatureCardBase> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  children,
  ...props
}: FeatureCardProps) {
  return (
    <FeatureCardBase {...props}>
      {icon && (
        <XStack
          width={48}
          height={48}
          borderRadius="$3"
          alignItems="center"
          justifyContent="center"
          // @ts-ignore
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          }}
        >
          {icon}
        </XStack>
      )}
      {title && (
        <XStack>
          <YStack>
            {/* Title would be Text component */}
          </YStack>
        </XStack>
      )}
      {children}
    </FeatureCardBase>
  );
}

// Stats card
const StatsCardBase = styled(YStack, {
  name: 'StatsCard',
  backgroundColor: '$background',
  borderRadius: '$4',
  padding: '$4',
  gap: '$2',
  borderWidth: 1,
  borderColor: '$borderColor',
});

export interface StatsCardProps extends GetProps<typeof StatsCardBase> {
  label?: string;
  value?: string | number;
  change?: number;
  changeLabel?: string;
}

export function StatsCard(props: StatsCardProps) {
  return <StatsCardBase {...props} />;
}
