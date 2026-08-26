import { useEffect, useState } from 'react';
import type { Destination } from '@/registry/types';
import { REGISTRY, FLOOR_PLAN_SHEETS } from '@/registry/data';
import { HotspotLayer } from './HotspotLayer';
import { EstateDirectory } from './EstateDirectory';
import { FloorPlanViewer, type FloorPlanMarker } from './FloorPlanViewer';
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
 * no hand-written hotspot markup. Swap the `destination` prop for a
 * different Registry entry and the room changes completely with zero
 * code changes.
 *
 * Room/session state (which panels are open) lives here as local
 * component state — it's naturally torn down when React unmounts this
 * component on navigation, which is the "no leaked state between
 * rooms" guarantee from the Architecture Spec. Directory and Floor
 * Plan open/closed are exactly that kind of ephemeral, per-room state.
 */
export function RoomScene({ destination }: RoomSceneProps) {
  const { navigateTo } = useEstateNavigation();
  const { setProfile } = useAudio();
  const { openModal } = useOverlay();
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [floorPlanOpen, setFloorPlanOpen] = useState(false);

  useEffect(() => {
    setProfile(destination.audioProfile);
    return () => setProfile(null);
  }, [destination.audioProfile, setProfile]);

  // Panels reset to closed whenever the mounted destination changes —
  // belt-and-suspenders on top of the unmount-on-navigate guarantee,
  // since React may reuse this component instance across routes.
  useEffect(() => {
    setDirectoryOpen(false);
    setFloorPlanOpen(false);
  }, [destination.id]);

  const sheet = destination.floorPlanRef ? FLOOR_PLAN_SHEETS[destination.floorPlanRef.sheet] : null;
  const markers: FloorPlanMarker[] = destination.floorPlanRef
    ? REGISTRY.filter((d) => d.floorPlanRef?.sheet === destination.floorPlanRef!.sheet).map((d) => ({
        destinationId: d.id,
        label: d.displayName,
        coordinates: d.floorPlanRef!.marker,
      }))
    : [];

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
          onActivate={navigateTo}
        />
      ) : (
        <div className={styles.noAsset}>No background asset configured for this destination.</div>
      )}

      <div className={styles.actions}>
        {destination.capabilities.includes('media') && (
          <button
            className={styles.actionBtn}
            onClick={() =>
              openModal({
                id: 'media-proof',
                title: 'Shared Modal',
                body: (
                  <p>
                    This is the one EstateModal instance for the whole Estate, opened from a room's
                    <code> media</code> capability — not a per-room modal implementation.
                  </p>
                ),
              })
            }
          >
            View Media
          </button>
        )}
        {destination.capabilities.includes('directory') && (
          <button className={styles.actionBtn} onClick={() => setDirectoryOpen(true)}>
            Directory
          </button>
        )}
        {destination.capabilities.includes('floorplan') && sheet && (
          <button className={styles.actionBtn} onClick={() => setFloorPlanOpen(true)}>
            Floor Plan
          </button>
        )}
      </div>

      <div className={styles.meta}>
        <span>id: {destination.id}</span>
        <span>route: {destination.route}</span>
        <span>capabilities: {destination.capabilities.join(', ') || 'none'}</span>
      </div>

      <EstateDirectory
        open={directoryOpen}
        onClose={() => setDirectoryOpen(false)}
        district={destination.district}
        currentId={destination.id}
        onNavigate={navigateTo}
      />

      {sheet && (
        <FloorPlanViewer
          open={floorPlanOpen}
          onClose={() => setFloorPlanOpen(false)}
          planAsset={sheet.asset}
          reference={sheet.reference}
          canonNotice={sheet.canonNotice}
          markers={markers}
        />
      )}
    </div>
  );
}
