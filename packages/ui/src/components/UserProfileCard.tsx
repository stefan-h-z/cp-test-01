import type { AuthUser, AuthProviderType } from '@app/types';
import { styled, XStack, YStack, GetProps, Image } from 'tamagui';
import { Heading, BodyText } from './Typography';

// Inline provider labels to avoid circular dependency with @app/shared
const providerLabels: Record<string, string> = {
  google: 'Google',
  entra: 'Microsoft',
  dev: 'Development',
};

function getProviderLabel(provider: AuthProviderType): string {
  return providerLabels[provider] || provider;
}

const ProfileCardContainer = styled(YStack, {
  alignItems: 'center',
  gap: '$4',
});

const AvatarContainer = styled(YStack, {
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$blue5',

  variants: {
    size: {
      sm: {
        width: 48,
        height: 48,
        borderRadius: 24,
      },
      md: {
        width: 64,
        height: 64,
        borderRadius: 32,
      },
      lg: {
        width: 100,
        height: 100,
        borderRadius: 50,
      },
    },
  } as const,

  defaultVariants: {
    size: 'lg',
  },
});

const UserInfoContainer = styled(YStack, {
  alignItems: 'center',
  gap: '$1',
});

const CompactContainer = styled(XStack, {
  alignItems: 'center',
  gap: '$2',
});

export type UserProfileCardProps = GetProps<typeof ProfileCardContainer> & {
  /** User to display, or null for guest */
  user?: AuthUser | null;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show provider info */
  showProvider?: boolean;
  /** Compact horizontal layout */
  compact?: boolean;
};

/**
 * Displays user profile information with avatar
 * Supports authenticated users and guest fallback
 */
export function UserProfileCard({
  user,
  size = 'lg',
  showProvider = true,
  compact = false,
  ...props
}: UserProfileCardProps) {
  const displayName = user?.name || 'Guest User';
  const displayEmail = user?.email || 'Not signed in';
  const displayInitial = displayName.charAt(0).toUpperCase();

  const avatarSizes = {
    sm: { width: 48, height: 48, borderRadius: 24 },
    md: { width: 64, height: 64, borderRadius: 32 },
    lg: { width: 100, height: 100, borderRadius: 50 },
  };

  const avatarSize = avatarSizes[size];

  const Avatar = user?.avatar ? (
    <Image
      source={{ uri: user.avatar }}
      width={avatarSize.width}
      height={avatarSize.height}
      borderRadius={avatarSize.borderRadius}
    />
  ) : (
    <AvatarContainer size={size}>
      <Heading level={size === 'sm' ? 5 : size === 'md' ? 4 : 2}>{displayInitial}</Heading>
    </AvatarContainer>
  );

  if (compact) {
    return (
      <CompactContainer {...props}>
        {Avatar}
        <YStack>
          <BodyText size={size === 'sm' ? 'sm' : 'md'} fontWeight="600">
            {displayName}
          </BodyText>
          <BodyText size={size === 'sm' ? 'xs' : 'sm'} muted>
            {displayEmail}
          </BodyText>
        </YStack>
      </CompactContainer>
    );
  }

  return (
    <ProfileCardContainer {...props}>
      {Avatar}
      <UserInfoContainer>
        <Heading level={size === 'sm' ? 5 : size === 'md' ? 4 : 3}>{displayName}</Heading>
        <BodyText muted>{displayEmail}</BodyText>
        {showProvider && user?.provider && (
          <BodyText size="sm" muted>
            Signed in with {getProviderLabel(user.provider as AuthProviderType)}
          </BodyText>
        )}
      </UserInfoContainer>
    </ProfileCardContainer>
  );
}

export type UserAvatarProps = {
  /** User to display, or null for guest */
  user?: AuthUser | null;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
};

/**
 * Displays just the user avatar
 */
export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const displayName = user?.name || 'Guest User';
  const displayInitial = displayName.charAt(0).toUpperCase();

  const avatarSizes = {
    sm: { width: 32, height: 32, borderRadius: 16 },
    md: { width: 48, height: 48, borderRadius: 24 },
    lg: { width: 64, height: 64, borderRadius: 32 },
  };

  const avatarSize = avatarSizes[size];

  if (user?.avatar) {
    return (
      <Image
        source={{ uri: user.avatar }}
        width={avatarSize.width}
        height={avatarSize.height}
        borderRadius={avatarSize.borderRadius}
      />
    );
  }

  return (
    <AvatarContainer size={size}>
      <Heading level={size === 'sm' ? 5 : size === 'md' ? 4 : 3}>{displayInitial}</Heading>
    </AvatarContainer>
  );
}
