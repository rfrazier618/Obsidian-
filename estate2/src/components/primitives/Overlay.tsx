import { useEffect, useRef, type ReactNode } from 'react';
import styles from './Overlay.module.css';

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  size?: 'modal' | 'wide' | 'full';
  children: ReactNode;
}

/**
 * The one overlay shell mechanic for the Estate — backdrop, Escape-to-
 * close, scroll lock, initial focus. EstateModal, EstateExplorer,
 * EstateDirectory, and FloorPlanViewer all render through this instead
 * of each reimplementing it. Content/header/close-button layout is left
 * to the caller, since a directory row list and a zoomable floor-plan
 * image need different chrome — only the shell mechanics are shared.
 */
export function Overlay({ open, onClose, ariaLabel, size = 'modal', children }: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className={`${styles.panel} ${styles[size]}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
