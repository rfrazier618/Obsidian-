import { useState } from 'react';
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
 *
 * Image loading strategy: exactly one room is ever mounted at a time
 * (App.tsx routes to a single RoomScene per URL), so this is always the
 * one background image the visitor is actually looking at — it loads
 * eager/high-priority, never `loading="lazy"`, which would only be
 * correct for an image that might be off-screen. Neighboring rooms'
 * images are prefetched separately, from RoomScene — see its own
 * comment for why that's a room-scoped concern, not this component's.
 *
 * Hardening pass: a failed image no longer takes its hotspots down with
 * it. `HotspotLayer` previously sized its wrapper entirely off the
 * image's own rendered box, so a 404 collapsed the box to the browser's
 * tiny broken-image glyph and silently made every hotspot in the room
 * unreachable. On error, the wrapper switches to a fixed-aspect
 * fallback box instead — the room stays navigable via its own hotspots,
 * not just via the Directory/Floor Plan/back-button escape hatch.
 */
export function HotspotLayer({ backgroundAsset, alt, hotspots, onActivate }: HotspotLayerProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={imageFailed ? `${styles.wrap} ${styles.wrapError}` : styles.wrap}>
      <img
        src={backgroundAsset}
        alt={alt}
        className={styles.image}
        loading="eager"
        // @ts-expect-error -- fetchpriority isn't in this TS lib's JSX types yet, but is a real, supported HTML attribute.
        fetchpriority="high"
        onError={() => setImageFailed(true)}
        onLoad={() => setImageFailed(false)}
      />
      {imageFailed && (
        <p className={styles.fallback} role="status">
          This room's image is temporarily unavailable. Navigation below still works.
        </p>
      )}
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
