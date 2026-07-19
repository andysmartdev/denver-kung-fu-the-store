'use strict';

/*
 * optimize-images.js — Denver Kung Fu · The Jong
 *
 * Reads source photos from assets-src/ and writes ONE web-optimized WebP per
 * image into public/assets/ with a deterministic, lowercase filename.
 *
 * Deploy stays fully static: this runs at author time, outputs are committed.
 *
 * Adding new images:
 *   1. Drop the file in assets-src/
 *   2. Add an entry to MAP below (or let it fall through to the DEFAULT profile)
 *   3. npm run optimize
 *
 * Profiles cap width + tune quality by role so nothing oversized ships:
 *   - fullbleed: hero / background images   → ~1920px, ≤ ~250 KB target
 *   - inline:    gallery / in-content <img> → ~1600px, ≤ ~150 KB target
 */

const path = require('path');
const fs   = require('fs');
const sharp = require('sharp');

const SRC_DIR = path.join(__dirname, '..', 'assets-src');
const OUT_DIR = path.join(__dirname, '..', 'public', 'assets');

const PROFILES = {
  fullbleed: { maxWidth: 1920, quality: 76 },
  inline:    { maxWidth: 1600, quality: 68 },
  // Shown only as a heavily-darkened overlay (opacity ~0.18) — quality can be low.
  overlay:   { maxWidth: 1600, quality: 55 },
};

// Explicit source → output-name + profile mapping.
// Keeps output names stable and lowercase regardless of messy source casing.
const MAP = {
  'JongWall_wide.JPEG':   { out: 'jongwall-wide',   profile: 'fullbleed' },
  'JongWall_narrow.JPEG': { out: 'jongwall-narrow', profile: 'overlay' },
  'Jong_1.JPEG':          { out: 'jong-1',          profile: 'inline' },
  'Jong_2.JPEG':          { out: 'jong-2',          profile: 'inline' },
  'Jong_3.JPEG':          { out: 'jong-3',          profile: 'inline' },
  'Jong_4.JPEG':          { out: 'jong-4',          profile: 'inline' },
  'Jong_5.JPEG':          { out: 'jong-5',          profile: 'inline' },
  'Jong_6.JPEG':          { out: 'jong-6',          profile: 'inline' },
};

// Any source file not in MAP gets this treatment (lowercased basename, inline).
const DEFAULT_PROFILE = 'inline';

function outNameFor(srcFile) {
  if (MAP[srcFile]) return MAP[srcFile];
  const base = path.parse(srcFile).name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return { out: base, profile: DEFAULT_PROFILE };
}

async function run() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Source dir not found: ${SRC_DIR}`);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const sources = fs.readdirSync(SRC_DIR)
    .filter(f => /\.(jpe?g|png|webp|tif?f)$/i.test(f));

  if (!sources.length) {
    console.log('No source images found in assets-src/.');
    return;
  }

  console.log(`Optimizing ${sources.length} image(s) → ${path.relative(process.cwd(), OUT_DIR)}\n`);

  let totalOut = 0;
  for (const srcFile of sources) {
    const { out, profile } = outNameFor(srcFile);
    const cfg = PROFILES[profile] || PROFILES[DEFAULT_PROFILE];
    const srcPath = path.join(SRC_DIR, srcFile);
    const outPath = path.join(OUT_DIR, `${out}.webp`);

    const image = sharp(srcPath).rotate(); // respect EXIF orientation
    const meta = await image.metadata();
    const targetW = Math.min(cfg.maxWidth, meta.width || cfg.maxWidth);

    await image
      .resize({ width: targetW, withoutEnlargement: true })
      .webp({ quality: cfg.quality })
      .toFile(outPath);

    const kb = fs.statSync(outPath).size / 1024;
    totalOut += kb;
    const srcKb = fs.statSync(srcPath).size / 1024;
    console.log(
      `  ${srcFile.padEnd(22)} → ${out}.webp`.padEnd(48) +
      `${targetW}w  ${srcKb.toFixed(0)}KB → ${kb.toFixed(0)}KB  [${profile}]`
    );
  }
  console.log(`\nDone. Total optimized output: ${(totalOut / 1024).toFixed(2)} MB`);
}

run().catch(err => {
  console.error('optimize-images failed:', err.message);
  process.exit(1);
});
