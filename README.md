# The Obsidian Estate — rsfrazier.com

The live site: one continuous explorable world for R.S. Frazier — the
music, the books, the magazine, the clothing line, Gemini Speakeasy,
and the Estate itself.

## What's here

```
index.html          the live site (source of truth)
assets/renders/     new room art, canon-checked
assets/video/       arrival and secret-entrance films
assets/crest/       the canonical RSF shield
prototype/          earlier cinematic shell — reference only, not deployed
netlify.toml        publish config + functions dir
```

The live site expects `assets/images/`, `assets/cards/`, and
`assets/audio/` (~90 files) plus the `estate-ai` Netlify function.
Those live in the deployed site and are not yet mirrored in this repo.

## New art awaiting integration

Produced and canon-checked in this branch, not yet wired into
`index.html`:

| File | Room | Notes |
|---|---|---|
| `assets/renders/security-gate-closed.png` / `-open.png` | Entrance | matched pair, same camera |
| `assets/renders/founders-way.png` | **missing room** | RSF crests composited to canon |
| `assets/renders/legacy-circle.png` | **missing room** | OE crest correct as generated |
| `assets/renders/fountain-court.png` | **missing room** | doors open onto the atrium |
| `assets/renders/grand-atrium.png` | `atrium` | baked wayfinding markers |
| `assets/renders/library.png` | `library` | baked markers incl. Discover More |
| `assets/renders/onyx-lounge.png` | `onyx` | 2.5:1 panorama, signage = navigation |
| `assets/renders/cutscene-book.png` | Library cutscene | the book-reach still |
| `assets/video/arrival-film.mp4` | Entrance | 15 s, gates → drive → aerial reveal |
| `assets/video/gate-opening.mp4` | Entrance | 10 s, portrait |
| `assets/video/secret-entrance.mp4` | Library → Gemini | the full discovery |

### The canonical arrival gap

The Canon Update Brief locks this sequence:

> Security Gate → Founder's Way → Legacy Circle → Central Fountain
> Court → Grand Atrium → Onyx Lounge → …

The live site currently goes **entrance → hall**, so Founder's Way,
Legacy Circle, and the Central Fountain Court do not exist as rooms
yet. All three are rendered and ready to add.

## The RSF crest

Never redrawn. `assets/crest/rsf-shield.png` is the canonical asset;
where a render arrived with the wrong letterform, the real asset was
composited in rather than regenerated.

Mark convention observed so far: **OE** on the perimeter and the
building itself (institution), **RSF** on the founder's ground and in
his rooms. Worth a Canon Keeper ruling so future renders are
unambiguous.

## Clickable preview

`prototype/preview.html` is the prototype packaged as one self-contained
file — fonts, renders, and the discovery film all inlined, no network
required. Rebuilt by hand when the prototype changes; not part of the
deploy.

## The GEMINI door film

`playDoorSequence()` in `index.html` looks for:

```
assets/video/gemini-doors.mp4
```

Drop a film there and it plays in place of the hinged still — no code
change needed. Nothing else has to match: the promise settles either
way, so a missing, unplayable, or stalled film always falls back to the
CSS swing rather than stranding a guest at the threshold.

Suggested cut, matching what the still does now: doors shut · a latch ·
light finding the seam · both leaves swinging inward · the room's warmth
and music arriving. Portrait or landscape both work (the stage is
`object-fit: contain`).
