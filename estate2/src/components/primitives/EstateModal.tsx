import { useEffect, useRef } from 'react';
import { useOverlay } from '@/state/OverlayContext';
import styles from './EstateModal.module.css';

/**
 * The one modal/overlay system for the Estate — replaces Estate 1.0's
 * 9 hand-written open/close pairs. Handles focus, Escape-to-close, and
 * scroll lock exactly once, here, instead of once per lounge.
 */
export function EstateModal() {
  const { modal, closeModal } = useOverlay();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!modal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [modal, closeModal]);

  if (!modal) return null;

  return (
    <div className={styles.backdrop} role="presentation" onClick={closeModal}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="estate-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="estate-modal-title" className={styles.title}>
            {modal.title}
          </h2>
          <button ref={closeBtnRef} className={styles.close} onClick={closeModal} aria-label="Close">
            &times;
          </button>
        </div>
        <div className={styles.body}>{modal.body}</div>
      </div>
    </div>
  );
}
