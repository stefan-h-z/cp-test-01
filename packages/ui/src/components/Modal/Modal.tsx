import React, { useEffect, useCallback } from 'react';
import { YStack, XStack, Text, styled, AnimatePresence } from 'tamagui';
import { X } from '@tamagui/lucide-icons';
import type { ModalProps, ModalSize } from '@app/types';

const Overlay = styled(YStack, {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  animation: 'quick',
  opacity: 0,
  enterStyle: {
    opacity: 0,
  },
  exitStyle: {
    opacity: 0,
  },
  variants: {
    open: {
      true: {
        opacity: 1,
      },
    },
  } as const,
});

const modalSizes: Record<ModalSize, number | string> = {
  sm: 400,
  md: 500,
  lg: 640,
  xl: 800,
  full: '95%',
};

const ModalContainer = styled(YStack, {
  backgroundColor: '$background',
  borderRadius: '$4',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 20,
  maxHeight: '90vh',
  overflow: 'hidden',
  animation: 'medium',
  scale: 0.95,
  opacity: 0,
  enterStyle: {
    scale: 0.95,
    opacity: 0,
  },
  exitStyle: {
    scale: 0.95,
    opacity: 0,
  },
  variants: {
    open: {
      true: {
        scale: 1,
        opacity: 1,
      },
    },
  } as const,
});

const ModalHeader = styled(XStack, {
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  borderBottomWidth: 1,
  borderBottomColor: '$gray5',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const ModalTitle = styled(Text, {
  fontSize: '$5',
  fontWeight: '600',
  color: '$gray12',
});

const ModalDescription = styled(Text, {
  fontSize: '$3',
  color: '$gray10',
  marginTop: '$1',
});

const CloseButton = styled(XStack, {
  width: 32,
  height: 32,
  borderRadius: '$2',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  hoverStyle: {
    backgroundColor: '$gray4',
  },
  pressStyle: {
    backgroundColor: '$gray5',
  },
});

const ModalBody = styled(YStack, {
  padding: '$4',
  flex: 1,
  overflow: 'auto',
});

const ModalFooter = styled(XStack, {
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  borderTopWidth: 1,
  borderTopColor: '$gray5',
  justifyContent: 'flex-end',
  gap: '$3',
});

export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  footer,
}: ModalProps) {
  // Handle escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!open) return null;

  const width = modalSizes[size];

  return (
    <AnimatePresence>
      {open && (
        <Overlay
          open={open}
          onPress={handleOverlayClick}
          style={{ position: 'fixed' } as never}
        >
          <ModalContainer
            open={open}
            width={width}
            maxWidth="95%"
            onPress={handleContainerClick}
          >
            {(title || showCloseButton) && (
              <ModalHeader>
                <YStack flex={1}>
                  {title && <ModalTitle>{title}</ModalTitle>}
                  {description && <ModalDescription>{description}</ModalDescription>}
                </YStack>
                {showCloseButton && (
                  <CloseButton onPress={onClose}>
                    <X size={18} color="$gray10" />
                  </CloseButton>
                )}
              </ModalHeader>
            )}

            <ModalBody>{children}</ModalBody>

            {footer && <ModalFooter>{footer}</ModalFooter>}
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
}

// Export sub-components for custom composition
export { ModalHeader, ModalBody, ModalFooter, ModalTitle, ModalDescription };
