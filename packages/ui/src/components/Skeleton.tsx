import React from 'react';
import { YStack, XStack, styled, GetProps } from 'tamagui';

// Base skeleton with shimmer animation
const SkeletonBase = styled(YStack, {
  name: 'Skeleton',
  backgroundColor: '$backgroundStrong',
  borderRadius: '$2',
  overflow: 'hidden',
  position: 'relative',
  // Shimmer animation via CSS
  // @ts-ignore
  style: {
    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  },
  variants: {
    variant: {
      pulse: {
        animation: 'pulse',
        // @ts-ignore
        style: {
          animation: 'pulse 2s ease-in-out infinite',
        },
      },
      shimmer: {
        // @ts-ignore
        style: {
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite linear',
        },
      },
      wave: {
        // @ts-ignore
        style: {
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 75%, transparent 100%)',
          backgroundSize: '400% 100%',
          animation: 'wave 2s infinite ease-in-out',
        },
      },
    },
    rounded: {
      none: { borderRadius: 0 },
      sm: { borderRadius: '$1' },
      md: { borderRadius: '$2' },
      lg: { borderRadius: '$3' },
      xl: { borderRadius: '$4' },
      full: { borderRadius: '$full' },
    },
  } as const,
  defaultVariants: {
    variant: 'shimmer',
    rounded: 'md',
  },
});

// Add global CSS for animations
if (typeof document !== 'undefined') {
  const styleId = 'skeleton-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @keyframes wave {
        0% { background-position: 400% 0; }
        100% { background-position: -400% 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

export type SkeletonProps = GetProps<typeof SkeletonBase>;

export function Skeleton(props: SkeletonProps) {
  return <SkeletonBase {...props} />;
}

// Text skeleton
export function SkeletonText({
  lines = 3,
  gap = '$2',
  ...props
}: SkeletonProps & { lines?: number; gap?: string | number }) {
  return (
    <YStack gap={gap} width="100%">
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBase
          key={index}
          height={16}
          width={index === lines - 1 ? '70%' : '100%'}
          {...props}
        />
      ))}
    </YStack>
  );
}

// Avatar skeleton
export function SkeletonAvatar({
  size = 48,
  ...props
}: SkeletonProps & { size?: number }) {
  return (
    <SkeletonBase
      width={size}
      height={size}
      borderRadius="$full"
      {...props}
    />
  );
}

// Card skeleton
export function SkeletonCard({
  showImage = true,
  showAvatar = false,
  lines = 2,
  ...props
}: SkeletonProps & {
  showImage?: boolean;
  showAvatar?: boolean;
  lines?: number;
}) {
  return (
    <YStack
      backgroundColor="$background"
      borderRadius="$4"
      padding="$4"
      gap="$3"
      borderWidth={1}
      borderColor="$borderColor"
      {...props}
    >
      {showImage && (
        <SkeletonBase height={160} width="100%" borderRadius="$3" />
      )}
      {showAvatar && (
        <XStack gap="$3" alignItems="center">
          <SkeletonAvatar size={40} />
          <YStack gap="$2" flex={1}>
            <SkeletonBase height={14} width="60%" />
            <SkeletonBase height={12} width="40%" />
          </YStack>
        </XStack>
      )}
      <SkeletonText lines={lines} />
    </YStack>
  );
}

// List item skeleton
export function SkeletonListItem({
  showAvatar = true,
  showAction = false,
  ...props
}: SkeletonProps & {
  showAvatar?: boolean;
  showAction?: boolean;
}) {
  return (
    <XStack
      padding="$3"
      gap="$3"
      alignItems="center"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      {...props}
    >
      {showAvatar && <SkeletonAvatar size={44} />}
      <YStack flex={1} gap="$2">
        <SkeletonBase height={14} width="70%" />
        <SkeletonBase height={12} width="50%" />
      </YStack>
      {showAction && (
        <SkeletonBase height={32} width={32} borderRadius="$2" />
      )}
    </XStack>
  );
}

// Button skeleton
export function SkeletonButton({
  width = 120,
  height = 40,
  ...props
}: SkeletonProps & { width?: number | string; height?: number }) {
  return (
    <SkeletonBase
      width={width}
      height={height}
      borderRadius="$3"
      {...props}
    />
  );
}

// Input skeleton
export function SkeletonInput({
  showLabel = true,
  ...props
}: SkeletonProps & { showLabel?: boolean }) {
  return (
    <YStack gap="$2" width="100%">
      {showLabel && <SkeletonBase height={14} width={80} />}
      <SkeletonBase height={44} width="100%" borderRadius="$3" {...props} />
    </YStack>
  );
}

// Table skeleton
export function SkeletonTable({
  rows = 5,
  columns = 4,
  ...props
}: SkeletonProps & { rows?: number; columns?: number }) {
  return (
    <YStack gap="$2" width="100%" {...props}>
      {/* Header */}
      <XStack gap="$3" paddingVertical="$3" borderBottomWidth={1} borderBottomColor="$borderColor">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonBase key={i} height={14} flex={1} />
        ))}
      </XStack>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <XStack
          key={rowIndex}
          gap="$3"
          paddingVertical="$3"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonBase
              key={colIndex}
              height={12}
              flex={1}
              width={colIndex === 0 ? '80%' : '60%'}
            />
          ))}
        </XStack>
      ))}
    </YStack>
  );
}

// Profile skeleton
export function SkeletonProfile(props: SkeletonProps) {
  return (
    <YStack alignItems="center" gap="$4" padding="$4" {...props}>
      <SkeletonAvatar size={96} />
      <YStack alignItems="center" gap="$2" width="100%">
        <SkeletonBase height={20} width={150} />
        <SkeletonBase height={14} width={100} />
      </YStack>
      <XStack gap="$6" marginTop="$2">
        {[1, 2, 3].map((i) => (
          <YStack key={i} alignItems="center" gap="$1">
            <SkeletonBase height={18} width={40} />
            <SkeletonBase height={12} width={50} />
          </YStack>
        ))}
      </XStack>
    </YStack>
  );
}
