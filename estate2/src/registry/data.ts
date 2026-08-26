import type { Destination } from './types';

/**
 * Foundation-phase Registry data. This is deliberately NOT District II —
 * per the architecture spec, no real district content migrates until the
 * foundation itself has tests and passes its acceptance criteria. These
 * are synthetic destinations whose only job is to prove the shell can
 * render, navigate, and persist state from Registry configuration alone.
 */
export const REGISTRY: Destination[] = [
  {
    id: 'estate-hall',
    canonicalName: 'The Grand Hall',
    displayName: 'The Estate',
    district: 'I',
    wing: null,
    route: '/',
    type: 'hub',
    status: 'live',
    parent: null,
    adjacentDestinations: ['dummy-room'],
    explorerVisibility: true,
    globalNavVisibility: true,
    directoryVisibility: false,
    floorPlanRef: null,
    backgroundAsset: null,
    audioProfile: 'hall',
    capabilities: [],
    hotspots: [],
    secretTrigger: null,
  },
  {
    id: 'dummy-room',
    canonicalName: 'Foundation Proof Chamber',
    displayName: 'Dummy Room',
    district: 'II',
    wing: 'Foundation Wing',
    route: '/foundation/dummy-room',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['estate-hall', 'dummy-room-annex'],
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'foundation-proof', marker: { x: 0.3, y: 0.45 } },
    backgroundAsset: '/placeholder-dummy-room.svg',
    audioProfile: 'foundation-hum',
    capabilities: ['media', 'directory', 'floorplan'],
    hotspots: [
      {
        targetId: 'dummy-room-annex',
        shape: 'rect',
        coords: { left: 70, top: 68.9, width: 22.5, height: 20 },
        label: 'The Annex',
      },
      {
        targetId: '__modal-proof__',
        shape: 'rect',
        coords: { left: 7.5, top: 24.4, width: 21.25, height: 17.8 },
        label: 'Open a shared modal',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'dummy-room-annex',
    canonicalName: 'Foundation Proof Chamber — Annex',
    displayName: 'Dummy Room — Annex',
    district: 'II',
    wing: 'Foundation Wing',
    route: '/foundation/dummy-room-annex',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['dummy-room'],
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'foundation-proof', marker: { x: 0.62, y: 0.45 } },
    backgroundAsset: '/placeholder-dummy-annex.svg',
    audioProfile: 'foundation-hum',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        targetId: 'dummy-room',
        shape: 'rect',
        coords: { left: 7.5, top: 68.9, width: 22.5, height: 20 },
        label: 'Dummy Room',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'dummy-secret',
    canonicalName: 'Unrecorded Chamber',
    displayName: '???',
    district: 'II',
    wing: 'Foundation Wing',
    route: '/foundation/secret',
    type: 'secret',
    status: 'secret',
    parent: null,
    adjacentDestinations: [],
    explorerVisibility: false,
    globalNavVisibility: false,
    directoryVisibility: false,
    floorPlanRef: null,
    backgroundAsset: null,
    audioProfile: null,
    capabilities: [],
    hotspots: [],
    secretTrigger: 'triple-click-annex-title',
  },
];

export function getDestination(id: string): Destination | undefined {
  return REGISTRY.find((d) => d.id === id);
}

export function getDestinationByRoute(route: string): Destination | undefined {
  return REGISTRY.find((d) => d.route === route);
}
