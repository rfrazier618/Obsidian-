import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDestination, getDestinationByRoute, REGISTRY } from '@/registry/data';
import { getEdgeTransition } from '@/registry/transitions';
import type { Destination } from '@/registry/types';
import { useTransition } from './TransitionContext';

/**
 * The single chokepoint every navigation surface calls through — Global
 * Navigation, Estate Explorer, contextual hotspots, and Directory all
 * resolve a destination id via this hook, never a route string they
 * constructed themselves.
 *
 * This is also where edge transitions (Sound Lock, etc.) apply — by
 * construction, for every caller, not by each caller remembering to ask
 * for one. Compare the legacy `saGoToStudio()`, which only played Sound
 * Lock if a hotspot specifically called it instead of the normal nav
 * function.
 */
export function useEstateNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { play } = useTransition();

  const current: Destination | undefined = getDestinationByRoute(location.pathname);

  const navigateTo = useCallback(
    async (id: string) => {
      const dest = getDestination(id);
      if (!dest || !dest.route) {
        console.warn(`[estate-nav] Unknown or unroutable destination id: "${id}".`);
        return;
      }
      const profile = current ? getEdgeTransition(current.id, dest.id) : null;
      if (profile) {
        await play(profile);
      }
      navigate(dest.route);
    },
    [navigate, current, play]
  );

  return { current, navigateTo, registry: REGISTRY };
}
