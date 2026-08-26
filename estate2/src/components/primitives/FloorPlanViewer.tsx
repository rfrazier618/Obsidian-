import { useState } from 'react';
import { Overlay } from './Overlay';
import styles from './FloorPlanViewer.module.css';

/**
 * A marker's position on the plan, in percentages against the plan
 * image's own box — the same coordinate philosophy as HotspotLayer, so
 * a future interactive version doesn't need a different geometry
 * system, just a click handler.
 */
export interface FloorPlanMarker {
  destinationId: string;
  label: string;
  coordinates: { x: number; y: number };
}

interface FloorPlanViewerProps {
  open: boolean;
  onClose: () => void;
  planAsset: string;
  reference: string;
  /** e.g. "Internal labeling is non-canon; room numbers are for wayfinding only." */
  canonNotice?: string;
  /**
   * Accepted now so the v2 upgrade (markers[] → destinationId →
   * coordinates → Registry navigation) is additive, not a rewrite.
   * v1 renders them as inert reference points — intentionally not
   * interactive yet, per the restrained-v1 scope.
   */
  markers?: FloorPlanMarker[];
  /** Required once markers become clickable in v2; unused by v1's rendering. */
  onNavigate?: (id: string) => void;
}

const ZOOM_STEPS = [1, 1.5, 2, 2.75] as const;

/**
 * V1, deliberately restrained: a correct plan image, its canon
 * reference, a non-canon notice where the plan's internal labeling
 * isn't authoritative, and zoom/pan via native scroll rather than a
 * gesture library. No interactive markers yet — the props exist so
 * that becomes an additive change, not a second component.
 */
export function FloorPlanViewer({
  open,
  onClose,
  planAsset,
  reference,
  canonNotice,
  markers = [],
}: FloorPlanViewerProps) {
  const [zoomIndex, setZoomIndex] = useState(0);
  const zoom = ZOOM_STEPS[zoomIndex];

  return (
    <Overlay open={open} onClose={onClose} ariaLabel={`Floor Plan — ${reference}`} size="full">
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Floor Plan</h2>
          <span className={styles.reference}>{reference}</span>
        </div>
        <div className={styles.controls}>
          <button
            className={styles.zoomBtn}
            onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
            disabled={zoomIndex === 0}
            aria-label="Zoom out"
          >
            &minus;
          </button>
          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
          <button
            className={styles.zoomBtn}
            onClick={() => setZoomIndex((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))}
            disabled={zoomIndex === ZOOM_STEPS.length - 1}
            aria-label="Zoom in"
          >
            +
          </button>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
      </div>

      {canonNotice && <p className={styles.notice}>{canonNotice}</p>}

      <div className={styles.viewport}>
        <div className={styles.planWrap} style={{ width: `${zoom * 100}%` }}>
          <img src={planAsset} alt={`Floor plan — ${reference}`} className={styles.planImage} />
          {markers.map((m) => (
            <span
              key={m.destinationId}
              className={styles.marker}
              style={{ left: `${m.coordinates.x * 100}%`, top: `${m.coordinates.y * 100}%` }}
              title={m.label}
            />
          ))}
        </div>
      </div>
    </Overlay>
  );
}
