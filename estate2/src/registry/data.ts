import type { Destination, District } from './types';

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
 * Vault Preservation — legacy already reuses this exact saOpenPanel('vaultpreservation')
 * call from both the Instrument Vault and the Mic Vault, verbatim. Extracted
 * here for the same reason as DEPMG_SESSIONS_PANEL: the two vaults are
 * siblings that share one preservation philosophy, not two rooms that
 * happen to say something similar. Do not fork this content per room.
 */
const VAULT_PRESERVATION_PANEL = {
  title: 'Vault Preservation',
  body: `<p>Preserve. Protect. Prepare. Tools are maintained at the highest standard so creativity never waits &mdash; secure storage, climate-conscious, catalogued and ready when the moment demands it.</p>`,
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
    adjacentDestinations: ['estate-hall', 'control-room', 'hq-corridor', 'gemini-reception'],
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
        // Activated during the District III reference-slice migration —
        // this hotspot was a placeholder toast until Gemini Reception
        // itself went live. Same coords and title as before; only the
        // action changed, same pattern as HQ Corridor's activation above.
        action: { kind: 'navigate', targetId: 'gemini-reception' },
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
        // Activated during the HQ branch migration — this hotspot was a
        // placeholder toast until hq-corridor itself was live. Same coords
        // and title as legacy's own goTo('hq-corridor') hotspot, verbatim.
        action: { kind: 'navigate', targetId: 'hq-corridor' },
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
          title: 'Outboard & Gear',
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
          title: 'Backline & Instruments',
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
  // ─── II-200 batch 3: Producer Lounge / Instrument Vault / Mic Vault ───
  // Backward-only chain continues exactly as legacy has it (artist-lounge
  // has no forward hotspot into producer-lounge; producer-lounge has none
  // into instrument-vault; instrument-vault has none into mic-vault; and
  // mic-vault has none into machine-room, which stays a stub this batch).
  // Preserved, not repaired — this is compiled into the later canonical-
  // adjacency pass, not fixed room by room during migration.
  {
    id: 'producer-lounge',
    canonicalName: 'Producer Lounge / Writing Room',
    displayName: 'Producer Lounge / Writing Room',
    reference: 'II-209',
    district: 'II',
    wing: 'Recording Complex',
    route: '/district-ii/producer-lounge',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['artist-lounge'],
    backTarget: 'artist-lounge',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.9, y: 0.9 } },
    backgroundAsset: '/d2/depmg-producer-lounge-bg.jpg',
    audioProfile: 'producer-lounge',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'artist-lounge' },
        shape: 'rect',
        coords: { left: 0.33, top: 70.6, width: 13.48, height: 27.54 },
        label: 'Artist Lounge — II-208',
      },
      {
        action: {
          kind: 'panel',
          title: 'Writing Table',
          body: `<p>Where the next record starts before it's a session &mdash; lyrics, arrangement ideas, and songwriting worked out by hand around one communal table.</p>`,
        },
        shape: 'rect',
        coords: { left: 14.65, top: 70.6, width: 12.57, height: 27.54 },
        label: 'Writing Table',
      },
      {
        action: {
          kind: 'panel',
          title: 'Idea Wall',
          body: `<p>Notes, concepts and song structures, pinned and worked through in the open.</p>`,
        },
        shape: 'rect',
        coords: { left: 28.13, top: 70.6, width: 12.7, height: 27.54 },
        label: 'Idea Wall',
      },
      {
        action: {
          kind: 'panel',
          title: 'Reference Listening',
          body: `<p>Pull something up, compare it, discuss it, rethink the record. This isn't relaxed listening &mdash; it's evaluation, and it's not mixing or mastering either.</p>
          <p style="opacity:0.6; font-style:italic;">A different behavior from II-208's Now Playing, on purpose.</p>`,
        },
        shape: 'rect',
        coords: { left: 41.67, top: 70.6, width: 13.22, height: 27.54 },
        label: 'Reference Listening',
      },
      {
        action: {
          kind: 'panel',
          title: 'Producer Library',
          body: `<p>Records, books and creative references kept close at hand for whatever the next idea needs.</p>`,
        },
        shape: 'rect',
        coords: { left: 55.79, top: 70.6, width: 12.89, height: 27.54 },
        label: 'Producer Library',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 69.53, top: 70.6, width: 13.48, height: 27.54 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 83.85, top: 70.6, width: 13.15, height: 27.54 },
        label: 'Floor Plan — A-202',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'instrument-vault',
    canonicalName: 'Instrument Vault',
    displayName: 'Instrument Vault',
    reference: 'II-210A',
    district: 'II',
    wing: 'Recording Complex',
    route: '/district-ii/instrument-vault',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['producer-lounge'],
    backTarget: 'producer-lounge',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.88, y: 0.98 } },
    backgroundAsset: '/d2/depmg-instrument-vault-bg.jpg',
    audioProfile: 'instrument-vault',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'producer-lounge' },
        shape: 'rect',
        coords: { left: 0.52, top: 70.6, width: 13.48, height: 27.54 },
        label: 'Producer Lounge / Writing Room — II-209',
      },
      {
        action: {
          kind: 'panel',
          title: 'Guitar & Bass Collection',
          body: `<p>Electric guitars and basses, stored and ready &mdash; catalogued in secure, illuminated cabinetry rather than staged for performance.</p>`,
        },
        shape: 'rect',
        coords: { left: 14.78, top: 70.6, width: 12.43, height: 27.54 },
        label: 'Guitar & Bass Collection',
      },
      {
        action: {
          kind: 'panel',
          title: 'Acoustic & Specialty Instruments',
          body: `<p>Acoustic instruments, keyboard and synth-sized cases, percussion cases and specialty hard cases, held in purpose-built storage bays.</p>`,
        },
        shape: 'rect',
        coords: { left: 28.13, top: 70.6, width: 13.54, height: 27.54 },
        label: 'Acoustic & Specialty Instruments',
      },
      {
        action: {
          kind: 'panel',
          title: 'Instrument Prep',
          body: `<p>A central inspection surface where an instrument comes out of storage to be inspected, restrung, cleaned or prepared for a session.</p>
          <p style="opacity:0.6; font-style:italic;">A prep position, not a performance or recording position.</p>`,
        },
        shape: 'rect',
        coords: { left: 42.51, top: 70.6, width: 13.28, height: 27.54 },
        label: 'Instrument Prep',
      },
      {
        // Same shared VAULT_PRESERVATION_PANEL constant as the Mic Vault's
        // hotspot below — legacy already reused this content verbatim
        // between the two vaults, so the migration makes that reuse
        // explicit at the data layer rather than forking it per room.
        action: { kind: 'panel', ...VAULT_PRESERVATION_PANEL },
        shape: 'rect',
        coords: { left: 56.51, top: 70.6, width: 13.8, height: 27.54 },
        label: 'Vault Preservation',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 71.09, top: 70.6, width: 13.22, height: 27.54 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 84.96, top: 70.6, width: 13.35, height: 27.54 },
        label: 'Floor Plan — A-202',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'mic-vault',
    canonicalName: 'Microphone / Equipment Vault',
    displayName: 'Mic Vault',
    reference: 'II-210B',
    district: 'II',
    wing: 'Recording Complex',
    route: '/district-ii/mic-vault',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['instrument-vault'],
    backTarget: 'instrument-vault',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.95, y: 0.98 } },
    backgroundAsset: '/d2/depmg-mic-vault-bg.jpg',
    audioProfile: 'mic-vault',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'instrument-vault' },
        shape: 'rect',
        coords: { left: 0.48, top: 75.11, width: 13.27, height: 24.57 },
        label: 'Instrument Vault — II-210A',
      },
      {
        action: {
          kind: 'panel',
          title: 'Microphone Collection',
          body: `<p>The curated collection, organized by type and use &mdash; large-diaphragm, small-diaphragm, dynamic and ribbon-style microphones, each in its own illuminated storage.</p>`,
        },
        shape: 'rect',
        coords: { left: 14.4, top: 75.11, width: 13.04, height: 24.57 },
        label: 'Microphone Collection',
      },
      {
        action: {
          kind: 'panel',
          title: 'Matched & Specialty Sets',
          body: `<p>Matched pairs and specialty microphones, selected for unique recording applications.</p>`,
        },
        shape: 'rect',
        coords: { left: 28.1, top: 75.11, width: 14.29, height: 24.57 },
        label: 'Matched & Specialty Sets',
      },
      {
        action: {
          kind: 'panel',
          title: 'Mic Prep & Handling',
          body: `<p>The selection, inspection and preparation counter &mdash; where a microphone is chosen and readied with care.</p>
          <p style="opacity:0.6; font-style:italic;">A handling position, not a recording position.</p>`,
        },
        shape: 'rect',
        coords: { left: 43.04, top: 75.11, width: 14.17, height: 24.57 },
        label: 'Mic Prep & Handling',
      },
      {
        // Same shared VAULT_PRESERVATION_PANEL as the Instrument Vault.
        action: { kind: 'panel', ...VAULT_PRESERVATION_PANEL },
        shape: 'rect',
        coords: { left: 57.62, top: 75.11, width: 14.11, height: 24.57 },
        label: 'Vault Preservation',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 72.5, top: 75.11, width: 13.81, height: 24.57 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 87.02, top: 75.11, width: 12.5, height: 24.57 },
        label: 'Floor Plan — A-202',
      },
    ],
    secretTrigger: null,
  },
  // ─── II-200 batch 4 (final Recording Complex batch): Machine Room / Kitchenette ───
  // Backward-only chain continues once more (mic-vault -> machine-room ->
  // kitchenette, each linking only to the previous room) — preserved
  // exactly, as with every prior batch. This closes out the chain that
  // began at studio-b; the canonical-adjacency review report (produced
  // alongside the branch closure audit) is what finally deals with it.
  {
    id: 'machine-room',
    canonicalName: 'Machine / Technical Room',
    displayName: 'Machine Room',
    reference: 'II-210C',
    district: 'II',
    wing: 'Recording Complex',
    route: '/district-ii/machine-room',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['mic-vault'],
    backTarget: 'mic-vault',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.98, y: 0.9 } },
    backgroundAsset: '/d2/depmg-machine-room-bg.jpg',
    audioProfile: 'machine-room',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'mic-vault' },
        shape: 'rect',
        coords: { left: 0.35, top: 70.78, width: 13.59, height: 29.22 },
        label: 'Mic Vault — II-210B',
      },
      {
        // Deliberately conceptual, exactly as legacy has it — no fabricated
        // capacities, ratings, or equipment models. See sysinfra/powercond
        // below: legacy itself explicitly disclaims specifics.
        action: {
          kind: 'panel',
          title: 'Systems Infrastructure',
          body: `<p>The room nobody designed to impress a guest &mdash; power, distribution and monitoring systems that keep every other room in the Recording Complex capable of working.</p>`,
        },
        shape: 'rect',
        coords: { left: 14.64, top: 70.78, width: 13.59, height: 29.22 },
        label: 'Systems Infrastructure',
      },
      {
        action: {
          kind: 'panel',
          title: 'Power & Conditioning',
          body: `<p>Power distribution and conditioning for the Recording Complex, kept clean and stable for the equipment downstream.</p>
          <p style="opacity:0.6; font-style:italic;">Specific capacities and ratings aren't published here.</p>`,
        },
        shape: 'rect',
        coords: { left: 28.92, top: 70.78, width: 13.59, height: 29.22 },
        label: 'Power & Conditioning',
      },
      {
        action: {
          kind: 'panel',
          title: 'Technical Distribution',
          body: `<p>Cabling, signal and network pathways &mdash; the connective tissue that ties the Recording Complex's rooms together, run and managed out of sight.</p>`,
        },
        shape: 'rect',
        coords: { left: 43.21, top: 70.78, width: 13.59, height: 29.22 },
        label: 'Technical Distribution',
      },
      {
        action: {
          kind: 'panel',
          title: 'Systems Monitoring',
          body: `<p>Operational oversight for the systems that keep the Complex running &mdash; status, not sound.</p>
          <p style="opacity:0.6; font-style:italic;">A diagnostics position, not a recording workstation.</p>`,
        },
        shape: 'rect',
        coords: { left: 57.49, top: 70.78, width: 13.59, height: 29.22 },
        label: 'Systems Monitoring',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 71.78, top: 70.78, width: 13.59, height: 29.22 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 86.06, top: 70.78, width: 13.59, height: 29.22 },
        label: 'Floor Plan — A-202',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'kitchenette',
    canonicalName: 'Studio Kitchenette + Restrooms',
    displayName: 'Studio Kitchenette',
    reference: 'II-211',
    district: 'II',
    wing: 'Recording Complex',
    route: '/district-ii/kitchenette',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['machine-room'],
    backTarget: 'machine-room',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.98, y: 0.98 } },
    backgroundAsset: '/d2/depmg-kitchenette-bg.jpg',
    audioProfile: 'kitchenette',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'machine-room' },
        shape: 'rect',
        coords: { left: 0.35, top: 70.78, width: 13.59, height: 29.22 },
        label: 'Machine Room — II-210C',
      },
      {
        // The render's own baked callout card #2 body text reads "studio
        // kicthenette" — a typo in the image artifact itself, not in any
        // canonical or interactive-layer text. That misspelling is NOT
        // reproduced here: the panel title/body and all interactive copy
        // stay correctly spelled "Kitchenette," exactly as legacy's own
        // SA_PANELS content already has it.
        action: {
          kind: 'panel',
          title: 'Kitchenette',
          body: `<p>A studio support kitchenette built for long sessions &mdash; coffee, food and a place to reset before heading back to work.</p>`,
        },
        shape: 'rect',
        coords: { left: 14.64, top: 70.78, width: 13.59, height: 29.22 },
        label: 'Kitchenette',
      },
      {
        action: {
          kind: 'panel',
          title: 'Coffee & Refreshments',
          body: `<p>Coffee, water and light refreshments, kept stocked for artists, engineers, producers and guests through a long session.</p>`,
        },
        shape: 'rect',
        coords: { left: 28.92, top: 70.78, width: 13.59, height: 29.22 },
        label: 'Coffee & Refreshments',
      },
      {
        // Guest Seating stays a reset space, not a second Artist Lounge —
        // legacy's own disclaimer is preserved verbatim below.
        action: {
          kind: 'panel',
          title: 'Guest Seating',
          body: `<p>A small caf&eacute;-style seating area for a quick break or a casual conversation.</p>
          <p style="opacity:0.6; font-style:italic;">A reset space, not a second lounge.</p>`,
        },
        shape: 'rect',
        coords: { left: 43.21, top: 70.78, width: 13.59, height: 29.22 },
        label: 'Guest Seating',
      },
      {
        // Restrooms stay a reference/threshold panel, not an invented
        // room experience — matches legacy's plain facilities notice.
        action: {
          kind: 'panel',
          title: 'Restrooms',
          body: `<p>Restroom facilities for artists, engineers, producers and guests, located along this wing of the Recording Complex.</p>`,
        },
        shape: 'rect',
        coords: { left: 57.49, top: 70.78, width: 13.59, height: 29.22 },
        label: 'Restrooms',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 71.78, top: 70.78, width: 13.59, height: 29.22 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 86.06, top: 70.78, width: 13.59, height: 29.22 },
        label: 'Floor Plan — A-202',
      },
    ],
    secretTrigger: null,
  },
  // ─── HQ branch: Reception -> HQ Corridor (hub) -> 4 flagship leaves ───
  // Governing architectural test for this migration: a hub-and-spoke
  // branch, not another linear chain. HQ Corridor is the hub; the four
  // flagship destinations are leaves unless legacy itself establishes a
  // real leaf-to-leaf relationship (it does, once — see creator-lounge's
  // hotspot into screening below). No leaf-to-leaf navigation was added
  // to make the graph look more symmetrical than legacy actually built it.
  {
    id: 'hq-corridor',
    canonicalName: 'Executive, Brand & Media HQ',
    displayName: 'Executive, Brand & Media HQ',
    // Legacy's own eyebrow calls this "II-3xx" — the corridor itself carries
    // no single canonical room number; it's the unnumbered circulation hub
    // for the II-3xx wing, same category as the Studio Wing Corridor in II-200.
    reference: 'II-3xx',
    district: 'II',
    wing: 'Executive, Brand & Media HQ',
    route: '/district-ii/hq-corridor',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['depmg', 'screening', 'boardroom', 'brand-studios', 'creator-lounge'],
    backTarget: 'depmg',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.15, y: 0.5 } },
    backgroundAsset: '/d2/depmg-hq-corridor-bg.jpg',
    audioProfile: 'hq-corridor',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'screening' },
        shape: 'rect',
        coords: { left: 7.36, top: 49.3, width: 11.65, height: 37.6 },
        label: 'Obsidian Screening Theater — II-311',
      },
      {
        action: { kind: 'navigate', targetId: 'boardroom' },
        shape: 'rect',
        coords: { left: 20.96, top: 49.3, width: 11.65, height: 37.6 },
        label: 'Executive Suite — II-301–304',
      },
      {
        action: { kind: 'navigate', targetId: 'brand-studios' },
        shape: 'rect',
        coords: { left: 34.57, top: 49.3, width: 11.65, height: 37.6 },
        label: 'Brand Studios — II-305–308',
      },
      {
        action: { kind: 'navigate', targetId: 'creator-lounge' },
        shape: 'rect',
        coords: { left: 48.1, top: 49.3, width: 11.65, height: 37.6 },
        label: 'Creator Suites & Lounge — II-309–310',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 61.65, top: 49.3, width: 11.65, height: 37.6 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 75.26, top: 49.3, width: 11.65, height: 37.6 },
        label: 'Floor Plan — A-202',
      },
    ],
    secretTrigger: null,
  },
  stub('d2-301-ceo', 'II-301', 'CEO Office', 'Executive, Brand & Media HQ'),
  stub('d2-302-vp', 'II-302', 'Vice President Office', 'Executive, Brand & Media HQ'),
  {
    id: 'boardroom',
    canonicalName: 'Executive Boardroom',
    displayName: 'Executive Boardroom',
    reference: 'II-303',
    district: 'II',
    wing: 'Executive, Brand & Media HQ',
    route: '/district-ii/boardroom',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['hq-corridor'],
    backTarget: 'hq-corridor',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.05, y: 0.7 } },
    backgroundAsset: '/d2/depmg-boardroom-bg.jpg',
    audioProfile: 'boardroom',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'hq-corridor' },
        shape: 'rect',
        coords: { left: 5.53, top: 72.07, width: 12.7, height: 26.37 },
        label: 'HQ Corridor — return to the hub',
      },
      {
        // CEO Office, VP Office and Small Executive Conference are
        // informational-only in legacy — saOpenPanel, not goTo() — and
        // each panel says so itself. They stay stubs in the Registry
        // (Directory completeness only); this is NOT a navigate action,
        // and the II-301/302/304 stubs are not promoted just because
        // their architectural identities exist in A-202.
        action: {
          kind: 'panel',
          title: 'CEO Office',
          body: `<p>The CEO's private office, adjoining the Executive Boardroom.</p>
          <p style="opacity:0.6; font-style:italic;">Not built into the Estate yet.</p>`,
        },
        shape: 'rect',
        coords: { left: 19.86, top: 72.07, width: 13.67, height: 26.37 },
        label: 'CEO Office — II-301',
      },
      {
        action: {
          kind: 'panel',
          title: 'VP Office',
          body: `<p>The Vice President's private office, adjoining the Executive Boardroom.</p>
          <p style="opacity:0.6; font-style:italic;">Not built into the Estate yet.</p>`,
        },
        shape: 'rect',
        coords: { left: 34.51, top: 72.07, width: 13.54, height: 26.37 },
        label: 'VP Office — II-302',
      },
      {
        action: {
          kind: 'panel',
          title: 'Small Executive Conference',
          body: `<p>A private space for small executive meetings, within the same cluster as the Boardroom.</p>
          <p style="opacity:0.6; font-style:italic;">Not built into the Estate yet.</p>`,
        },
        shape: 'rect',
        coords: { left: 48.5, top: 72.07, width: 14.19, height: 26.37 },
        label: 'Small Executive Conference — II-304',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 63.15, top: 72.07, width: 14, height: 26.37 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 78.13, top: 72.07, width: 13.35, height: 26.37 },
        label: 'Floor Plan — A-202',
      },
    ],
    secretTrigger: null,
  },
  stub('d2-304-smallconf', 'II-304', 'Small Executive Conference / Meeting Room', 'Executive, Brand & Media HQ'),
  {
    id: 'brand-studios',
    canonicalName: 'Brand Studios',
    displayName: 'Brand Studios',
    reference: 'II-305–308',
    district: 'II',
    wing: 'Executive, Brand & Media HQ',
    route: '/district-ii/brand-studios',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['hq-corridor'],
    backTarget: 'hq-corridor',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.15, y: 0.75 } },
    backgroundAsset: '/d2/depmg-brand-studios-bg.jpg',
    audioProfile: 'brand-studios',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'hq-corridor' },
        shape: 'rect',
        coords: { left: 5.21, top: 70.6, width: 11.2, height: 28.32 },
        label: 'HQ Corridor — return to the hub',
      },
      {
        // The four brands are informational thresholds onto this shared
        // creative commons, not separately navigable rooms — legacy's own
        // panels say so. Each stays a stub for Directory completeness only.
        action: {
          kind: 'panel',
          title: 'Twin Scales Publishing',
          body: `<p>Where stories are crafted for generations &mdash; DEPMG's publishing imprint.</p>
          <p style="opacity:0.6; font-style:italic;">Not built into the Estate yet.</p>`,
        },
        shape: 'rect',
        coords: { left: 17.06, top: 70.6, width: 13.22, height: 28.32 },
        label: 'Twin Scales Publishing — II-305',
      },
      {
        action: {
          kind: 'panel',
          title: 'Algorhythm Design Studio',
          body: `<p>Design. Fashion. Culture. DEPMG's design studio.</p>
          <p style="opacity:0.6; font-style:italic;">Not built into the Estate yet.</p>`,
        },
        shape: 'rect',
        coords: { left: 31.05, top: 70.6, width: 12.11, height: 28.32 },
        label: 'Algorhythm Design Studio — II-306',
      },
      {
        action: {
          kind: 'panel',
          title: 'OMD Creative Studio',
          body: `<p>Visual storytelling &mdash; comics, motion, and everything in between.</p>
          <p style="opacity:0.6; font-style:italic;">Not built into the Estate yet.</p>`,
        },
        shape: 'rect',
        coords: { left: 43.95, top: 70.6, width: 12.04, height: 28.32 },
        label: 'OMD Creative Studio — II-307',
      },
      {
        action: {
          kind: 'panel',
          title: 'Podcast Studio',
          body: `<p>Voices that build ideas into impact.</p>
          <p style="opacity:0.6; font-style:italic;">Not built into the Estate yet.</p>`,
        },
        shape: 'rect',
        coords: { left: 56.19, top: 70.6, width: 11.85, height: 28.32 },
        label: 'Podcast Studio — II-308',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 69.01, top: 70.6, width: 12.37, height: 28.32 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 82.23, top: 70.6, width: 12.37, height: 28.32 },
        label: 'Floor Plan — A-202',
      },
    ],
    secretTrigger: null,
  },
  stub('d2-305-twinscales', 'II-305', 'Twin Scales Publishing', 'Executive, Brand & Media HQ'),
  stub('d2-306-algorhythm', 'II-306', 'Algorhythm Design Studio', 'Executive, Brand & Media HQ'),
  stub('d2-307-omd', 'II-307', 'OMD Creative Studio', 'Executive, Brand & Media HQ'),
  stub('d2-308-podcast', 'II-308', 'Podcast Studio', 'Executive, Brand & Media HQ'),
  stub('d2-309-creatorsuites', 'II-309', 'Creator Suites', 'Executive, Brand & Media HQ'),
  {
    id: 'creator-lounge',
    // Corrected from the earlier inventory stub's "Creator Collaboration
    // Lounge" to legacy's actual room-nav-title, now that the room's real
    // content has been extracted rather than guessed at inventory time.
    canonicalName: 'Creator Suites & Lounge',
    displayName: 'Creator Suites & Lounge',
    reference: 'II-309–310',
    district: 'II',
    wing: 'Executive, Brand & Media HQ',
    route: '/district-ii/creator-lounge',
    type: 'room',
    status: 'live',
    parent: null,
    // The one verified leaf-to-leaf relationship in the whole HQ branch:
    // legacy's creator-lounge render carries a real goTo('screening')
    // hotspot. Preserved exactly as built, including its asymmetry —
    // screening does NOT link back here, only to the hub.
    adjacentDestinations: ['hq-corridor', 'screening'],
    backTarget: 'hq-corridor',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.25, y: 0.75 } },
    backgroundAsset: '/d2/depmg-creator-lounge-bg.jpg',
    audioProfile: 'creator-lounge',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'hq-corridor' },
        shape: 'rect',
        coords: { left: 4.43, top: 70.6, width: 12.83, height: 28.03 },
        label: 'HQ Corridor — return to the hub',
      },
      {
        // Creator Suites (II-309) stays informational-only, matching
        // legacy's own "Not built into the Estate yet" disclaimer — not
        // promoted to a live room merely because its identity exists.
        action: {
          kind: 'panel',
          title: 'Creator Suites',
          body: `<p>Flexible creator workrooms for writers, artists, designers, producers, and guests.</p>
          <p style="opacity:0.6; font-style:italic;">Not built into the Estate yet.</p>`,
        },
        shape: 'rect',
        coords: { left: 18.36, top: 70.6, width: 13.54, height: 28.03 },
        label: 'Creator Suites — II-309',
      },
      {
        action: {
          kind: 'panel',
          title: 'Creator Lounge',
          body: `<p>The shared commons for collaboration across DEPMG's brands and disciplines &mdash; where ideas collide and creators build.</p>`,
        },
        shape: 'rect',
        coords: { left: 33.07, top: 70.6, width: 13.15, height: 28.03 },
        label: 'Creator Lounge — II-310',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 47.53, top: 70.6, width: 14, height: 28.03 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 62.37, top: 70.6, width: 14.13, height: 28.03 },
        label: 'Floor Plan — A-202',
      },
      {
        action: { kind: 'navigate', targetId: 'screening' },
        shape: 'rect',
        coords: { left: 77.47, top: 70.6, width: 14.26, height: 28.03 },
        label: 'Obsidian Screening Theater — II-311',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'screening',
    canonicalName: 'Obsidian Screening Theater',
    displayName: 'Obsidian Screening Theater',
    reference: 'II-311',
    district: 'II',
    wing: 'Executive, Brand & Media HQ',
    route: '/district-ii/screening',
    type: 'room',
    status: 'live',
    parent: null,
    // Asymmetric on purpose: creator-lounge links here, this room links
    // only back to the hub — preserved exactly as legacy built it.
    adjacentDestinations: ['hq-corridor'],
    backTarget: 'hq-corridor',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: { sheet: 'a202', marker: { x: 0.15, y: 0.92 } },
    backgroundAsset: '/d2/depmg-screening-bg.jpg',
    audioProfile: 'screening',
    capabilities: ['directory', 'floorplan'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'hq-corridor' },
        shape: 'rect',
        coords: { left: 0.52, top: 74.02, width: 11.98, height: 24.4 },
        label: 'HQ Corridor — return to the hub',
      },
      {
        action: {
          kind: 'panel',
          title: 'Now Screening',
          body: `<p>The Obsidian Screening Theater's reference-quality projection wall &mdash; rough cuts, private premieres, and OMD projects, screened the way they're meant to be seen.</p>
          <p style="opacity:0.6; font-style:italic;">A real screening schedule and content library will populate this panel once assembled.</p>`,
        },
        shape: 'rect',
        coords: { left: 13.67, top: 74.02, width: 11.91, height: 24.4 },
        label: 'Now Screening',
      },
      {
        action: {
          kind: 'panel',
          title: 'Theater Seating',
          body: `<p>Tiered, sightlined seating for roughly 20 to 30 guests &mdash; private and curated, not a commercial house.</p>`,
        },
        shape: 'rect',
        coords: { left: 26.76, top: 74.02, width: 11.65, height: 24.4 },
        label: 'Theater Seating',
      },
      {
        action: {
          kind: 'panel',
          title: 'Surround Sound',
          body: `<p>Immersive surround audio, engineered into the room's own architecture and acoustic treatment.</p>
          <p style="opacity:0.6; font-style:italic;">Exact system make and model are still being finalized and will be documented here once locked in.</p>`,
        },
        shape: 'rect',
        coords: { left: 38.54, top: 74.02, width: 11.91, height: 24.4 },
        label: 'Surround Sound',
      },
      {
        action: {
          kind: 'panel',
          title: 'Projection & Edit Suite',
          body: `<p>The projection, control and edit support room behind the seating &mdash; where the screening actually gets prepared.</p>
          <p style="opacity:0.6; font-style:italic;">Not a separately navigable room yet.</p>`,
        },
        shape: 'rect',
        coords: { left: 50.78, top: 74.02, width: 12.04, height: 24.4 },
        label: 'Projection & Edit Suite',
      },
      {
        action: { kind: 'capability', capability: 'directory' },
        shape: 'rect',
        coords: { left: 63.93, top: 74.02, width: 11.91, height: 24.4 },
        label: 'District II Directory',
      },
      {
        action: { kind: 'capability', capability: 'floorplan' },
        shape: 'rect',
        coords: { left: 77.02, top: 74.02, width: 12.04, height: 24.4 },
        label: 'Floor Plan — A-202',
      },
    ],
    secretTrigger: null,
  },
  stub('d2-312-admin', 'II-312', 'Administrative / Support Workspace', 'Executive, Brand & Media HQ'),
  stub('d2-313-cafe', 'II-313', 'Shared Café / Refreshment', 'Executive, Brand & Media HQ'),
  stub('d2-314-restrooms', 'II-314', 'Restrooms, Storage, Print / Reprographics', 'Executive, Brand & Media HQ'),

  // ═══════════════ DISTRICT III — GEMINI REFERENCE SLICE ═══════════════
  // Reception (admission) -> Gemini Main Floor (III-201, the district hub
  // equivalent) -> Gemini Core/Main Bar -> Constellation Mezzanine (III-601)
  // -> Mintaka, the first VIP lounge migrated. Every destination past
  // Reception carries admissionRequired: 'gemini-reception' — mirroring
  // legacy's own goTo('gemini') central intercept, which gates the whole
  // Gemini experience for every caller, not just the arrival hero. See
  // the reference-slice report for the full disclosure of what's in and
  // out of scope this pass (Alnilam, Alnitak, Piano/Vinyl/Cigar/Wine,
  // Main Performance Stage, Private Events, table/seat routing and
  // concierge features all stay out — represented as honest stubs/toasts).
  {
    id: 'gemini-reception',
    canonicalName: 'Gemini Reception',
    displayName: 'Gemini Reception',
    // No canon reference number was found in legacy source for Reception
    // itself (only III-201 Main Floor and III-601 Mezzanine are verified)
    // — left undefined rather than invented. See the reference-slice report.
    district: 'III',
    wing: 'Gemini Speakeasy',
    route: '/district-iii/reception',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['depmg', 'gemini-hall'],
    backTarget: 'depmg',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: null,
    backgroundAsset: '/d3/gemini-reception-bg.jpg',
    audioProfile: 'gemini-reception',
    capabilities: ['gemini-admission'],
    admissionConfig: {
      targetId: 'gemini-hall',
      eyebrow: 'Gemini Speakeasy · District III · Reception',
      motto: 'Access Level — Gemini.',
      // Ported verbatim from legacy's GEMINI_KEYS — real SHA-256 digests of
      // each month's real password, not placeholders. A password that
      // works in Estate 1.0 this month works here too.
      monthlyKeyHashes: [
        '4e2295dd929e424aa1afde7049924cb231f451c9884d7915ae33690b73b227ec',
        '0f0e99f465a65c3cb8a7514fa35714553fc70d91c948679dc7a91fb3d79e6a06',
        'ee8815ae059140259ea0be8c941b46fe94341c41ef92e1082caec869afc7935c',
        'd924695fc9dd29e99cd2946a1c3f2242456dd75623c169c952b5968249dc523f',
        '3bb68de60f56156655a2a70e606892edda3e2f2fc57b482bfe3ef1c5263db5b6',
        'f88594fcb8a375fd6d6dd9f78811ff6cd170a5e4d90acafd9f3559f7b2f983fb',
        '2cd15a3bcdabdb73a4a95873835e05aa225de16d7fdbe5eefddbb01a69e966e3',
        '3a183bb6464f5cebe1e6618ba2035d5282d240ad629ea82fb5302b760f8d03a2',
        '019a4a1edc7efb580e5e54763cf028dc33dc558814e80eeea80a602fa2f37319',
        'baf1f24970f312d4c98cd8138be1a8312817532fcd3d4b30a9feafe6789f864d',
        'c49fea7425fa7f8699897a97c159c6690267d9003bb78c53fafa8fc15c325d84',
        '05c8b1e5aab515703364c49f2a64d813e7cdaea34dc6a07b275801e7d32da074',
      ],
      // Ported verbatim from legacy's GEMINI_RHYTHM — cosmetic, never checked.
      monthlyRhythms: [
        [2, 4, 1, 3], [1, 3, 4, 2], [3, 1, 2, 4], [4, 2, 3, 1],
        [2, 3, 1, 4], [1, 4, 2, 3], [3, 2, 4, 1], [2, 4, 1, 3],
        [4, 1, 3, 2], [1, 2, 4, 3], [3, 4, 2, 1], [2, 1, 4, 3],
      ],
    },
    hotspots: [
      {
        action: { kind: 'capability', capability: 'gemini-admission' },
        shape: 'rect',
        coords: { left: 20.7, top: 86.5, width: 7.6, height: 18.5 },
        label: 'Enter Password',
      },
      {
        // Legacy's own doors card refuses entry the same way the password
        // card does when not yet admitted (rcRefuse), and passes straight
        // through without asking again once admitted (geminiAdmitted()) —
        // both converge on the identical isAdmitted() check GeminiAdmissionGate
        // already runs on open, so both hotspots share one capability trigger.
        action: { kind: 'capability', capability: 'gemini-admission' },
        shape: 'rect',
        coords: { left: 93.9, top: 87.7, width: 8.2, height: 20.5 },
        label: 'Enter Gemini Speakeasy',
      },
      {
        action: {
          kind: 'toast',
          message:
            'History of Gemini, Reservations & Concierge, Membership, Private Wine Lockers, Cigar Program, Tonight’s Entertainment, House Rules, VIP Elevator, Private Suites and the Grand Stair are all real cards in legacy Reception but are out of scope for this reference slice.',
        },
        shape: 'rect',
        coords: { left: 4.5, top: 86.5, width: 16, height: 18.5 },
        label: 'Reception Information',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'gemini-hall',
    canonicalName: 'Gemini Hall — Main Floor',
    displayName: 'Gemini Main Floor',
    reference: 'III-201',
    district: 'III',
    wing: 'Gemini Speakeasy',
    route: '/district-iii/main-floor',
    // NOT DestinationType 'hub' — that value is reserved for estate-hall's
    // own bespoke top-level screen (App.tsx routes it straight to <Hub/>,
    // bypassing RoomScene entirely). A hub-and-spoke room like this one,
    // same as District II's hq-corridor, is still type 'room' so it gets
    // a real background, hotspots and admission enforcement through
    // RoomScene/RoomRoute like everywhere else.
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['gemini-reception', 'gemini-bar', 'constellation-mezzanine', 'estate-hall'],
    backTarget: 'gemini-reception',
    admissionRequired: 'gemini-reception',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: null,
    backgroundAsset: '/d3/gemini-hall-bg.jpg',
    audioProfile: 'gemini-hall',
    capabilities: ['directory'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'constellation-mezzanine' },
        shape: 'rect',
        coords: { left: 50.0, top: 24.3, width: 17.5, height: 5.2 },
        label: 'VIP Mezzanine — III-601',
      },
      {
        action: { kind: 'toast', message: 'Main Performance Stage — tonight’s entertainment hasn’t migrated to Estate 2.0 yet.' },
        shape: 'rect',
        coords: { left: 50.0, top: 35.2, width: 17.5, height: 5.2 },
        label: 'Main Performance Stage',
      },
      {
        action: { kind: 'toast', message: 'Piano Lounge hasn’t migrated to Estate 2.0 yet.' },
        shape: 'rect',
        coords: { left: 17.3, top: 35.2, width: 15.5, height: 5.2 },
        label: 'Piano Lounge',
      },
      {
        action: { kind: 'toast', message: 'Vinyl Lounge hasn’t migrated to Estate 2.0 yet.' },
        shape: 'rect',
        coords: { left: 82.7, top: 35.2, width: 15.5, height: 5.2 },
        label: 'Vinyl Lounge',
      },
      {
        action: { kind: 'toast', message: 'Cigar & Whiskey hasn’t migrated to Estate 2.0 yet.' },
        shape: 'rect',
        coords: { left: 17.3, top: 59.5, width: 15.5, height: 4.8 },
        label: 'Cigar & Whiskey',
      },
      {
        action: { kind: 'toast', message: 'DEPMG Wine Bar hasn’t migrated to Estate 2.0 yet.' },
        shape: 'rect',
        coords: { left: 82.7, top: 59.5, width: 15.5, height: 4.8 },
        label: 'DEPMG Wine Bar',
      },
      {
        action: { kind: 'navigate', targetId: 'gemini-bar' },
        shape: 'rect',
        coords: { left: 50.0, top: 59.8, width: 16.5, height: 4.8 },
        label: 'Gemini Core — Center Bar',
      },
      {
        action: { kind: 'navigate', targetId: 'estate-hall' },
        shape: 'rect',
        coords: { left: 50.0, top: 73.5, width: 16.5, height: 4.8 },
        label: 'Gemini Doors — Return to the Estate',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'gemini-bar',
    canonicalName: 'Gemini Core — Main Bar',
    displayName: 'Gemini Main Bar',
    district: 'III',
    wing: 'Gemini Speakeasy',
    route: '/district-iii/gemini-bar',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['gemini-hall'],
    backTarget: 'gemini-hall',
    admissionRequired: 'gemini-reception',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: null,
    backgroundAsset: '/d3/gemini-bar-bg.jpg',
    audioProfile: 'gemini-bar',
    // 'ordering' alongside 'menu' documents that this room transacts, not
    // just browses — both render through the one GeminiMenu component;
    // see RoomScene's activateCapability and registry/commerce.ts.
    capabilities: ['directory', 'menu', 'ordering'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'gemini-hall' },
        shape: 'rect',
        coords: { left: 90.5, top: 6.0, width: 15.0, height: 8.0 },
        label: 'Return to Gemini Main Floor',
      },
      // The eight menu-category cards below all route to the identical
      // catalogue in legacy (gcAction: every 'menu'-tagged spot calls the
      // same openBar()) — preserved exactly, not forked into eight menus
      // that were never real in the source.
      {
        action: { kind: 'capability', capability: 'menu' },
        shape: 'rect',
        coords: { left: 7.0, top: 77.25, width: 12.0, height: 12.5 },
        label: 'Signature Cocktails',
      },
      {
        action: { kind: 'capability', capability: 'menu' },
        shape: 'rect',
        coords: { left: 19.0, top: 77.25, width: 12.0, height: 12.5 },
        label: 'Classics',
      },
      {
        action: { kind: 'capability', capability: 'menu' },
        shape: 'rect',
        coords: { left: 30.5, top: 77.25, width: 13.0, height: 12.5 },
        label: 'Whiskey & Bourbon',
      },
      {
        action: { kind: 'capability', capability: 'menu' },
        shape: 'rect',
        coords: { left: 42.0, top: 77.25, width: 11.0, height: 12.5 },
        label: 'Cognac',
      },
      {
        action: { kind: 'capability', capability: 'menu' },
        shape: 'rect',
        coords: { left: 52.0, top: 77.25, width: 11.0, height: 12.5 },
        label: 'Tequila & Mezcal',
      },
      {
        action: { kind: 'capability', capability: 'menu' },
        shape: 'rect',
        coords: { left: 63.5, top: 77.25, width: 13.0, height: 12.5 },
        label: 'Wine & Champagne',
      },
      {
        action: { kind: 'capability', capability: 'menu' },
        shape: 'rect',
        coords: { left: 75.0, top: 77.25, width: 11.0, height: 12.5 },
        label: 'Zero-Proof',
      },
      {
        action: { kind: 'capability', capability: 'menu' },
        shape: 'rect',
        coords: { left: 87.0, top: 77.25, width: 13.0, height: 12.5 },
        label: 'Small Bites',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'constellation-mezzanine',
    canonicalName: 'Constellation Mezzanine',
    displayName: 'Constellation Mezzanine',
    reference: 'III-601',
    district: 'III',
    wing: 'Gemini Speakeasy',
    route: '/district-iii/constellation-mezzanine',
    // Same reasoning as gemini-hall above: type 'room', not 'hub'.
    type: 'room',
    status: 'live',
    parent: null,
    // The real intermediate hop legacy uses between Main Floor and Mintaka
    // (Main Floor's 'vip' hotspot lands here, not on Mintaka directly) —
    // preserved as a real 2-hop structure rather than a fabricated
    // shortcut edge. See the reference-slice report.
    adjacentDestinations: ['gemini-hall', 'mintaka'],
    backTarget: 'gemini-hall',
    admissionRequired: 'gemini-reception',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: null,
    backgroundAsset: '/d3/constellation-mezzanine-bg.jpg',
    audioProfile: 'constellation-mezzanine',
    capabilities: ['directory'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'estate-hall' },
        shape: 'rect',
        coords: { left: 86.5, top: 6.2, width: 18.0, height: 7.5 },
        label: 'Constellation Doors — Reception & Estate Return',
      },
      {
        action: { kind: 'navigate', targetId: 'mintaka' },
        shape: 'rect',
        coords: { left: 17.0, top: 24.8, width: 15.0, height: 11.5 },
        label: 'Mintaka — West VIP Lounge',
      },
      {
        action: { kind: 'toast', message: 'Alnilam — Center VIP Lounge hasn’t migrated to Estate 2.0 yet.' },
        shape: 'rect',
        coords: { left: 50.0, top: 24.0, width: 16.0, height: 11.5 },
        label: 'Alnilam — Center VIP Lounge',
      },
      {
        action: { kind: 'toast', message: 'Alnitak — East VIP Lounge hasn’t migrated to Estate 2.0 yet.' },
        shape: 'rect',
        coords: { left: 83.5, top: 24.8, width: 15.0, height: 11.5 },
        label: 'Alnitak — East VIP Lounge',
      },
      {
        action: { kind: 'navigate', targetId: 'gemini-bar' },
        shape: 'rect',
        coords: { left: 50.0, top: 60.8, width: 18.0, height: 10.0 },
        label: 'Celestial Overlook — View Gemini Core Performance Floor Below',
      },
      {
        action: { kind: 'toast', message: 'Tonight’s Performance stage view hasn’t migrated to Estate 2.0 yet.' },
        shape: 'rect',
        coords: { left: 50.0, top: 74.2, width: 18.0, height: 11.0 },
        label: 'Stage Overlook — Tonight’s Performance',
      },
      {
        action: {
          kind: 'panel',
          title: 'VIP Elevator',
          body: `<p>The private elevator connects the Constellation Mezzanine to every reserved level above Gemini Speakeasy — the VIP lounges, and the Estate's private suites beyond them.</p>
          <p>Access is by badge, or by the desk's own recognition. Ask your host if you're unsure where a level leads.</p>`,
        },
        shape: 'rect',
        coords: { left: 15.5, top: 69.0, width: 17.0, height: 6.0 },
        label: 'VIP Elevator — To All Levels',
      },
      {
        action: {
          kind: 'panel',
          title: 'Grand Stair',
          body: `<p>A private stair for guests who'd rather feel the climb than wait for the elevator — connecting the mezzanine down through the Estate's other levels.</p>`,
        },
        shape: 'rect',
        coords: { left: 85.5, top: 69.0, width: 17.0, height: 6.0 },
        label: 'Grand Stair — To Estate Levels',
      },
    ],
    secretTrigger: null,
  },
  {
    id: 'mintaka',
    canonicalName: 'Mintaka — West VIP Lounge',
    displayName: 'Mintaka',
    district: 'III',
    wing: 'Gemini Speakeasy',
    route: '/district-iii/mintaka',
    type: 'room',
    status: 'live',
    parent: null,
    adjacentDestinations: ['constellation-mezzanine', 'gemini-bar'],
    backTarget: 'constellation-mezzanine',
    admissionRequired: 'gemini-reception',
    explorerVisibility: true,
    globalNavVisibility: false,
    directoryVisibility: true,
    floorPlanRef: null,
    backgroundAsset: '/d3/mintaka-bg.jpg',
    audioProfile: 'mintaka',
    capabilities: ['directory', 'menu', 'ordering'],
    hotspots: [
      {
        action: { kind: 'navigate', targetId: 'gemini-bar' },
        shape: 'rect',
        coords: { left: 9.0, top: 49.0, width: 13.0, height: 4.5 },
        label: 'Gemini Core',
      },
      {
        // Both route to openBar() in legacy — the identical Gemini Core
        // catalogue, not a separate Mintaka menu. Same GeminiMenu overlay,
        // fulfillmentContext: 'mintaka' instead of 'gemini-bar' — that
        // difference alone is what makes the order land at MINTAKA · LOUNGE
        // DELIVERY instead of GEMINI MAIN BAR · BAR PICKUP.
        action: { kind: 'capability', capability: 'menu' },
        shape: 'rect',
        coords: { left: 9.0, top: 58.5, width: 13.0, height: 4.0 },
        label: 'Cocktail Menu',
      },
      {
        action: { kind: 'capability', capability: 'menu' },
        shape: 'rect',
        coords: { left: 9.0, top: 65.5, width: 13.0, height: 4.0 },
        label: 'Small Bites Menu',
      },
      {
        action: { kind: 'capability', capability: 'ordering' },
        shape: 'rect',
        coords: { left: 10.0, top: 71.5, width: 15.0, height: 4.0 },
        label: 'Current Order',
      },
      {
        action: { kind: 'toast', message: 'Cigar & Whiskey hasn’t migrated to Estate 2.0 yet.' },
        shape: 'rect',
        coords: { left: 23.5, top: 47.5, width: 15.0, height: 4.5 },
        label: 'Cigar & Whiskey',
      },
      {
        action: { kind: 'toast', message: 'DEPMG Wine Bar hasn’t migrated to Estate 2.0 yet.' },
        shape: 'rect',
        coords: { left: 37.5, top: 47.5, width: 15.0, height: 4.5 },
        label: 'DEPMG Wine Bar',
      },
      {
        // Table/seat routing and concierge features (Request Service,
        // Lounge Controls, Request Valet) are real in legacy Mintaka but
        // were out of scope for this reference slice — see the report.
        action: { kind: 'toast', message: 'Request Service isn’t part of this reference slice yet.' },
        shape: 'rect',
        coords: { left: 25.0, top: 71.5, width: 15.0, height: 4.0 },
        label: 'Request Service',
      },
      {
        action: { kind: 'toast', message: 'Lounge Controls aren’t part of this reference slice yet.' },
        shape: 'rect',
        coords: { left: 38.0, top: 66.5, width: 15.0, height: 4.0 },
        label: 'Lounge Controls',
      },
      {
        action: { kind: 'toast', message: 'Privacy & Lighting controls aren’t part of this reference slice yet.' },
        shape: 'rect',
        coords: { left: 81.5, top: 82.2, width: 20.0, height: 4.5 },
        label: 'Privacy Control & Lighting',
      },
      {
        action: { kind: 'toast', message: 'Request Valet isn’t part of this reference slice yet.' },
        shape: 'rect',
        coords: { left: 81.5, top: 91.7, width: 20.0, height: 4.5 },
        label: 'Request Valet',
      },
    ],
    secretTrigger: null,
  },
  // ─── Out of scope this pass — Directory completeness only ───
  stub('d3-piano', '', 'Piano Lounge', 'Gemini Speakeasy', 'room', 'III'),
  stub('d3-vinyl', '', 'Vinyl Lounge', 'Gemini Speakeasy', 'room', 'III'),
  stub('d3-cigar-whiskey', '', 'Cigar & Whiskey', 'Gemini Speakeasy', 'room', 'III'),
  stub('d3-wine-bar', '', 'DEPMG Wine Bar', 'Gemini Speakeasy', 'room', 'III'),
  stub('d3-stage', '', 'Main Performance Stage', 'Gemini Speakeasy', 'room', 'III'),
  stub('d3-private-events', '', 'Private Events', 'Gemini Speakeasy', 'room', 'III'),
  stub('d3-alnilam', '', 'Alnilam — Center VIP Lounge', 'Gemini Speakeasy', 'room', 'III'),
  stub('d3-alnitak', '', 'Alnitak — East VIP Lounge', 'Gemini Speakeasy', 'room', 'III'),
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
  type: 'room' | 'overlay' = 'room',
  district: District = 'II'
): Destination {
  return {
    id,
    canonicalName,
    displayName: canonicalName,
    reference: reference || undefined,
    district,
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
