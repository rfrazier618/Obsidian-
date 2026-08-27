import type { Destination } from './types';

/**
 * DEPMG Sessions — the real media content, shared by every hotspot that
 * surfaces it. Legacy reused the exact same saOpenPanel('sessions') call
 * from both Control Room ("DEPMG Sessions") and Artist Lounge ("Now
 * Playing — DEPMG Sessions"); this constant is that reuse made explicit
 * at the data layer too, not just at the mechanism layer. A hotspot's
 * own `label` can still differ by room context (contextual framing);
 * the panel `title`/`body` payload never forks.
 */
const DEPMG_SESSIONS_PANEL = {
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
} as const;

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
        action: { kind: 'panel', ...DEPMG_SESSIONS_PANEL },
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
  // ─── II-200 batch 1: Vocal Booth / Isolation Rooms / Studio B ───
  // All three back to studio-a (their true parent per legacy AND per
  // their own descriptive copy — "within the Studio A cluster"), not to
  // control-room. studio-a itself has no forward hotspot into this
  // wing in legacy (confirmed against the source) — preserved exactly
  // as-is rather than silently added; see the batch report.
  {
    id: 'vocal-booth',
    canonicalName: 'Studio A Vocal Booth',
    displayName: 'Studio A Vocal Booth',
    reference: 'II-203',
    district: 'II',
    wing: 'Recording Complex',
    route: '/district-ii/vocal-booth',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['studio-a', 'control-room', 'isolation-rooms'],
    backTarget: 'studio-a',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.42, y: 0.8 } },
    backgroundAsset: '/d2/depmg-vocal-booth-bg.jpg',
    audioProfile: 'vocal-booth',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'studio-a' },
        shape: 'rect',
        coords: { left: 0.33, top: 70.3, width: 13.22, height: 27.8 },
        label: 'Studio A — return to the tracking room',
      },
      {
        action: { kind: 'navigate', targetId: 'control-room' },
        shape: 'rect',
        coords: { left: 14.45, top: 70.3, width: 12.76, height: 27.8 },
        label: 'Control Room — II-202',
      },
      {
        action: { kind: 'navigate', targetId: 'isolation-rooms' },
        shape: 'rect',
        coords: { left: 41.67, top: 70.3, width: 12.76, height: 27.8 },
        label: 'Isolation Rooms — II-204',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 55.21, top: 70.3, width: 12.76, height: 27.8 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 68.75, top: 70.3, width: 12.76, height: 27.8 },
        label: 'Floor Plan — A-202',
      },
      {
        action: {
          kind: 'panel',
          title: 'Sound Lock Status',
          body: `<p>This booth's monitor and headphone feed routes exclusively to Studio A's session — isolated from the Control Room and the rest of the Recording Complex while a take is in progress.</p>`,
        },
        shape: 'rect',
        coords: { left: 82.36, top: 70.3, width: 13.35, height: 27.8 },
        label: 'Sound Lock Status',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'isolation-rooms',
    canonicalName: 'Isolation Rooms',
    displayName: 'Isolation Rooms',
    reference: 'II-204',
    district: 'II',
    wing: 'Recording Complex',
    route: '/district-ii/isolation-rooms',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['studio-a', 'control-room', 'vocal-booth'],
    backTarget: 'studio-a',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.58, y: 0.8 } },
    backgroundAsset: '/d2/depmg-isolation-rooms-bg.jpg',
    audioProfile: 'isolation-rooms',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'studio-a' },
        shape: 'rect',
        coords: { left: 0.33, top: 71.3, width: 13.67, height: 26.86 },
        label: 'Studio A — return to the tracking room',
      },
      {
        action: { kind: 'navigate', targetId: 'control-room' },
        shape: 'rect',
        coords: { left: 14.65, top: 71.3, width: 12.7, height: 26.86 },
        label: 'Control Room — II-202',
      },
      {
        action: { kind: 'navigate', targetId: 'vocal-booth' },
        shape: 'rect',
        coords: { left: 28.13, top: 71.3, width: 12.11, height: 26.86 },
        label: 'Studio A Vocal Booth — II-203',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 54.82, top: 71.3, width: 12.24, height: 26.86 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 67.84, top: 71.3, width: 12.24, height: 26.86 },
        label: 'Floor Plan — A-202',
      },
      {
        action: {
          kind: 'panel',
          title: 'Sound Lock Status',
          body: `<p>Isolation Rooms are acoustically isolated from Studio A. Audio routing is exclusive to Studio A only.</p>`,
        },
        shape: 'rect',
        coords: { left: 81.05, top: 71.3, width: 12.17, height: 26.86 },
        label: 'Sound Lock Status',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'studio-b',
    canonicalName: 'Studio B — Production / Writing Studio',
    displayName: 'Studio B',
    reference: 'II-205',
    district: 'II',
    wing: 'Recording Complex',
    route: '/district-ii/studio-b',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['studio-a', 'control-room', 'vocal-booth', 'isolation-rooms'],
    backTarget: 'studio-a',
    explorerVisibility: true,
    globalNavVisibility: false,
    // Legacy studio-b has no saOpenPanel('complex') hotspot on the render,
    // unlike its two siblings — preserved as a discrepancy, not silently
    // fixed. directoryVisibility stays true (it still belongs in the
    // Directory listing itself); only the in-room hotspot is absent.
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.5, y: 0.85 } },
    backgroundAsset: '/d2/depmg-studio-b-bg.jpg',
    audioProfile: 'studio-b',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'studio-a' },
        shape: 'rect',
        coords: { left: 0.52, top: 71.3, width: 13.48, height: 26.86 },
        label: 'Studio A — return to the tracking room',
      },
      {
        action: { kind: 'navigate', targetId: 'control-room' },
        shape: 'rect',
        coords: { left: 14.84, top: 71.3, width: 12.5, height: 26.86 },
        label: 'Control Room — II-202',
      },
      {
        action: { kind: 'navigate', targetId: 'vocal-booth' },
        shape: 'rect',
        coords: { left: 28.19, top: 71.3, width: 12.63, height: 26.86 },
        label: 'Studio A Vocal Booth — II-203',
      },
      {
        action: { kind: 'navigate', targetId: 'isolation-rooms' },
        shape: 'rect',
        coords: { left: 41.67, top: 71.3, width: 12.89, height: 26.86 },
        label: 'Isolation Rooms — II-204',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 69.14, top: 71.3, width: 11.26, height: 26.86 },
        label: 'Floor Plan — A-202',
      },
      {
        action: {
          kind: 'panel',
          title: 'Sound Lock Status',
          body: `<p>Studio B is acoustically isolated from Studio A. Audio routing is exclusive to Studio A only.</p>`,
        },
        shape: 'rect',
        coords: { left: 81.9, top: 71.3, width: 13.8, height: 26.86 },
        label: 'Sound Lock Status',
      },
    ],
    secretTrigger: null,
  },
  // ─── II-200 batch 2: Dolby Atmos / Mastering / Artist Lounge ───
  // Continues the same backward-only chain the demolition survey found
  // (studio-b -> atmos -> mastering -> artist-lounge, each linking only
  // to the previous room) — preserved exactly, not repaired. That's a
  // canonical-adjacency question for a later pass, not a migration bug.
  {
    id: 'atmos',
    canonicalName: 'Dolby Atmos Mixing Suite',
    displayName: 'Dolby Atmos Mixing Suite',
    reference: 'II-206',
    district: 'II',
    wing: 'Recording Complex',
    route: '/district-ii/atmos',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['studio-b'],
    backTarget: 'studio-b',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.6, y: 0.9 } },
    backgroundAsset: '/d2/depmg-atmos-bg.jpg',
    audioProfile: 'atmos',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'studio-b' },
        shape: 'rect',
        coords: { left: 0.33, top: 71.1, width: 13.67, height: 26.56 },
        label: 'Studio B — return to the Recording Complex',
      },
      {
        action: {
          kind: 'panel',
          title: 'Sweet Spot',
          body: `<p>The true center of the immersive listening field — the one position where the surround and overhead array converges into a calibrated three-dimensional mix.</p>`,
        },
        shape: 'rect',
        coords: { left: 14.78, top: 71.1, width: 12.43, height: 26.56 },
        label: 'Sweet Spot',
      },
      {
        action: {
          kind: 'panel',
          title: 'Speaker Array',
          body: `<p>Surround and overhead speakers in a full 3D configuration, built for complete immersive mix translation.</p>
          <p style="opacity:0.6; font-style:italic;">Exact speaker count, configuration and manufacturer are still being finalized and will be documented here once locked in.</p>`,
        },
        shape: 'rect',
        coords: { left: 28.13, top: 71.1, width: 13.22, height: 26.56 },
        label: 'Speaker Array',
      },
      {
        action: {
          kind: 'panel',
          title: 'Mix Console',
          body: `<p>The production console and workstation at the mix position — where the immersive field actually gets built.</p>
          <p style="opacity:0.6; font-style:italic;">Exact console make and model are still being finalized and will be documented here once locked in.</p>`,
        },
        shape: 'rect',
        coords: { left: 42.19, top: 71.1, width: 13.54, height: 26.56 },
        label: 'Mix Console',
      },
      {
        action: {
          kind: 'panel',
          title: 'Client Area',
          body: `<p>Restrained seating behind the primary mix position — room for a client or collaborator to sit in on a mix without occupying the sweet spot.</p>`,
        },
        shape: 'rect',
        coords: { left: 56.51, top: 71.1, width: 13.54, height: 26.56 },
        label: 'Client Area',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 70.96, top: 71.1, width: 12.37, height: 26.56 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 84.11, top: 71.1, width: 13.54, height: 26.56 },
        label: 'Floor Plan — A-202',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'mastering',
    canonicalName: 'Mastering / Critical Listening Room',
    displayName: 'Mastering / Critical Listening Room',
    reference: 'II-207',
    district: 'II',
    wing: 'Recording Complex',
    route: '/district-ii/mastering',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['atmos'],
    backTarget: 'atmos',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.7, y: 0.9 } },
    backgroundAsset: '/d2/depmg-mastering-bg.jpg',
    audioProfile: 'mastering',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'atmos' },
        shape: 'rect',
        coords: { left: 0.33, top: 71.1, width: 13.67, height: 26.56 },
        label: 'Dolby Atmos — return to the Recording Complex',
      },
      {
        action: {
          kind: 'panel',
          title: 'Critical Listening Position',
          body: `<p>The single position where final judgment is made — centered on an exceptionally clean, symmetrical monitoring wall. This is the last checkpoint before a record leaves DEPMG.</p>`,
        },
        shape: 'rect',
        coords: { left: 14.78, top: 71.1, width: 12.43, height: 26.56 },
        label: 'Critical Listening Position',
      },
      {
        action: {
          kind: 'panel',
          title: 'Reference Monitoring',
          body: `<p>Forward-facing reference monitors only — no immersive or overhead field. That identity belongs to the Dolby Atmos Suite alone; this room's precision comes from symmetry, not surround.</p>
          <p style="opacity:0.6; font-style:italic;">Exact monitor make and model are still being finalized and will be documented here once locked in.</p>`,
        },
        shape: 'rect',
        coords: { left: 28.13, top: 71.1, width: 12.57, height: 26.56 },
        label: 'Reference Monitoring',
      },
      {
        action: {
          kind: 'panel',
          title: 'Mastering Chain',
          body: `<p>The outboard chain for the final pass — equalization, dynamics, conversion and metering, curated for translation and detail rather than character.</p>
          <p style="opacity:0.6; font-style:italic;">Exact equipment make and model are still being finalized and will be documented here once locked in.</p>`,
        },
        shape: 'rect',
        coords: { left: 41.67, top: 71.1, width: 13.67, height: 26.56 },
        label: 'Mastering Chain',
      },
      {
        action: {
          kind: 'panel',
          title: 'Client Listening',
          body: `<p>Restrained seating for two behind the engineer — present, but never competing with the critical listening position.</p>`,
        },
        shape: 'rect',
        coords: { left: 56.12, top: 71.1, width: 12.76, height: 26.56 },
        label: 'Client Listening',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 69.66, top: 71.1, width: 12.83, height: 26.56 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 83.33, top: 71.1, width: 12.89, height: 26.56 },
        label: 'Floor Plan — A-202',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'artist-lounge',
    canonicalName: 'Artist Lounge',
    displayName: 'Artist Lounge',
    reference: 'II-208',
    district: 'II',
    wing: 'Recording Complex',
    route: '/district-ii/artist-lounge',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['mastering'],
    backTarget: 'mastering',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.8, y: 0.9 } },
    backgroundAsset: '/d2/depmg-artist-lounge-bg.jpg',
    audioProfile: 'artist-lounge',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'mastering' },
        shape: 'rect',
        coords: { left: 0.98, top: 70.6, width: 13.35, height: 27.54 },
        label: 'Recording Complex — return to the production cluster',
      },
      {
        action: {
          kind: 'panel',
          title: 'Lounge',
          body: `<p>The studios demand performance. This room gives you permission to stop performing — decompress after a session, talk through a rough mix, eat something, take a call, or just sit with a verse that isn't working yet.</p>
          <p style="opacity:0.6; font-style:italic;">Distinct from II-209 Producer Lounge/Writing Room — this space is for rest, not work.</p>`,
        },
        shape: 'rect',
        coords: { left: 14.78, top: 70.6, width: 12.89, height: 27.54 },
        label: 'Lounge',
      },
      {
        action: {
          kind: 'panel',
          title: 'Private Seating',
          body: `<p>A quieter corner set apart from the main sectional — for a private conversation, a call, or a few minutes alone.</p>`,
        },
        shape: 'rect',
        coords: { left: 28.19, top: 70.6, width: 13.15, height: 27.54 },
        label: 'Private Seating',
      },
      {
        action: {
          kind: 'panel',
          title: 'Hospitality',
          body: `<p>Drinks, snacks and light service, available without leaving the Recording Complex.</p>
          <p style="opacity:0.6; font-style:italic;">This is a hospitality element within the Lounge, not the full II-211 Studio Kitchenette — a separate room down the wing.</p>`,
        },
        shape: 'rect',
        coords: { left: 41.99, top: 70.6, width: 13.54, height: 27.54 },
        label: 'Hospitality',
      },
      {
        // Same shared DEPMG_SESSIONS_PANEL constant as Control Room's
        // hotspot — the architectural point of this batch. Only the
        // hotspot's own label differs ("Now Playing" framing for the
        // lounge context); the panel content is never forked.
        action: { kind: 'panel', ...DEPMG_SESSIONS_PANEL },
        shape: 'rect',
        coords: { left: 56.12, top: 70.6, width: 13.87, height: 27.54 },
        label: 'Now Playing — DEPMG Sessions',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 70.51, top: 70.6, width: 13.48, height: 27.54 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 84.51, top: 70.6, width: 13.8, height: 27.54 },
        label: 'Floor Plan — A-202',
      },
    ],
    secretTrigger: null,
  },
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
