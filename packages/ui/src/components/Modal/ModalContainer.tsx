import type { ModalState, AlertDialogProps, ConfirmDialogProps } from '@app/types';
import React from 'react';
import { AlertDialog } from './AlertDialog';
import { ConfirmDialog } from './ConfirmDialog';

export interface ModalContainerProps {
  modals: ModalState[];
  onClose: (id: string) => void;
}

export function ModalContainer({ modals, onClose }: ModalContainerProps) {
  return (
    <>
      {modals.map((modal) => {
        const handleClose = () => onClose(modal.id);

        switch (modal.type) {
          case 'alert': {
            const alertProps = modal.props as Omit<AlertDialogProps, 'open' | 'onClose'>;
            return (
              <AlertDialog
                key={modal.id}
                open={true}
                onClose={handleClose}
                {...alertProps}
              />
            );
          }

          case 'confirm': {
            const confirmProps = modal.props as Omit<ConfirmDialogProps, 'open' | 'onClose'>;
            return (
              <ConfirmDialog
                key={modal.id}
                open={true}
                onClose={handleClose}
                {...confirmProps}
              />
            );
          }

          default:
            return null;
        }
      })}
    </>
  );
}
