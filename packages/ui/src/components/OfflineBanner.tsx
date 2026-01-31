import React from 'react';
import { XStack, Text } from 'tamagui';
import { WifiOff } from '@tamagui/lucide-icons';

interface OfflineBannerProps {
  isOffline: boolean;
  message?: string;
}

export function OfflineBanner({
  isOffline,
  message = 'You are offline. Some features may be unavailable.',
}: OfflineBannerProps) {
  if (!isOffline) return null;

  return (
    <XStack
      backgroundColor="$yellow3"
      paddingVertical="$2"
      paddingHorizontal="$4"
      alignItems="center"
      justifyContent="center"
      gap="$2"
    >
      <WifiOff size={16} color="$yellow11" />
      <Text fontSize="$2" color="$yellow11" fontWeight="500">
        {message}
      </Text>
    </XStack>
  );
}
