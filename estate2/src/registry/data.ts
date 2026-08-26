import type { Destination } from './types';

/**
 * The Estate Registry.
 *
 * Two bodies of data live here side by side:
 *  1. The foundation fixture (estate-hall, room-a/b/c/d, fixture-secret)
 *     — kept as living regression-test infrastructure, not deleted now
 *     that Foundation Phase closed. The acceptance-test suite and the
 *     closing integration test both still exercise it.
 *  2. The District II reference-migration slice — Reception, II-110,
 *     Control Room, Studio A — extracted from the legacy index.html,
 *     plus every other A-202 Rev. 4 room as a status:'planned' or
 *     reference-only stub. Those stubs exist ONLY so the District II
 *     Directory is complete and honest; they carry no content, no
 *     background asset, no interactivity, and are NOT a migration of
 *     those rooms — see the closing report.
 */
export const REGISTRY: Destination[] = [
  // ═══════════════════ FOUNDATION FIXTURE ═══════════════════
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
    adjacentDestinations: ['room-a', 'depmg'],
    backTarget: null,
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
    district: 'I',
    wing: 'Foundation Wing',
    route: '/foundation/room-a',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['estate-hall', 'room-b'],
    backTarget: 'estate-hall',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'foundation-fixture', marker: { x: 0.207, y: 0.322 } },
    backgroundAsset: '/placeholder-room-a.svg',
    audioProfile: 'foundation-hum',
    capabilities: ['media'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'room-b' },
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
    district: 'I',
    wing: 'Foundation Wing',
    route: '/foundation/room-b',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['room-a'],
    backTarget: 'estate-hall',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'foundation-fixture', marker: { x: 0.5, y: 0.322 } },
    backgroundAsset: '/placeholder-room-b.svg',
    audioProfile: 'foundation-hum',
    capabilities: ['directory'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'room-a' },
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
    district: 'I',
    wing: 'Foundation Wing',
    route: '/foundation/room-c',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['room-b'],
    backTarget: 'estate-hall',
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
    district: 'I',
    wing: 'Foundation Wing',
    route: '/foundation/room-d',
    type: 'room',
    status: 'planned',
    parent: null,
    adjacentDestinations: [],
    backTarget: null,
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
    district: 'I',
    wing: 'Foundation Wing',
    route: '/foundation/secret',
    type: 'secret',
    status: 'secret',
    parent: null,
    adjacentDestinations: [],
    backTarget: null,
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

  // ═══════════════ DISTRICT II — REFERENCE MIGRATION SLICE ═══════════════
  {
    id: 'depmg',
    canonicalName: 'Central DEPMG Executive Reception',
    displayName: 'DEPMG Executive Reception',
    reference: 'II-101',
    district: 'II',
    wing: 'Arrival / Security',
    route: '/district-ii/reception',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['estate-hall', 'control-room'],
    backTarget: 'estate-hall',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.62, y: 0.42 } },
    backgroundAsset: '/d2/depmg-reception-bg.jpg',
    audioProfile: 'depmg-reception',
    capabilities: ['directory', 'floorplan', 'threshold'],
    thresholdConfig: {
      targetId: 'control-room',
      eyebrow: 'DEPMG Secure Creative Threshold · II-110',
      motto: 'The Artist Is the Business.',
    },
    hotspots: [
      {
        action: {
          kind: 'toast',
          message:
            'The Recording Complex — glimpsed through acoustic glass, never fully shown. II-102 is a reveal, not a passage.',
        },
        shape: 'rect',
        coords: { left: 24.5, top: 39.5, width: 22.5, height: 12.5 },
        label: 'Recording Complex Reveal — II-102',
      },
      {
        action: { kind: 'capability', capability: 'threshold' },
        shape: 'rect',
        coords: { left: 59.8, top: 53.5, width: 13.7, height: 11 },
        label: 'Secure Creative Threshold — II-110',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 83.3, top: 2, width: 10.5, height: 2.4 },
        label: 'Floor Plan — A-202',
      },
      {
        action: {
          kind: 'toast',
          message:
            'The Recording Complex is fully built — explore below. The Executive, Brand & Media HQ side is still being added, room by room.',
        },
        shape: 'rect',
        coords: { left: 94.3, top: 2, width: 5.2, height: 2.4 },
        label: 'Help',
      },
      {
        action: { kind: 'navigate', targetId: 'estate-hall' },
        shape: 'rect',
        coords: { left: 0.5, top: 92.8, width: 16.5, height: 4.4 },
        label: 'Return to the Estate',
      },
      {
        action: { kind: 'navigate', targetId: 'estate-hall' },
        shape: 'rect',
        coords: { left: 26.3, top: 89.5, width: 5.7, height: 7 },
        label: 'Return Home',
      },
      {
        action: { kind: 'toast', message: 'District I — Foundation hasn’t been built yet.' },
        shape: 'rect',
        coords: { left: 32.5, top: 89.5, width: 7.3, height: 7 },
        label: 'District I — Foundation',
      },
      {
        // Out of scope for this reference slice — District III itself, not
        // just another D2 room. Left as an honest toast rather than a
        // broken link or a silent omission of a hotspot that exists on
        // the real render.
        action: { kind: 'toast', message: 'District III — GEMINI Speakeasy hasn’t migrated to Estate 2.0 yet.' },
        shape: 'rect',
        coords: { left: 48.3, top: 89.5, width: 7.2, height: 7 },
        label: 'District III — GEMINI Speakeasy',
      },
      {
        action: { kind: 'toast', message: 'District IV — The Experience hasn’t migrated to Estate 2.0 yet.' },
        shape: 'rect',
        coords: { left: 55.8, top: 89.5, width: 7.5, height: 7 },
        label: 'District IV — The Experience',
      },
      {
        action: { kind: 'toast', message: 'Basement / Power infrastructure hasn’t been built yet.' },
        shape: 'rect',
        coords: { left: 65, top: 88.8, width: 9.4, height: 9 },
        label: 'Basement — Power',
      },
      {
        // hq-corridor is part of District II but outside this 4-destination
        // slice — "do not migrate additional D2 rooms during this pass."
        action: { kind: 'toast', message: 'Executive, Brand & Media HQ hasn’t migrated to Estate 2.0 yet.' },
        shape: 'rect',
        coords: { left: 82.7, top: 79.5, width: 17, height: 8.3 },
        label: 'D2 Navigation — Executive, Brand & Media HQ',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'control-room',
    canonicalName: 'Studio A Control Room',
    displayName: 'Studio A · Control Room',
    reference: 'II-202',
    district: 'II',
    wing: 'Recording Complex',
    route: '/district-ii/control-room',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['depmg', 'studio-a'],
    backTarget: 'depmg',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.5, y: 0.55 } },
    backgroundAsset: '/d2/depmg-control-bg.jpg',
    audioProfile: 'control-room',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'studio-a' },
        shape: 'rect',
        coords: { left: 38.1, top: 60.5, width: 23.4, height: 14.2 },
        label: 'Enter Studio A — II-201',
      },
      {
        action: {
          kind: 'panel',
          title: 'The Console · II-202',
          body: `<p>Every session in the Recording Complex passes through this desk — full-format monitoring, deep outboard integration, and a DAW rig built to keep pace with a tracking room sized for a full band.</p>
          <p style="opacity:0.6; font-style:italic;">Exact console make, model and monitoring chain are still being finalized and will be documented here once locked in.</p>`,
        },
        shape: 'rect',
        coords: { left: 4.56, top: 36.1, width: 19.2, height: 14.2 },
        label: 'The Console — II-202',
      },
      {
        action: {
          kind: 'panel',
          title: 'Outboard &amp; Gear',
          body: `<p>The rack lines flanking the console hold the outboard chain that gives DEPMG sessions their sound: compressors, equalizers, microphone preamps, converters and effects processors, curated rather than accumulated.</p>
          <p style="opacity:0.6; font-style:italic;">A full equipment list is still being assembled and will populate this panel once finalized.</p>`,
        },
        shape: 'rect',
        coords: { left: 75.5, top: 37.1, width: 19.2, height: 15.6 },
        label: 'Outboard & Gear',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 4.56, top: 1.95, width: 19.2, height: 14.2 },
        label: 'District II Directory',
      },
      {
        action: {
          kind: 'panel',
          title: 'DEPMG Sessions',
          body: `<p>Music recorded at DEPMG Studios, starting with RichFraz — MC, crooner and the artist this headquarters was built around.</p>
          <p><em>Lost in the Mind of R.S. Frazier</em> — out now.</p>
          <div style="display:flex; gap:14px; flex-wrap:wrap; margin-top:14px;">
            <a href="https://distrokid.com/hyperfollow/richfraz/lost-in-the-mind-of-rs-frazier-2?ref=release" target="_blank" rel="noopener" style="color:var(--gold);">Stream the Album</a>
            <a href="https://open.spotify.com/artist/2TF5zvNLvklcRY2qu2YDxd" target="_blank" rel="noopener" style="color:var(--gold);">Spotify</a>
            <a href="https://soundcloud.com/richfrazmusic" target="_blank" rel="noopener" style="color:var(--gold);">SoundCloud</a>
            <a href="https://music.apple.com/us/artist/richfraz/1444729870" target="_blank" rel="noopener" style="color:var(--gold);">Apple Music</a>
          </div>
          <p style="margin-top:18px; opacity:0.6; font-style:italic; font-size:13px;">Production credits and session stories for other DEPMG artists are still being assembled.</p>`,
        },
        shape: 'rect',
        coords: { left: 75.2, top: 0.98, width: 20.2, height: 16.6 },
        label: 'DEPMG Sessions',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 84.6, top: 83.5, width: 15.4, height: 7.3 },
        label: 'Floor Plan — A-202',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'studio-a',
    canonicalName: 'Studio A — Flagship Tracking Room',
    displayName: 'Studio A · Tracking Room',
    reference: 'II-201',
    district: 'II',
    wing: 'Recording Complex',
    route: '/district-ii/studio-a',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['control-room'],
    backTarget: 'control-room',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.5, y: 0.7 } },
    backgroundAsset: '/d2/depmg-studio-a-bg.jpg',
    audioProfile: 'studio-a',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'control-room' },
        shape: 'rect',
        coords: { left: 71.3, top: 5.37, width: 19.9, height: 12.7 },
        label: 'Control Room — through the Sound Lock',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 5.53, top: 5.37, width: 21.2, height: 13.2 },
        label: 'District II Directory',
      },
      {
        action: {
          kind: 'panel',
          title: 'Grand Piano',
          body: `<p>A concert grand, positioned to be tracked on its own or live alongside the full room.</p>
          <p style="opacity:0.6; font-style:italic;">The room's visuals reference a Steinway &amp; Sons D-274 as a placeholder, not a confirmed instrument selection — final make and model are still being decided and will be documented here once locked in.</p>`,
        },
        shape: 'rect',
        coords: { left: 0, top: 50.8, width: 21.8, height: 32.7 },
        label: 'Grand Piano',
      },
      {
        action: {
          kind: 'panel',
          title: 'Vocal Position',
          body: `<p>The primary vocal tracking position on the Studio A floor — not an isolated booth. For fully isolated vocal capture, see II-203 Vocal Booth, a separate room down the cluster.</p>`,
        },
        shape: 'rect',
        coords: { left: 26, top: 39.1, width: 11.7, height: 21.5 },
        label: 'Vocal Position',
      },
      {
        action: {
          kind: 'panel',
          title: 'Performance Floor',
          body: `<p>The open tracking floor — reconfigured session to session. One night it's a single vocalist and a mic. The next it's a full rhythm section, strings, horns or a choir, all tracked live in the same room.</p>
          <p style="opacity:0.6; font-style:italic;">Specific session configurations and stories will populate this panel as they happen.</p>`,
        },
        shape: 'rect',
        coords: { left: 39.1, top: 58.6, width: 35.8, height: 22.5 },
        label: 'Performance Floor',
      },
      {
        action: {
          kind: 'panel',
          title: 'Backline &amp; Instruments',
          body: `<p>Guitars, amplifiers and backline equipment on hand for tracking, curated rather than accumulated.</p>
          <p style="opacity:0.6; font-style:italic;">A full instrument and equipment list is still being assembled and will populate this panel once finalized.</p>`,
        },
        shape: 'rect',
        coords: { left: 74.9, top: 44.9, width: 25.1, height: 31.25 },
        label: 'Backline & Instruments',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 84.6, top: 83.5, width: 15.4, height: 7.3 },
        label: 'Floor Plan — A-202',
      },
    ],
    secretTrigger: null,
  },

  // ─── A-202 Rev. 4 stubs — Directory completeness only, NOT migrated ───
  stub('d2-102-reveal', 'II-102', 'Recording Complex Reveal', 'Arrival / Security', 'overlay'),
  stub('d2-110-threshold', 'II-110', 'DEPMG Secure Creative Threshold', 'Arrival / Security', 'overlay'),
  stub('vocal-booth', 'II-203', 'Studio A Vocal Booth', 'Recording Complex'),
  stub('isolation-rooms', 'II-204', 'Isolation Rooms', 'Recording Complex'),
  stub('studio-b', 'II-205', 'Studio B — Production / Writing Studio', 'Recording Complex'),
  stub('atmos', 'II-206', 'Dolby Atmos Mixing Suite', 'Recording Complex'),
  stub('mastering', 'II-207', 'Mastering / Critical Listening Room', 'Recording Complex'),
  stub('artist-lounge', 'II-208', 'Artist Lounge', 'Recording Complex'),
  stub('producer-lounge', 'II-209', 'Producer Lounge / Writing Room', 'Recording Complex'),
  stub('instrument-vault', 'II-210A', 'Instrument Vault', 'Recording Complex'),
  stub('mic-vault', 'II-210B', 'Microphone / Equipment Vault', 'Recording Complex'),
  stub('machine-room', 'II-210C', 'Machine / Technical Room', 'Recording Complex'),
  stub('kitchenette', 'II-211', 'Studio Kitchenette + Restrooms', 'Recording Complex'),
  stub('d2-301-ceo', 'II-301', 'CEO Office', 'Executive, Brand & Media HQ'),
  stub('d2-302-vp', 'II-302', 'Vice President Office', 'Executive, Brand & Media HQ'),
  stub('boardroom', 'II-303', 'Executive Boardroom', 'Executive, Brand & Media HQ'),
  stub('d2-304-smallconf', 'II-304', 'Small Executive Conference / Meeting Room', 'Executive, Brand & Media HQ'),
  stub('d2-305-twinscales', 'II-305', 'Twin Scales Publishing', 'Executive, Brand & Media HQ'),
  stub('d2-306-algorhythm', 'II-306', 'Algorhythm Design Studio', 'Executive, Brand & Media HQ'),
  stub('d2-307-omd', 'II-307', 'OMD Creative Studio', 'Executive, Brand & Media HQ'),
  stub('d2-308-podcast', 'II-308', 'Podcast Studio', 'Executive, Brand & Media HQ'),
  stub('d2-309-creatorsuites', 'II-309', 'Creator Suites', 'Executive, Brand & Media HQ'),
  stub('creator-lounge', 'II-310', 'Creator Collaboration Lounge', 'Executive, Brand & Media HQ'),
  stub('screening', 'II-311', 'Obsidian Screening Theater', 'Executive, Brand & Media HQ'),
  stub('d2-312-admin', 'II-312', 'Administrative / Support Workspace', 'Executive, Brand & Media HQ'),
  stub('d2-313-cafe', 'II-313', 'Shared Café / Refreshment', 'Executive, Brand & Media HQ'),
  stub('d2-314-restrooms', 'II-314', 'Restrooms, Storage, Print / Reprographics', 'Executive, Brand & Media HQ'),
];

