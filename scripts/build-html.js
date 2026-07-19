'use strict';

/*
 * build-html.js — stamp site.config.js values into the HTML template.
 *
 *   src/index.html   (template, with {{placeholders}})  ── build ──▶  public/index.html  (generated, static)
 *
 * Substitution is intentionally dumb: {{dot.path}} → config value (scalar).
 * No loops/conditionals in the template syntax — the only repeated block is
 * the video grid, rendered here in code from config.videos. This keeps the
 * template readable (what-you-see-is-what-ships) and the tooling tiny.
 *
 * The build FAILS LOUDLY if any {{placeholder}} is left unresolved, so a
 * typo can never ship a literal "{{phone.display}}" to the page.
 */

const path = require('path');
const fs   = require('fs');
const config = require('../site.config.js');

const SRC  = path.join(__dirname, '..', 'src', 'index.html');
const OUT  = path.join(__dirname, '..', 'public', 'index.html');

// Resolve a dot-path like "phone.display" against the config object.
function resolve(obj, dotPath) {
  return dotPath.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

// Escape a string for safe use inside a single-quoted CSS url('...') / HTML attr.
function attr(s) {
  return String(s).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}

// Render one video tile from a config.videos entry.
function renderVideoTile(v) {
  const note = v.note
    ? `\n            <span class="video-tile__note">${v.note}</span>`
    : '';
  return `        <button type="button" class="video-tile fade-in" data-src="${attr(v.src)}" aria-label="${attr(v.ariaLabel)}">
          <span class="video-tile__poster" style="background-image:url('${attr(v.poster)}')" aria-hidden="true"></span>
          <span class="video-tile__overlay" aria-hidden="true"></span>
          <span class="video-tile__play" aria-hidden="true">▶</span>
          <span class="video-tile__meta">
            <span class="video-tile__kicker">${v.kicker}</span>
            <span class="video-tile__title">${v.title}</span>${note}
          </span>
        </button>`;
}

function build() {
  if (!fs.existsSync(SRC)) {
    console.error(`Template not found: ${SRC}`);
    process.exit(1);
  }
  let html = fs.readFileSync(SRC, 'utf8');

  // 1. Render the video grid block: {{@videos}} → both tiles (global: any occurrence).
  html = html.replaceAll('{{@videos}}', config.videos.map(renderVideoTile).join('\n\n'));

  // 2. Scalar substitution: {{dot.path}} → value.
  html = html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, dotPath) => {
    const val = resolve(config, dotPath);
    if (val === undefined) {
      throw new Error(`Unresolved placeholder ${match} — no config value at "${dotPath}"`);
    }
    return String(val);
  });

  // 3. Safety net: no {{...}} may survive into the output.
  const leftover = html.match(/\{\{[^}]*\}\}/g);
  if (leftover) {
    throw new Error(`Build produced unresolved placeholders: ${leftover.join(', ')}`);
  }

  fs.writeFileSync(OUT, html);
  console.log(`Built ${path.relative(process.cwd(), OUT)} from template + site.config.js`);
}

try {
  build();
} catch (err) {
  console.error('build-html failed:', err.message);
  process.exit(1);
}
