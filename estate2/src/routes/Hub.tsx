import { useEstateNavigation } from '@/state/useEstateNavigation';

/**
 * estate-hall's own screen — a hub, not a room, so it doesn't route
 * through RoomScene/HotspotLayer. Its only job here is to prove
 * navigateTo() reaches a real Registry destination from a plain button.
 */
export function Hub() {
  const { navigateTo } = useEstateNavigation();
  return (
    <div style={{ padding: '60px clamp(20px,4vw,56px)', maxWidth: 720 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 28, margin: 0, color: 'var(--cream)' }}>
        Estate 2.0 — Foundation
      </h1>
      <p style={{ color: 'var(--cream-dim)', fontSize: 14, lineHeight: 1.7 }}>
        This is the hub destination (<code>estate-hall</code>), rendered from the same Registry as
        everything else. Use Global Navigation, Explore, or the button below — all three resolve
        the same destination id.
      </p>
      <button
        onClick={() => navigateTo('room-a')}
        style={{
          background: 'none',
          border: '1px solid var(--gold-dim)',
          color: 'var(--gold)',
          padding: '10px 20px',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 13,
        }}
      >
        Enter Room A &rarr;
      </button>
    </div>
  );
}
