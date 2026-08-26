/**
 * Edge → transitionProfile. Sound Lock is the first case, but this is
 * deliberately NOT "Sound Lock logic" — it's a general rule that any
 * navigation edge between two destinations can carry a transition, keyed
 * by the unordered pair of destination ids so it applies identically in
 * both directions without either room's component knowing it exists.
 *
 * This is the direct fix for the legacy implementation, where Sound Lock
 * only played if a hotspot specifically called saGoToStudio() instead of
 * the normal navigation function — a convention easy to forget and
 * impossible to enforce. Here, ANY path between control-room and
 * studio-a (a hotspot, the back button, Directory, a future search
 * result) gets the transition automatically, because it's a property of
 * the edge, not of how navigation was triggered.
 */

export interface TransitionProfile {
  id: string;
  durationMs: number;
  label: string;
}

export const TRANSITION_PROFILES: Record<string, TransitionProfile> = {
  'sound-lock': {
    id: 'sound-lock',
    durationMs: 1400,
    label: 'Passing through the Sound Lock…',
  },
};

function edgeKey(a: string, b: string): string {
  return [a, b].sort().join('::');
}

/** Scoped only to Control Room ⇄ Studio A, per canon, unless a future
 *  destination is confirmed to share a real acoustic sound lock. */
const EDGE_TRANSITIONS: Record<string, string> = {
  [edgeKey('control-room', 'studio-a')]: 'sound-lock',
};

export function getEdgeTransition(fromId: string, toId: string): TransitionProfile | null {
  const profileId = EDGE_TRANSITIONS[edgeKey(fromId, toId)];
  return profileId ? TRANSITION_PROFILES[profileId] : null;
}
