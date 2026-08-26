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
  | 'audio-profile'
  /** Added during the D2 reference migration — an access-code interaction
   *  gating entry to another destination. See ThresholdConfig below. */
  | 'threshold';

/**
 * A hotspot's behavior, extracted from the D2 reference migration where
 * a single room's hotspots turned out to need three distinct behaviors
 * (Reception alone has all three) — generalized as reusable action kinds
 * rather than one-off onClick handlers per room:
 *  - navigate: go to another destination (through the edge-transition
 *    system — see registry/transitions.ts — so Sound Lock-style effects
 *    apply by construction, not by each hotspot remembering to ask for one)
 *  - toast: informational only, no destination exists yet or ever will
 *  - panel: opens the one shared EstateModal with static title/body
 *    content — the direct replacement for the legacy SA_PANELS pattern
 *    used by all 18 District II rooms
 *  - capability: triggers a named capability's local overlay on the
 *    CURRENT destination (directory / floorplan / threshold), for
 *    hotspots baked into a render rather than the fallback action row
 */
export type HotspotAction =
  | { kind: 'navigate'; targetId: string }
  | { kind: 'toast'; message: string }
  | { kind: 'panel'; title: string; body: string }
  | { kind: 'capability'; capability: Capability };

/** A single tappable/clickable region layered over a room's rendered image. */
export interface Hotspot {
  action: HotspotAction;
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

/** Config for a destination with the 'threshold' capability — an
 *  access-code interaction that, on completion, navigates to targetId. */
export interface ThresholdConfig {
  targetId: string;
  eyebrow: string;
  motto: string;
}

export interface Destination {
  /** Stable forever. Never reused, even after a destination retires. */
  id: string;
  /** The name of record per architectural canon (A-202 etc.). */
  canonicalName: string;
  /** UI copy. May differ from canonicalName on purpose — but this is the
   *  only field any renderer is allowed to display. */
  displayName: string;
  /** Canon room number, e.g. "II-201" — shown in Directory rows and room
   *  nav. Added during the D2 migration; absent for non-numbered destinations. */
  reference?: string;
  district: District;
  wing: string | null;
  /** Route segment. Null for destinations that are registered (for Directory/
   *  canon completeness) but are never their own navigable page — e.g. a
   *  threshold gate or a reveal-only hotspot target. */
  route: string | null;
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
  /** Explicit back-navigation target for this destination's room-nav back
   *  button. Not assumed to be the Estate hub — Control Room backs to
   *  Reception, Studio A backs to Control Room, etc. Null only for hubs. */
  backTarget: string | null;
  explorerVisibility: boolean;
  globalNavVisibility: boolean;
  directoryVisibility: boolean;
  floorPlanRef: FloorPlanRef | null;
  backgroundAsset: string | null;
  audioProfile: string | null;
  capabilities: Capability[];
  /** Required and used only when capabilities includes 'threshold'. */
  thresholdConfig?: ThresholdConfig | null;
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
