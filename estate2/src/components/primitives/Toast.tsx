import { useOverlay } from '@/state/OverlayContext';
import styles from './Toast.module.css';

/**
 * One toast surface for the Estate — replaces the 7 independent
 * implementations (estateToast, vlToast, cwToast, dwToast, stageToast,
 * peToast, orionToast) found in the demolition survey.
 */
export function ToastStack() {
  const { toasts } = useOverlay();
  if (toasts.length === 0) return null;

  return (
    <div className={styles.stack} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={styles.toast}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
