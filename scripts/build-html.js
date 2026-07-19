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

const PUBLIC = path.join(__dirname, '..', 'public');
const SRC  = path.join(__dirname, '..', 'src', 'index.html');
const OUT  = path.join(PUBLIC, 'index.html');
const ORIGIN = config.site.origin.replace(/\/+$/, ''); // no trailing slash

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

// Build the JSON-LD @graph: Organization + Product + WebSite/WebPage.
// Invisible to visitors; consumed by Google rich results + AI answer engines.
function renderJsonLd() {
  const seo = config.seo;
  const url = ORIGIN + '/';
  const img = `${ORIGIN}/${config.meta.ogImage}`;

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': `${ORIGIN}/#business`,
        name: config.site.name,
        url,
        email: config.email,
        image: img,
        logo: `${ORIGIN}/assets/favicon.webp`,
        priceRange: seo.priceRange,
        areaServed: seo.areaServed.map(name => ({ '@type': 'AdministrativeArea', name })),
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Denver',
          addressRegion: 'CO',
          addressCountry: 'US',
        },
        sameAs: [seo.schoolUrl],
        founder: { '@type': 'Person', name: seo.maker },
      },
      {
        '@type': 'Product',
        '@id': `${ORIGIN}/#product`,
        name: 'Handcrafted Muk Yan Jong (Wing Chun Wooden Dummy)',
        alternateName: ['Wing Chun Wooden Dummy', 'Ving Tsun Wooden Dummy', 'Mook Jong', 'Muk Yan Jong'],
        description:
          'Handcrafted Wing Chun / Ving Tsun wooden dummy (Muk Yan Jong), made to order in Denver, Colorado. Solid ash body sourced from local arborists, hand-finished with tung oil; custom oak framing available.',
        image: img,
        material: ['Ash', 'Oak'],
        brand: { '@id': `${ORIGIN}/#business` },
        category: 'Martial Arts Training Equipment',
        isRelatedTo: seo.lineageSameAs,
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/MadeToOrder',
          priceCurrency: 'USD',
          seller: { '@id': `${ORIGIN}/#business` },
          url,
          areaServed: 'US',
        },
        manufacturer: { '@type': 'Person', name: seo.maker },
      },
      {
        '@type': 'WebSite',
        '@id': `${ORIGIN}/#website`,
        url,
        name: config.site.name,
        publisher: { '@id': `${ORIGIN}/#business` },
        inLanguage: 'en',
        about: seo.lineageSameAs.map(id => ({ '@id': id })),
      },
    ],
  };

  return `<script type="application/ld+json">\n${JSON.stringify(graph, null, 2)}\n</script>`;
}

// Emit SEO sidecar files into public/: robots.txt, sitemap.xml, llms.txt.
function writeSeoFiles() {
  const robots = `# robots.txt — ${config.site.name}
User-agent: *
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${ORIGIN}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

  // llms.txt — emerging convention (2025-26) giving AI crawlers a clean summary.
  const llms = `# ${config.site.name}

> Handcrafted Wing Chun / Ving Tsun wooden dummies (Muk Yan Jong / mook jong) for sale,
> made to order in Denver, Colorado by Mike Kilcoyne of Denver Kung Fu (Moy Tung lineage).

## Product
- Product: Muk Yan Jong (wooden dummy) for Wing Chun / Ving Tsun kung fu training.
- Body: solid ash, sourced locally from Denver-area arborists.
- Finish: hand-applied tung oil.
- Framing: custom oak framing available.
- Availability: made to order, one at a time.
- Location: Denver, Colorado, United States.
- Contact: ${config.email}

## Links
- Home: ${ORIGIN}/
- Denver Kung Fu (school): ${config.seo.schoolUrl}
`;

  fs.writeFileSync(path.join(PUBLIC, 'robots.txt'), robots);
  fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), sitemap);
  fs.writeFileSync(path.join(PUBLIC, 'llms.txt'), llms);
  console.log('Wrote robots.txt, sitemap.xml, llms.txt');
}

function build() {
  if (!fs.existsSync(SRC)) {
    console.error(`Template not found: ${SRC}`);
    process.exit(1);
  }
  let html = fs.readFileSync(SRC, 'utf8');

  // 1. Render the video grid block: {{@videos}} → both tiles (global: any occurrence).
  html = html.replaceAll('{{@videos}}', config.videos.map(renderVideoTile).join('\n\n'));

  // 1b. Render the JSON-LD structured data block.
  html = html.replaceAll('{{@jsonld}}', renderJsonLd());

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

  writeSeoFiles();
}

try {
  build();
} catch (err) {
  console.error('build-html failed:', err.message);
  process.exit(1);
}
