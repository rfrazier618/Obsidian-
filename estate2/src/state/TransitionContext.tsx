import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { TransitionProfile } from '@/registry/transitions';
import { usePreferences } from './PreferencesContext';

/**
 * Below this, a transition reads as an instant cut rather than a jarring
 * non-animation — short enough to respect prefers-reduced-motion, long
 * enough that the state change (and TransitionOverlay's aria-live
 * announcement) is still perceptible rather than invisible.
 */
const REDUCED_MOTION_DURATION_MS = 150;

/**
 * The TransitionManager primitive named in the Architecture Spec —
 * "room fade, Sound Lock, hallway-walk, one engine, configured per room
 * instead of reimplemented." Owns exactly one piece of state: which
 * transition profile (if any) is currently playing. useEstateNavigation
 * is the only caller of `play()` — it decides WHEN a transition runs
 * (by looking up the navigation edge), this just knows HOW to run one.
 *
 * Hardening pass: `play()` honors prefers-reduced-motion by shortening
 * the wait to a near-instant duration rather than skipping it — the
 * logical sequence (transition plays, blocks navigation, then resolves)
 * stays exactly as tested; only the visual/perceived duration changes.
 * Confirmed by the audit that CSS alone doesn't cover this — Sound
 * Lock's duration is driven by this timer, not by any animation length.
 */
interface TransitionState {
  active: TransitionProfile | null;
  play: (profile: TransitionProfile) => Promise<void>;
}

const TransitionContext = createContext<TransitionState | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<TransitionProfile | null>(null);
  const { prefersReducedMotion } = usePreferences();

  const play = useCallback(
    (profile: TransitionProfile) => {
      setActive(profile);
      const duration = prefersReducedMotion ? REDUCED_MOTION_DURATION_MS : profile.durationMs;
      return new Promise<void>((resolve) => {
        window.setTimeout(() => {
          setActive(null);
          resolve();
        }, duration);
      });
    },
    [prefersReducedMotion]
  );

  const value = useMemo<TransitionState>(() => ({ active, play }), [active, play]);

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
}

export function useTransition(): TransitionState {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('useTransition must be used within TransitionProvider');
  return ctx;
}
