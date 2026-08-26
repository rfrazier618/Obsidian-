import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/**
 * One modal/overlay system and one toast system for the whole Estate —
 * the direct replacement for Estate 1.0's 9 hand-written sheet/modal
 * open-close pairs and 7 independent toast implementations.
 */
export interface ModalContent {
  id: string;
  title: string;
  body: ReactNode;
}

interface OverlayState {
  modal: ModalContent | null;
  openModal: (content: ModalContent) => void;
  closeModal: () => void;
  toasts: Array<{ id: number; message: string }>;
  showToast: (message: string) => void;
}

const OverlayContext = createContext<OverlayState | null>(null);
let toastSeq = 0;

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalContent | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string }>>([]);

  const openModal = useCallback((content: ModalContent) => setModal(content), []);
  const closeModal = useCallback(() => setModal(null), []);

  const showToast = useCallback((message: string) => {
    const id = ++toastSeq;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const value = useMemo<OverlayState>(
    () => ({ modal, openModal, closeModal, toasts, showToast }),
    [modal, openModal, closeModal, toasts, showToast]
  );

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
}

export function useOverlay(): OverlayState {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error('useOverlay must be used within OverlayProvider');
  return ctx;
}
