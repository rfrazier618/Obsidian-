import { useEffect, useRef, type ReactNode } from 'react';
import styles from './Overlay.module.css';

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  size?: 'modal' | 'wide' | 'full';
  children: ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The one overlay shell mechanic for the Estate — backdrop, Escape-to-
 * close, scroll lock, initial focus, a real focus trap, and focus
 * restoration on close. EstateModal, EstateExplorer, EstateDirectory,
 * FloorPlanViewer, and ThresholdKeypad all render through this instead
 * of each reimplementing it — so the hardening-pass fix here closes the
 * audit's P0 (no focus trap: Tab escaped an "open," aria-modal="true"
 * dialog into the page behind it) everywhere at once, not room by room.
 * Content/header/close-button layout is left to the caller, since a
 * directory row list and a zoomable floor-plan image need different
 * chrome — only the shell mechanics are shared.
 */
export function Overlay({ open, onClose, ariaLabel, size = 'modal', children }: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;

      // No visibility filtering beyond the selector itself: everything
      // Overlay renders is visible whenever `open` is true (there's no
      // internally-hidden content to skip), and `offsetParent` — the
      // usual way to check that — is unreliable here: it's also null for
      // any real `position: fixed` descendant, and jsdom never computes
      // it at all, which silently emptied this list under test.
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeIsInside = panelRef.current.contains(document.activeElement);

      if (e.shiftKey) {
        if (!activeIsInside || document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (!activeIsInside || document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      // ARIA APG dialog pattern: return focus to whatever opened this
      // overlay, if it's still attached to the document — it may not be,
      // if closing coincided with a navigation that unmounted it.
      const toRestore = previouslyFocused.current;
      if (toRestore && document.contains(toRestore)) {
        toRestore.focus();
      }
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
