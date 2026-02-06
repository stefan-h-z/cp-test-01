import type { ConfirmDialogProps } from '@app/types';
import { AlertTriangle, HelpCircle } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { YStack, XStack, Text, styled } from 'tamagui';
import { Button } from '../Button';
import { Modal } from './Modal';

const IconContainer = styled(XStack, {
  width: 48,
  height: 48,
  borderRadius: 24,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '$3',
});

const MessageText = styled(Text, {
  fontSize: '$3',
  color: '$gray11',
  textAlign: 'center',
  lineHeight: 22,
});

export function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  variant = 'default',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading: externalLoading,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading ?? internalLoading;

  const isDestructive = variant === 'destructive';
  const Icon = isDestructive ? AlertTriangle : HelpCircle;
  const iconColor = isDestructive ? '$red10' : '$blue10';
  const iconBgColor = isDestructive ? '$red3' : '$blue3';

  const handleCancel = () => {
    if (isLoading) return;
    onCancel?.();
    onClose();
  };

  const handleConfirm = async () => {
    if (isLoading) return;

    try {
      setInternalLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      // Let the caller handle errors
      console.error('Confirm action failed:', error);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <YStack alignItems="center" paddingVertical="$2">
        <IconContainer backgroundColor={iconBgColor}>
          <Icon size={24} color={iconColor} />
        </IconContainer>

        <Text
          fontSize="$5"
          fontWeight="600"
          color="$gray12"
          textAlign="center"
          marginBottom="$2"
        >
          {title}
        </Text>

        <MessageText>{message}</MessageText>

        <XStack marginTop="$4" width="100%" gap="$3">
          <Button
            flex={1}
            variant="secondary"
            onPress={handleCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            flex={1}
            variant={isDestructive ? 'destructive' : 'primary'}
            onPress={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : confirmLabel}
          </Button>
        </XStack>
      </YStack>
    </Modal>
  );
}
