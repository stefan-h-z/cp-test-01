import React from 'react';
import { YStack, XStack, Text, styled } from 'tamagui';
import { AlertCircle, CheckCircle, AlertTriangle, XCircle } from '@tamagui/lucide-icons';
import type { AlertDialogProps, AlertVariant } from '@app/types';
import { Modal } from './Modal';
import { Button } from '../Button';

const variantConfig: Record<
  AlertVariant,
  { icon: typeof AlertCircle; color: string; bgColor: string }
> = {
  info: { icon: AlertCircle, color: '$blue10', bgColor: '$blue3' },
  success: { icon: CheckCircle, color: '$green10', bgColor: '$green3' },
  warning: { icon: AlertTriangle, color: '$yellow10', bgColor: '$yellow3' },
  error: { icon: XCircle, color: '$red10', bgColor: '$red3' },
};

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

export function AlertDialog({
  open,
  onClose,
  title,
  message,
  variant = 'info',
  confirmLabel = 'OK',
  onConfirm,
}: AlertDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={false}
    >
      <YStack alignItems="center" paddingVertical="$2">
        <IconContainer backgroundColor={config.bgColor}>
          <Icon size={24} color={config.color} />
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

        <XStack marginTop="$4" width="100%">
          <Button
            flex={1}
            onPress={handleConfirm}
            variant={variant === 'error' ? 'destructive' : 'primary'}
          >
            {confirmLabel}
          </Button>
        </XStack>
      </YStack>
    </Modal>
  );
}
