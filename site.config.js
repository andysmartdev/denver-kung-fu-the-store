'use strict';

/*
 * site.config.js — single source of truth for site content.
 *
 * Edit values HERE, then run `npm run build`. The build stamps them into
 * public/index.html (a generated file). This is a BUILD-TIME step: the
 * deployed page is plain static HTML, fully crawlable — no runtime JS is
 * required to show the email, etc.
 *
 * Values are inserted as raw HTML (they are authored here by us, not by
 * visitors), so limited inline HTML like <br> is allowed in text fields.
 */

module.exports = {
  // Canonical site origin — single source of truth for absolute URLs (canonical,
  // og:image, sitemap, robots, JSON-LD). No trailing slash.
  site: {
    origin: 'https://www.denverkungfu-jongs.com',
    name:   'Denver Kung Fu Jongs',
  },

  // Contact is email-only for now (phone removed at Sifu's request 2026-07-19).
  email: 'admin@denverkungfu.com',
  emailHref: 'mailto:admin@denverkungfu.com',
  emailCta: 'Email Us',       // short label for the nav + hero buttons

  year: 2026,

  // <head> metadata. NOTE: title/description are SERP text (search results +
  // social), NOT visible page copy — safe to keyword-optimize without changing
  // the approved page. Both spellings (Wing Chun / Ving Tsun) + "wooden dummy" +
  // "for sale" intent are woven in for search coverage.
  meta: {
    title:       'Wing Chun Wooden Dummy for Sale — Handcrafted Muk Yan Jong | Denver, CO',
    description: 'Handcrafted Wing Chun / Ving Tsun wooden dummies (Muk Yan Jong) for sale, made to order in Denver, Colorado. Solid ash, hand-finished with tung oil, custom oak framing available. Email to inquire.',
    ogTitle:     'Wing Chun Wooden Dummy (Muk Yan Jong) — Handcrafted in Denver',
    ogDescription: 'Authentic Wing Chun / Ving Tsun wooden dummies, handcrafted from solid ash in Denver, Colorado. Made to order in the Moy Tung Kung Fu family tradition.',
    ogImage:     'assets/wing-chun-wooden-dummy-full.webp',
    keywordsNote: 'Google ignores meta keywords; intentionally omitted.',
  },

  // Structured data / entity SEO. sameAs ties the page to high-authority
  // entities (Wikipedia) for topical relevance — invisible to visitors.
  seo: {
    priceRange: '$$$',
    areaServed: ['Denver', 'Colorado', 'United States'],
    // Lineage entities with public knowledge-graph pages — used in JSON-LD sameAs
    // and mentionsEntity so the AI/answer engines connect the dots (incl. Bruce Lee).
    lineageSameAs: [
      'https://en.wikipedia.org/wiki/Ip_Man',
      'https://en.wikipedia.org/wiki/Bruce_Lee',
      'https://en.wikipedia.org/wiki/Moy_Yat',
      'https://en.wikipedia.org/wiki/Wing_Chun',
      'https://en.wikipedia.org/wiki/Mook_jong',
    ],
    schoolUrl: 'https://www.denverkungfu.com',
  },

  // Two video tiles (click-to-load facade).
  // To wire a real video: set `src` to a YouTube/Vimeo EMBED url, clear `note`
  // (set it to ''), and drop " (coming soon)" from `ariaLabel`. Then `npm run build`.
  videos: [
    {
      kicker: 'The Tradition',
      title:  'The Art of Ving Tsun',
      note:   'Coming soon',
      poster: 'assets/muk-yan-jong-ash-oak-detail.webp',
      src:    '',
      ariaLabel: 'Play video: The Art of Ving Tsun (coming soon)',
    },
    {
      kicker: 'In the Workshop',
      title:  'Making a Jong',
      note:   'Coming soon',
      poster: 'assets/muk-yan-jong-side-angle.webp',
      src:    '',
      ariaLabel: 'Play video: Making a Jong (coming soon)',
    },
  ],
};
