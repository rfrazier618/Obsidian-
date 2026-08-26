import type { ReactNode } from 'react';
import { PreferencesProvider } from './PreferencesContext';
import { AudioProvider } from './AudioContext';
import { OverlayProvider } from './OverlayContext';
import { CommerceProvider } from './CommerceContext';
import { TransitionProvider } from './TransitionContext';

/**
 * Assembles the persistent state domains above the router, so none of
 * them reset on navigation. Room/session state (which panels are open,
 * per-room ephemeral UI) is deliberately NOT a context here: it's owned
 * by each RoomScene instance as local component state, torn down for
 * free when React unmounts the room on navigation. Giving it a global
 * provider would be reintroducing exactly the kind of leaked-state-
 * between-rooms bug this architecture exists to prevent.
 */
export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      <AudioProvider>
        <OverlayProvider>
          <CommerceProvider>
            <TransitionProvider>{children}</TransitionProvider>
          </CommerceProvider>
        </OverlayProvider>
      </AudioProvider>
    </PreferencesProvider>
  );
}
