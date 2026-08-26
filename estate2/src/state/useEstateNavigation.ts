import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDestination, getDestinationByRoute, REGISTRY } from '@/registry/data';
import type { Destination } from '@/registry/types';

/**
 * The single chokepoint every navigation surface calls through — Global
 * Navigation, Estate Explorer, and contextual hotspots all resolve a
 * destination id via this hook, never a route string they constructed
 * themselves. This is also where a future TransitionManager (room fade,
 * Sound Lock, hallway-walk) hooks in without any of the three nav layers
 * needing to know it exists.
 */
export function useEstateNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const current: Destination | undefined = getDestinationByRoute(location.pathname);

  const navigateTo = useCallback(
    (id: string) => {
      const dest = getDestination(id);
      if (!dest) {
        console.warn(`[estate-nav] Unknown destination id: "${id}" — registry has no such entry.`);
        return;
      }
      navigate(dest.route);
    },
    [navigate]
  );

  return { current, navigateTo, registry: REGISTRY };
}
