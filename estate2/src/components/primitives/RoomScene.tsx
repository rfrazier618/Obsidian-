import { useEffect, useState } from 'react';
import type { Destination, HotspotAction } from '@/registry/types';
import { REGISTRY, FLOOR_PLAN_SHEETS } from '@/registry/data';
import { HotspotLayer } from './HotspotLayer';
import { EstateDirectory } from './EstateDirectory';
import { FloorPlanViewer, type FloorPlanMarker } from './FloorPlanViewer';
import { ThresholdKeypad } from './ThresholdKeypad';
import { useAudio } from '@/state/AudioContext';
import { useOverlay } from '@/state/OverlayContext';
import { useEstateNavigation } from '@/state/useEstateNavigation';
import { useAdjacentPrefetch } from '@/state/useAdjacentPrefetch';
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
 * rooms" guarantee from the Architecture Spec.
 */
export function RoomScene({ destination }: RoomSceneProps) {
  const { navigateTo } = useEstateNavigation();
  const { openModal, showToast } = useOverlay();
  const { setProfile } = useAudio();
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [floorPlanOpen, setFloorPlanOpen] = useState(false);
  const [thresholdOpen, setThresholdOpen] = useState(false);

  useEffect(() => {
    setProfile(destination.audioProfile);
    return () => setProfile(null);
  }, [destination.audioProfile, setProfile]);

  useAdjacentPrefetch(destination);

  // Panels reset to closed whenever the mounted destination changes —
  // belt-and-suspenders on top of the unmount-on-navigate guarantee,
  // since React may reuse this component instance across routes.
  useEffect(() => {
    setDirectoryOpen(false);
    setFloorPlanOpen(false);
    setThresholdOpen(false);
  }, [destination.id]);

  const sheet = destination.floorPlanRef ? FLOOR_PLAN_SHEETS[destination.floorPlanRef.sheet] : null;
  const markers: FloorPlanMarker[] = destination.floorPlanRef
    ? REGISTRY.filter((d) => d.floorPlanRef?.sheet === destination.floorPlanRef!.sheet).map((d) => ({
        destinationId: d.id,
        label: d.displayName,
        coordinates: d.floorPlanRef!.marker,
      }))
    : [];

  /**
   * The generic hotspot dispatcher — one switch, four action kinds,
   * zero per-room branching. This is what lets 18 District II rooms'
   * worth of SA_PANELS-style "hotspot opens an info panel" behavior
   * become Registry data instead of 18 more hand-written components.
   */
  const handleHotspotAction = (action: HotspotAction) => {
    switch (action.kind) {
      case 'navigate':
        navigateTo(action.targetId);
        return;
      case 'toast':
        showToast(action.message);
        return;
      case 'panel':
        openModal({
          id: `panel-${action.title}`,
          title: action.title,
          body: <div dangerouslySetInnerHTML={{ __html: action.body }} />,
        });
        return;
      case 'capability':
        activateCapability(action.capability);
        return;
    }
  };

  const activateCapability = (capability: string) => {
    if (capability === 'directory') setDirectoryOpen(true);
    else if (capability === 'floorplan') setFloorPlanOpen(true);
    else if (capability === 'threshold') setThresholdOpen(true);
    else if (capability === 'media') {
      openModal({
        id: 'media-proof',
        title: 'Shared Modal',
        body: (
          <p>
            This is the one EstateModal instance for the whole Estate, opened from a room's
            <code> media</code> capability — not a per-room modal implementation.
          </p>
        ),
      });
    }
  };

  return (
    <div className={styles.room}>
      <header className={styles.nav}>
        <button
          className={styles.back}
          onClick={() => navigateTo(destination.backTarget ?? 'estate-hall')}
        >
          &larr; {destination.backTarget ? REGISTRY.find((d) => d.id === destination.backTarget)?.displayName : 'The Estate'}
        </button>
        <h1 className={styles.title}>
          {destination.reference && <span className={styles.reference}>{destination.reference}</span>}
          {destination.displayName}
        </h1>
        <span className={styles.district}>District {destination.district}</span>
      </header>

      {destination.backgroundAsset ? (
        <HotspotLayer
          backgroundAsset={destination.backgroundAsset}
          alt={destination.displayName}
          hotspots={destination.hotspots}
          onActivate={handleHotspotAction}
        />
      ) : (
        <div className={styles.noAsset}>No background asset configured for this destination.</div>
      )}

      <div className={styles.actions}>
        {destination.capabilities.includes('media') && (
          <button className={styles.actionBtn} onClick={() => activateCapability('media')}>
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
        {destination.capabilities.includes('threshold') && destination.thresholdConfig && (
          <button className={styles.actionBtn} onClick={() => setThresholdOpen(true)}>
            {destination.thresholdConfig.eyebrow}
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

      {destination.thresholdConfig && (
        <ThresholdKeypad
          open={thresholdOpen}
          onClose={() => setThresholdOpen(false)}
          config={destination.thresholdConfig}
          onComplete={navigateTo}
        />
      )}
    </div>
  );
}
