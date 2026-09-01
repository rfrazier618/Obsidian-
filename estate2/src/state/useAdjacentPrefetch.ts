import { useEffect } from 'react';
import { REGISTRY } from '@/registry/data';
import type { Destination } from '@/registry/types';

/** Module-level, not per-component — a neighbor prefetched from one room stays prefetched for the whole session. */
const prefetched = new Set<string>();

/**
 * Image loading strategy, stated explicitly (per the hardening-pass
 * brief):
 *
 *  - EAGER: exactly the current room's own background asset —
 *    `HotspotLayer` loads it eager/high-priority, because it's always
 *    the one image the visitor is actually looking at.
 *  - PREFETCHED: the current destination's own `adjacentDestinations`
 *    only — a handful of neighbors, never the whole Registry. Fired
 *    from a short timer after mount, so it never competes with the
 *    current room's own image for bandwidth/priority.
 *  - Everything else loads lazily-by-construction: no other room's
 *    <img> exists in the DOM until that room actually mounts, and
 *    overlay-only assets (Floor Plan sheets) don't load until their
 *    overlay opens.
 *
 * This is how the Estate stays cheap at 49+ destinations instead of
 * loading everything at startup: the fetch cost of visiting a room is
 * always O(its own image) now, O(a few neighbors) shortly after, and
 * O(1) forever again once the visitor has actually been there — the
 * module-level `prefetched` set and the browser's own HTTP cache both
 * mean a given room's asset is never requested twice in a session.
 */
export function useAdjacentPrefetch(destination: Destination) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      for (const id of destination.adjacentDestinations) {
        if (prefetched.has(id)) continue;
        const neighbor = REGISTRY.find((d) => d.id === id);
        if (!neighbor?.backgroundAsset) continue;
        prefetched.add(id);
        const img = new Image();
        img.src = neighbor.backgroundAsset;
      }
    }, 200);
    return () => window.clearTimeout(timer);
  }, [destination]);
}