/**
 * A minimal, non-navigable Registry record for canon rooms that exist
 * per A-202 Rev. 4 but have not migrated to Estate 2.0. Exists purely
 * so the Directory is complete and honest — no route, no background
 * asset, no hotspots, no adjacency. Default type 'room' (status:'planned',
 * awaiting migration); pass 'overlay' for the two arrival-cluster
 * entries that were never meant to be their own room even in canon.
 */
function stub(
  id: string,
  reference: string,
  canonicalName: string,
  wing: string,
  type: 'room' | 'overlay' = 'room'
): Destination {
  return {
    id,
    canonicalName,
    displayName: canonicalName,
    reference,
    district: 'II',
    wing,
    route: null,
    type,
    status: type === 'overlay' ? 'live' : 'planned',
    parent: null,
    adjacentDestinations: [],
    backTarget: null,
    explorerVisibility: false,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: null,
    backgroundAsset: null,
    audioProfile: null,
    capabilities: [],
    hotspots: [],
    secretTrigger: null,
  };
}

/**
 * Floor-plan sheet metadata — deliberately NOT part of Destination.
 * Multiple destinations share one physical plan image/reference, so
 * this is keyed by sheet id, not duplicated onto every room that
 * appears on it.
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
  a202: {
    asset: '/d2/a202-floorplan.jpg',
    reference: 'A-202 · District II · DEPMG Headquarters',
    canonNotice:
      'Visual Reference · Non-Canon Internal Labeling — room numbers, names and internal labeling shown here are non-canon and do not reflect frozen A-202 Rev. 4. Rev. 4 remains the sole governing architectural and programmatic document for District II.',
  },
};

export function getDestination(id: string): Destination | undefined {
  return REGISTRY.find((d) => d.id === id);
}

export function getDestinationByRoute(route: string): Destination | undefined {
  return REGISTRY.find((d) => d.route === route);
}
