#!/usr/bin/env python3
"""
Extract base64-embedded media from a single-file HTML into real asset files.

A 48 MB index.html is one where every image, sound, and video is pasted
into the HTML as a data: URI. This pulls them back out into
assets/images, assets/audio, assets/video, rewrites the HTML to point at
them, and leaves the original untouched.

    python3 tools/extract-assets.py index.html

Writes index.clean.html plus an assets/ tree next to the input, and
prints a manifest. Nothing is overwritten: if a target file exists with
different content, a numbered name is used instead.

If a slimmed copy of the same page already exists — one where the data:
URIs were swapped for paths like assets/images/img-the-library.jpg but
the files were never actually written — point at it to reuse those
readable names:

    python3 tools/extract-assets.py index.html --names-from index_6.html

Media is then written under the names that copy expects, in document
order and matched by kind, so the slim file starts working as-is.
Counts must line up or nothing is written, unless --force is given.
"""

import argparse
import base64
import binascii
import hashlib
import pathlib
import re
import sys

EXT = {
    "image/jpeg": "jpg", "image/jpg": "jpg", "image/pjpeg": "jpg",
    "image/png": "png", "image/gif": "gif", "image/webp": "webp",
    "image/avif": "avif", "image/svg+xml": "svg", "image/x-icon": "ico",
    "image/vnd.microsoft.icon": "ico", "image/bmp": "bmp", "image/tiff": "tif",
    "audio/mpeg": "mp3", "audio/mp3": "mp3", "audio/wav": "wav",
    "audio/x-wav": "wav", "audio/ogg": "ogg", "audio/webm": "weba",
    "audio/aac": "aac", "audio/mp4": "m4a",
    "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov",
    "font/woff": "woff", "font/woff2": "woff2", "font/ttf": "ttf",
    "application/font-woff": "woff", "application/font-woff2": "woff2",
}

FOLDER = {"image": "images", "audio": "audio", "video": "video", "font": "fonts"}

# data:<mime>;base64,<payload> — payload runs until the first character
# that cannot be base64, which ends it correctly inside both quoted HTML
# attributes and CSS url(...).
PATTERN = re.compile(
    r"data:([a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]*/[a-zA-Z0-9!#$&^_.+-]+)"
    r"\s*;\s*base64\s*,\s*([A-Za-z0-9+/=\s]+)"
)


# asset paths referenced by a slimmed copy, e.g. assets/images/img-foo.jpg
REF_PATTERN = re.compile(
    r"""(?:src|href)\s*=\s*["']([^"']*?assets/[^"']+)["']"""
    r"""|url\(\s*["']?([^"')]*?assets/[^"')]+)["']?\s*\)""",
    re.IGNORECASE)

KIND_BY_FOLDER = {
    "images": "image", "cards": "image", "img": "image", "photos": "image",
    "audio": "audio", "sounds": "audio", "music": "audio",
    "video": "video", "videos": "video", "fonts": "font",
}


def ordered_unique(seq):
    seen, out = set(), []
    for item in seq:
        if item not in seen:
            seen.add(item)
            out.append(item)
    return out


def names_from(path):
    """Ordered unique asset paths in a slim copy, bucketed by media kind."""
    text = pathlib.Path(path).read_text(encoding="utf-8", errors="surrogatepass")
    refs = [(a or b) for a, b in REF_PATTERN.findall(text)]
    buckets = {}
    for ref in ordered_unique(refs):
        clean = ref.split("?", 1)[0].split("#", 1)[0].lstrip("./")
        parts = clean.split("/")
        folder = parts[-2].lower() if len(parts) >= 2 else ""
        kind = KIND_BY_FOLDER.get(folder)
        if kind is None:
            ext = clean.rsplit(".", 1)[-1].lower() if "." in clean else ""
            kind = ("audio" if ext in {"mp3", "wav", "ogg", "m4a", "aac"}
                    else "video" if ext in {"mp4", "webm", "mov"}
                    else "image")
        buckets.setdefault(kind, []).append(clean)
    return buckets


