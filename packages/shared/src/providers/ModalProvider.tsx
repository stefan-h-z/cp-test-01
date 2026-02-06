import type {
  ModalState,
  ModalContextValue,
  AlertDialogProps,
  ConfirmDialogProps,
} from '@app/types';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

const ModalContext = createContext<ModalContextValue | null>(null);

let modalIdCounter = 0;

function generateModalId(): string {
  return `modal-${++modalIdCounter}-${Date.now()}`;
}

export interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<ModalState[]>([]);
  const [alertResolvers, setAlertResolvers] = useState<
    Map<string, () => void>
  >(new Map());
  const [confirmResolvers, setConfirmResolvers] = useState<
    Map<string, (result: boolean) => void>
  >(new Map());

  const openModal = useCallback((modal: Omit<ModalState, 'id'>): string => {
    const id = generateModalId();
    setModals((prev) => [...prev, { ...modal, id }]);
    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));

    // Resolve alert promise if exists
    const alertResolver = alertResolvers.get(id);
    if (alertResolver) {
      alertResolver();
      setAlertResolvers((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    }

    // Resolve confirm promise with false if exists (user closed without confirming)
    const confirmResolver = confirmResolvers.get(id);
    if (confirmResolver) {
      confirmResolver(false);
      setConfirmResolvers((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    }
  }, [alertResolvers, confirmResolvers]);

  const closeAllModals = useCallback(() => {
    // Resolve all pending promises
    alertResolvers.forEach((resolver) => resolver());
    confirmResolvers.forEach((resolver) => resolver(false));

    setModals([]);
    setAlertResolvers(new Map());
    setConfirmResolvers(new Map());
  }, [alertResolvers, confirmResolvers]);

  const alert = useCallback(
    (props: Omit<AlertDialogProps, 'open' | 'onClose'>): Promise<void> => {
      return new Promise((resolve) => {
        const id = generateModalId();

        setAlertResolvers((prev) => {
          const next = new Map(prev);
          next.set(id, resolve);
          return next;
        });

        setModals((prev) => [
          ...prev,
          {
            id,
            type: 'alert',
            props: {
              ...props,
              onConfirm: () => {
                props.onConfirm?.();
                resolve();
                setModals((prev) => prev.filter((modal) => modal.id !== id));
                setAlertResolvers((prev) => {
                  const next = new Map(prev);
                  next.delete(id);
                  return next;
                });
              },
            },
          },
        ]);
      });
    },
    []
  );

  const confirm = useCallback(
    (
      props: Omit<ConfirmDialogProps, 'open' | 'onClose' | 'onConfirm'>
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        const id = generateModalId();

        setConfirmResolvers((prev) => {
          const next = new Map(prev);
          next.set(id, resolve);
          return next;
        });

        setModals((prev) => [
          ...prev,
          {
            id,
            type: 'confirm',
            props: {
              ...props,
              onConfirm: async () => {
                resolve(true);
                setModals((prev) => prev.filter((modal) => modal.id !== id));
                setConfirmResolvers((prev) => {
                  const next = new Map(prev);
                  next.delete(id);
                  return next;
                });
              },
              onCancel: () => {
                props.onCancel?.();
                resolve(false);
                setModals((prev) => prev.filter((modal) => modal.id !== id));
                setConfirmResolvers((prev) => {
                  const next = new Map(prev);
                  next.delete(id);
                  return next;
                });
              },
            },
          },
        ]);
      });
    },
    []
  );

  const value = useMemo<ModalContextValue>(
    () => ({
      modals,
      openModal,
      closeModal,
      closeAllModals,
      alert,
      confirm,
    }),
    [modals, openModal, closeModal, closeAllModals, alert, confirm]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export function useModal(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export function useModalOptional(): ModalContextValue | null {
  return useContext(ModalContext);
}

export { ModalContext };
