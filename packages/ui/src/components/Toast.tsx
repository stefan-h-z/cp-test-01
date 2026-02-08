import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from '@tamagui/lucide-icons';
import React, { useEffect, useState, useCallback } from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { Button } from './Button';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const toastConfig: Record<
  ToastType,
  {
    icon: React.ComponentType<{ size: number; color?: string }>;
    bgColor: string;
    iconColor: string;
  }
> = {
  success: { icon: CheckCircle, bgColor: '$green2', iconColor: '$green10' },
  error: { icon: AlertCircle, bgColor: '$red2', iconColor: '$red10' },
  warning: { icon: AlertTriangle, bgColor: '$yellow2', iconColor: '$yellow10' },
  info: { icon: Info, bgColor: '$blue2', iconColor: '$blue10' },
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [visible, setVisible] = useState(false);
  const config = toastConfig[toast.type];
  const IconComponent = config.icon;

  useEffect(() => {
    // Trigger fade in on mount
    const frame = requestAnimationFrame(() => setVisible(true));

    // Auto dismiss
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timer);
      };
    }
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => onDismiss(toast.id), 200);
  }, [onDismiss, toast.id]);

  return (
    <XStack
      backgroundColor={config.bgColor}
      borderRadius="$3"
      padding="$3"
      marginBottom="$2"
      alignItems="flex-start"
      gap="$3"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
      elevation={3}
      maxWidth={400}
      width="100%"
      opacity={visible ? 1 : 0}
      y={visible ? 0 : -20}
      animation="fast"
    >
      <IconComponent size={20} color={config.iconColor} />

      <YStack flex={1} gap="$1">
        <Text fontWeight="600" fontSize="$3">
          {toast.title}
        </Text>
        {toast.message && (
          <Text fontSize="$2" color="$gray11">
            {toast.message}
          </Text>
        )}
        {toast.action && (
          <Button
            size="$2"
            variant="ghost"
            marginTop="$1"
            alignSelf="flex-start"
            onPress={toast.action.onPress}
          >
            {toast.action.label}
          </Button>
        )}
      </YStack>

      <Button size="$2" variant="ghost" circular padding="$1" onPress={handleDismiss}>
        <X size={16} color="$gray10" />
      </Button>
    </XStack>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
  position?: 'top' | 'bottom';
}

export function ToastContainer({ toasts, onDismiss, position = 'top' }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <YStack
      position="absolute"
      left={0}
      right={0}
      {...(position === 'top' ? { top: 0 } : { bottom: 0 })}
      padding="$4"
      paddingTop={position === 'top' ? '$10' : '$4'}
      paddingBottom={position === 'bottom' ? '$10' : '$4'}
      alignItems="center"
      pointerEvents="box-none"
      zIndex={9999}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </YStack>
  );
}
