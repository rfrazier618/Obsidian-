import type { Destination } from './types';

/**
 * Foundation-phase Registry data — a miniature fake district (Room A/B/C,
 * plus a deliberately unbuilt Room D and a secret) standing in for real
 * District II content until the reference migration begins. Every
 * primitive (RoomScene, HotspotLayer, EstateExplorer, EstateDirectory,
 * FloorPlanViewer) is proven against this fixture before a single line
 * of real D2 content moves.
 *
 * The flow this fixture is built to exercise:
 *   Global Nav → Explorer → Room A → hotspot → Room B →
 *   Directory → Room C → Floor Plan → close → history back
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
    adjacentDestinations: ['room-a'],
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
    id: 'room-a',
    canonicalName: 'Foundation Fixture — Room A',
    displayName: 'Room A',
    district: 'II',
    wing: 'Foundation Wing',
    route: '/foundation/room-a',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['estate-hall', 'room-b'],
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'foundation-fixture', marker: { x: 0.207, y: 0.322 } },
    backgroundAsset: '/placeholder-room-a.svg',
    audioProfile: 'foundation-hum',
    capabilities: ['media'],
    hotspots: [
      {
        targetId: 'room-b',
        shape: 'rect',
        coords: { left: 70, top: 68.9, width: 22.5, height: 20 },
        label: 'Room B',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'room-b',
    canonicalName: 'Foundation Fixture — Room B',
    displayName: 'Room B',
    district: 'II',
    wing: 'Foundation Wing',
    route: '/foundation/room-b',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['room-a'],
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'foundation-fixture', marker: { x: 0.5, y: 0.322 } },
    backgroundAsset: '/placeholder-room-b.svg',
    audioProfile: 'foundation-hum',
    capabilities: ['directory'],
    hotspots: [
      {
        targetId: 'room-a',
        shape: 'rect',
        coords: { left: 7.5, top: 68.9, width: 22.5, height: 20 },
        label: 'Room A',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'room-c',
    canonicalName: 'Foundation Fixture — Room C',
    displayName: 'Room C',
    district: 'II',
    wing: 'Foundation Wing',
    route: '/foundation/room-c',
    type: 'room',
    status: 'live',
    parent: null,
    // Reachable only via the Directory from Room B — no direct hotspot.
    // This is intentional: it's what proves Directory is real navigation,
    // not just a display of destinations already reachable another way.
    adjacentDestinations: ['room-b'],
    explorerVisibility: false,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'foundation-fixture', marker: { x: 0.793, y: 0.322 } },
    backgroundAsset: '/placeholder-room-c.svg',
    audioProfile: 'foundation-hum',
    capabilities: ['floorplan'],
    hotspots: [],
    secretTrigger: null,
  },
  {
    id: 'room-d',
    canonicalName: 'Foundation Fixture — Room D',
    displayName: 'Room D',
    district: 'II',
    wing: 'Foundation Wing',
    route: '/foundation/room-d',
    type: 'room',
    // Registered in canon, not built yet — proves the Directory's
    // "visible but not falsely navigable" state, and that a planned
    // destination correctly does NOT count toward reachability.
    status: 'planned',
    parent: null,
    adjacentDestinations: [],
    explorerVisibility: false,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'foundation-fixture', marker: { x: 0.5, y: 0.72 } },
    backgroundAsset: null,
    audioProfile: null,
    capabilities: [],
    hotspots: [],
    secretTrigger: null,
  },
  {
    id: 'fixture-secret',
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
    secretTrigger: 'triple-click-room-c-title',
  },
];

/**
 * Floor-plan sheet metadata — deliberately NOT part of Destination.
 * Multiple destinations share one physical plan image/reference, so
 * this is keyed by sheet id, not duplicated onto every room that
 * appears on it. Still lives in this one file, next to the registry
 * it describes — not a second independent dataset.
 */
export const FLOOR_PLAN_SHEETS: Record<
  string,
  { asset: string; reference: string; canonNotice?: string }
> = {
  'foundation-fixture': {
    asset: '/placeholder-floorplan.svg',
    reference: 'FF-01 · Foundation Fixture',
    canonNotice: 'Internal labeling on this plan is non-canon — provided for wayfinding only.',
  },
};

export function getDestination(id: string): Destination | undefined {
  return REGISTRY.find((d) => d.id === id);
}

export function getDestinationByRoute(route: string): Destination | undefined {
  return REGISTRY.find((d) => d.route === route);
}
