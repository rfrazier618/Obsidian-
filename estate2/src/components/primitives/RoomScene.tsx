import { useEffect } from 'react';
import type { Destination } from '@/registry/types';
import { HotspotLayer } from './HotspotLayer';
import { useAudio } from '@/state/AudioContext';
import { useOverlay } from '@/state/OverlayContext';
import { useEstateNavigation } from '@/state/useEstateNavigation';
import styles from './RoomScene.module.css';

interface RoomSceneProps {
  destination: Destination;
}

/**
 * The outer shell every room mounts into. Takes nothing but a
 * Destination — no room-specific component, no hardcoded background,
 * no hand-written hotspot markup. This is the concrete proof that the
 * shell renders from Registry configuration alone: swap the `destination`
 * prop for a different Registry entry and the room changes completely
 * with zero code changes.
 *
 * Room/session state (which panels are open, any per-room ephemeral UI)
 * lives here as local component state — it's naturally torn down when
 * React unmounts this component on navigation, which is exactly the
 * "no leaked state between rooms" guarantee from the Architecture Spec.
 */
export function RoomScene({ destination }: RoomSceneProps) {
  const { navigateTo } = useEstateNavigation();
  const { setProfile } = useAudio();
  const { openModal } = useOverlay();

  useEffect(() => {
    setProfile(destination.audioProfile);
    return () => setProfile(null);
  }, [destination.audioProfile, setProfile]);

  const handleActivate = (targetId: string) => {
    if (targetId === '__modal-proof__') {
      openModal({
        id: 'modal-proof',
        title: 'Shared Modal',
        body: (
          <p>
            This is the one EstateModal instance for the whole Estate — opened from a hotspot
            declared entirely in the Registry, with no per-room modal implementation behind it.
          </p>
        ),
      });
      return;
    }
    navigateTo(targetId);
  };

  return (
    <div className={styles.room}>
      <header className={styles.nav}>
        <button className={styles.back} onClick={() => navigateTo('estate-hall')}>
          &larr; The Estate
        </button>
        <span className={styles.title}>{destination.displayName}</span>
        <span className={styles.district}>District {destination.district}</span>
      </header>

      {destination.backgroundAsset ? (
        <HotspotLayer
          backgroundAsset={destination.backgroundAsset}
          alt={destination.displayName}
          hotspots={destination.hotspots}
          onActivate={handleActivate}
        />
      ) : (
        <div className={styles.noAsset}>No background asset configured for this destination.</div>
      )}

      <div className={styles.meta}>
        <span>id: {destination.id}</span>
        <span>route: {destination.route}</span>
        <span>capabilities: {destination.capabilities.join(', ') || 'none'}</span>
      </div>
    </div>
  );
}
