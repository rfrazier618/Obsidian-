import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { TransitionProfile } from '@/registry/transitions';

/**
 * The TransitionManager primitive named in the Architecture Spec —
 * "room fade, Sound Lock, hallway-walk, one engine, configured per room
 * instead of reimplemented." Owns exactly one piece of state: which
 * transition profile (if any) is currently playing. useEstateNavigation
 * is the only caller of `play()` — it decides WHEN a transition runs
 * (by looking up the navigation edge), this just knows HOW to run one.
 */
interface TransitionState {
  active: TransitionProfile | null;
  play: (profile: TransitionProfile) => Promise<void>;
}

const TransitionContext = createContext<TransitionState | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<TransitionProfile | null>(null);

  const play = useCallback((profile: TransitionProfile) => {
    setActive(profile);
    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setActive(null);
        resolve();
      }, profile.durationMs);
    });
  }, []);

  const value = useMemo<TransitionState>(() => ({ active, play }), [active, play]);

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
}

export function useTransition(): TransitionState {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('useTransition must be used within TransitionProvider');
  return ctx;
}