def human(n):
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:.0f} {unit}" if unit == "B" else f"{n/1:.1f} {unit}"
        n /= 1024.0


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("html", help="the single-file HTML to extract from")
    ap.add_argument("-o", "--out", help="output HTML (default: <name>.clean.html)")
    ap.add_argument("--assets", default="assets",
                    help="asset directory to create (default: assets)")
    ap.add_argument("--min-bytes", type=int, default=2048,
                    help="leave anything smaller than this inline (default: 2048)")
    ap.add_argument("--names-from", metavar="SLIM_HTML",
                    help="reuse the asset names a slimmed copy already expects")
    ap.add_argument("--force", action="store_true",
                    help="write even if --names-from counts do not line up")
    args = ap.parse_args()

    src = pathlib.Path(args.html)
    if not src.is_file():
        sys.exit(f"not a file: {src}")

    root = src.parent
    out = pathlib.Path(args.out) if args.out else root / (src.stem + ".clean.html")
    assets_root = root / args.assets

    html = src.read_text(encoding="utf-8", errors="surrogatepass")
    original_size = len(html.encode("utf-8", errors="surrogatepass"))

    by_digest = {}      # sha1 -> relative path already written
    counters = {}       # folder -> next number
    manifest = []
    skipped_small = 0
    failed = 0
    planned = {}        # sha1 -> relative path a slim copy already expects

    if args.names_from:
        # Survey the embedded media first, in document order, so it can be
        # lined up against the names the slim copy is already asking for.
        found = []
        for mime, payload in PATTERN.findall(html):
            try:
                blob = base64.b64decode(re.sub(r"\s+", "", payload), validate=True)
            except (binascii.Error, ValueError):
                continue
            if len(blob) < args.min_bytes:
                continue
            found.append((hashlib.sha1(blob).hexdigest(), mime.lower().split("/", 1)[0]))

        embedded = {}
        for digest, kind in ordered_unique(found):
            embedded.setdefault(kind, []).append(digest)

        wanted = names_from(args.names_from)
        mismatch = False
        for kind in sorted(set(embedded) | set(wanted)):
            have, want = len(embedded.get(kind, [])), len(wanted.get(kind, []))
            flag = "" if have == want else "   <-- does not line up"
            print(f"{kind:>6}: {have} embedded, {want} expected by "
                  f"{pathlib.Path(args.names_from).name}{flag}")
            if have != want:
                mismatch = True

        if mismatch and not args.force:
            sys.exit(
                "\nCounts differ, so pairing them by order would misname files.\n"
                "Nothing was written. Run without --names-from for safe generic\n"
                "names, or add --force to pair as far as the lists agree.")

        for kind, digests in embedded.items():
            for digest, rel in zip(digests, wanted.get(kind, [])):
                planned[digest] = rel
        print()

    def replace(match):
        nonlocal skipped_small, failed
        mime = match.group(1).lower()
        payload = re.sub(r"\s+", "", match.group(2))
        try:
            blob = base64.b64decode(payload, validate=True)
        except (binascii.Error, ValueError):
            failed += 1
            return match.group(0)

        if len(blob) < args.min_bytes:
            skipped_small += 1
            return match.group(0)

        digest = hashlib.sha1(blob).hexdigest()
        if digest in by_digest:
            return by_digest[digest]

        kind = mime.split("/", 1)[0]
        folder = FOLDER.get(kind, "media")
        ext = EXT.get(mime, kind if kind else "bin")

        if digest in planned:
            # the name a slimmed copy of this page already expects
            rel = planned[digest]
            target = root / rel
            target.parent.mkdir(parents=True, exist_ok=True)
        else:
            counters[folder] = counters.get(folder, 0) + 1
            stem = {"images": "img", "audio": "audio", "video": "video",
                    "fonts": "font"}.get(folder, "file")
            target_dir = assets_root / folder
            target_dir.mkdir(parents=True, exist_ok=True)

            name = f"{stem}-{counters[folder]:03d}.{ext}"
            target = target_dir / name
            # never clobber something different that is already there
            while target.exists() and hashlib.sha1(target.read_bytes()).hexdigest() != digest:
                counters[folder] += 1
                name = f"{stem}-{counters[folder]:03d}.{ext}"
                target = target_dir / name
            rel = f"{args.assets}/{folder}/{name}"

        target.write_bytes(blob)
        by_digest[digest] = rel
        manifest.append((rel, len(blob), mime))
        return rel

    cleaned = PATTERN.sub(replace, html)
    out.write_text(cleaned, encoding="utf-8", errors="surrogatepass")
    new_size = len(cleaned.encode("utf-8", errors="surrogatepass"))

    extracted_bytes = sum(size for _, size, _ in manifest)
    print(f"read    {src}  ({human(original_size)})")
    print(f"wrote   {out}  ({human(new_size)})")
    print(f"assets  {len(manifest)} files, {human(extracted_bytes)} total, "
          f"into {assets_root}/")
    if skipped_small:
        print(f"        {skipped_small} left inline (under {args.min_bytes} bytes)")
    if failed:
        print(f"        {failed} could not be decoded and were left alone")
    if new_size and original_size:
        print(f"        HTML is now {100 * new_size / original_size:.1f}% "
              f"of its original size")

    if manifest:
        listing = assets_root / "MANIFEST.txt"
        listing.write_text(
            "\n".join(f"{rel}\t{size}\t{mime}" for rel, size, mime in manifest) + "\n",
            encoding="utf-8")
        print(f"        manifest written to {listing}")
        print()
        print("largest extracted:")
        for rel, size, _ in sorted(manifest, key=lambda m: -m[1])[:8]:
            print(f"  {human(size):>9}  {rel}")


if __name__ == "__main__":
    main()
