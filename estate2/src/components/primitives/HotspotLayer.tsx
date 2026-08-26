import type { Hotspot, HotspotAction } from '@/registry/types';
import styles from './HotspotLayer.module.css';

interface HotspotLayerProps {
  backgroundAsset: string;
  alt: string;
  hotspots: Hotspot[];
  onActivate: (action: HotspotAction) => void;
}

/**
 * Renders a room's background image with its hotspots positioned in
 * percentages against the image's own rendered box — never the
 * viewport, never a hardcoded reference resolution. The wrapper is
 * `position: relative` around an `<img style="width:100%">`; because
 * the image scales to its container while keeping its intrinsic aspect
 * ratio, a hotspot at `left: 70%, top: 68.9%` lands on the same visual
 * point on the render whether the room is 1600px wide or 320px wide.
 * Source render dimensions never need to be assumed anywhere in this
 * component — they're read from the image itself at layout time.
 *
 * A hotspot's action (navigate/toast/panel/capability) is opaque to
 * this component — it just reports which action fired. RoomScene owns
 * the dispatch, so HotspotLayer never grows room-specific logic.
 *
 * Each hotspot also gets a minimum touch-target size independent of its
 * visual rect, so a small baked-in render button still resolves to a
 * comfortably tappable area on mobile — the direct fix for the Estate
 * 1.0 regression where hotspots were hidden entirely below 720px.
 */
export function HotspotLayer({ backgroundAsset, alt, hotspots, onActivate }: HotspotLayerProps) {
  return (
    <div className={styles.wrap}>
      <img src={backgroundAsset} alt={alt} className={styles.image} />
      {hotspots.map((h, i) => (
        <button
          key={i}
          type="button"
          className={styles.hotspot}
          style={{
            left: `${h.coords.left}%`,
            top: `${h.coords.top}%`,
            width: `${h.coords.width}%`,
            height: `${h.coords.height}%`,
          }}
          onClick={() => onActivate(h.action)}
          aria-label={h.label}
          title={h.label}
        />
      ))}
    </div>
  );
}
