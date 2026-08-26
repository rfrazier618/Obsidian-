import { useTransition } from '@/state/TransitionContext';
import styles from './TransitionOverlay.module.css';

/**
 * Renders whatever transition profile is currently playing. One
 * component for every configured edge transition — Sound Lock today,
 * anything else tomorrow, without a new component per effect.
 */
export function TransitionOverlay() {
  const { active } = useTransition();
  if (!active) return null;

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <span
        className={styles.text}
        style={{ animationDuration: `${active.durationMs}ms` }}
      >
        {active.label}
      </span>
    </div>
  );
}
