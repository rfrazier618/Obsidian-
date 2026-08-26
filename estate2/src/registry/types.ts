/**
 * The Estate Registry — the single typed source of truth for every
 * destination in the Obsidian Estate. Global Navigation, Estate Explorer,
 * contextual room navigation, directories, and the floor plan all read
 * from this shape and this shape only. Nothing renders a destination
 * name, route, or adjacency list from anywhere else.
 *
 * This is the runtime representation of canon (A-202 etc.), not a
 * second opinion on it — canon stays the authority; this is how the
 * app knows what canon says.
 */

export type District = 'I' | 'II' | 'III' | 'IV';

export type DestinationType = 'room' | 'hub' | 'sub-screen' | 'overlay' | 'secret';

export type DestinationStatus = 'live' | 'planned' | 'secret' | 'retired';

export type Capability =
  | 'ordering'
  | 'media'
  | 'ai-content'
  | 'directory'
  | 'floorplan'
  | 'audio-profile';

/** A single tappable/clickable region layered over a room's rendered image. */
export interface Hotspot {
  /** Destination id this hotspot navigates to. */
  targetId: string;
  shape: 'rect';
  /**
   * Percentage coordinates against the room's own rendered image box —
   * never the viewport. This is the pattern already proven in the
   * Estate 1.0 arrival-sequence rooms (Library/Atrium/Onyx), generalized
   * here so every room gets it, not just the newest three.
   */
  coords: { left: number; top: number; width: number; height: number };
  label: string;
}

/** Where a destination's marker lives on the (initially static) floor plan. */
export interface FloorPlanRef {
  sheet: string;
  marker: { x: number; y: number };
}

export interface Destination {
  /** Stable forever. Never reused, even after a destination retires. */
  id: string;
  /** The name of record per architectural canon (A-202 etc.). */
  canonicalName: string;
  /** UI copy. May differ from canonicalName on purpose — but this is the
   *  only field any renderer is allowed to display. */
  displayName: string;
  district: District;
  wing: string | null;
  /** Route segment — e.g. "/district-ii/mic-vault". Drives direct-link resolution. */
  route: string;
  type: DestinationType;
  status: DestinationStatus;
  /** Parent destination id, for sub-screens nested inside a mega-room (e.g. Gemini). */
  parent: string | null;
  /**
   * CANON-derived adjacency, not build-order-derived. Where a link exists
   * only because rooms were rendered in sequence and never revisited, it
   * does not belong here until checked against canon (see D2 backward-chain
   * finding in the demolition survey).
   */
  adjacentDestinations: string[];
  explorerVisibility: boolean;
  globalNavVisibility: boolean;
  directoryVisibility: boolean;
  floorPlanRef: FloorPlanRef | null;
  backgroundAsset: string | null;
  audioProfile: string | null;
  capabilities: Capability[];
  hotspots: Hotspot[];
  /**
   * Declared trigger for status:'secret' destinations. Secrets are allowed
   * to have no discovery path — but only when that's an explicit, recorded
   * decision, not a silent gap. Required when status === 'secret'.
   */
  secretTrigger: string | null;
}

/** A destination as it should appear in Global Navigation — derived, not stored. */
export type GlobalNavEntry = Pick<Destination, 'id' | 'displayName' | 'route'>;

/** A destination's discovery-path verdict — computed, never persisted.
 *  This is what §08's "every live destination has a valid discovery path"
 *  acceptance test evaluates against. */
export interface DiscoveryVerdict {
  id: string;
  reachable: boolean;
  via: Array<'global-nav' | 'explorer' | 'contextual' | 'secret-exempt'>;
  reason?: string;
}
