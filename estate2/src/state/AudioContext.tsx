import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { usePreferences } from './PreferencesContext';

/**
 * One audio surface for the whole Estate. In Estate 1.0, muting the
 * ambience toggle left the background estate-track and any streaming
 * iframe playing — three independent audio sources, one visible mute
 * control. This context is the fix: it sits above the router, so a
 * room profile change on navigation doesn't reset the mute state, and
 * every audio-producing primitive reads `muted` from here rather than
 * keeping its own flag.
 */
interface AudioState {
  currentProfile: string | null;
  setProfile: (profile: string | null) => void;
  muted: boolean;
  toggleMuted: () => void;
}

const AudioContext = createContext<AudioState | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const { audioEnabled, setAudioEnabled } = usePreferences();
  const [currentProfile, setCurrentProfile] = useState<string | null>(null);

  const value = useMemo<AudioState>(
    () => ({
      currentProfile,
      setProfile: setCurrentProfile,
      muted: !audioEnabled,
      toggleMuted: () => setAudioEnabled(!audioEnabled),
    }),
    [currentProfile, audioEnabled, setAudioEnabled]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio(): AudioState {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
