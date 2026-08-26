import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/**
 * User preferences — the one state domain that outlives a single visit.
 * Persisted to localStorage; everything else in the state tree resets
 * on reload by design (navigation history, open modals, ephemeral cart).
 */
interface PreferencesState {
  audioEnabled: boolean;
  setAudioEnabled: (v: boolean) => void;
  prefersReducedMotion: boolean;
}

const STORAGE_KEY = 'estate2.preferences.audioEnabled';
const PreferencesContext = createContext<PreferencesState | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [audioEnabled, setAudioEnabledState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === 'true';
  });

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(audioEnabled));
  }, [audioEnabled]);

  const value = useMemo<PreferencesState>(
    () => ({ audioEnabled, setAudioEnabled: setAudioEnabledState, prefersReducedMotion }),
    [audioEnabled, prefersReducedMotion]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesState {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
