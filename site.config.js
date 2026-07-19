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
  // Contact is email-only for now (phone removed at Sifu's request 2026-07-19).
  email: 'admin@denverkungfu.com',
  emailHref: 'mailto:admin@denverkungfu.com',
  emailCta: 'Email Us',       // short label for the nav + hero buttons

  address: {
    line1: '1832 S Broadway',
    line2: 'Denver, CO 80210',
  },

  year: 2026,

  // <head> metadata
  meta: {
    title:       'Denver Kung Fu · The Jong — Handcrafted Muk Yan Jong by Mike Kilcoyne',
    description: 'Handcrafted Muk Yan Jong (wooden dummy) by Mike Kilcoyne — senior student of Denver Kung Fu. Authentic Ving Tsun training tools, made to order from solid American hardwood. Email to inquire.',
    canonical:   'https://denverkungfu.github.io/',
    ogTitle:     'The Jong — Handcrafted Muk Yan Jong · Denver Kung Fu',
    ogDescription: 'Authentic Ving Tsun wooden dummies, handcrafted from solid American hardwood by Mike Kilcoyne. Made to order.',
    ogImage:     'assets/jong-2.webp',
  },

  // Two video tiles (click-to-load facade).
  // To wire a real video: set `src` to a YouTube/Vimeo EMBED url, clear `note`
  // (set it to ''), and drop " (coming soon)" from `ariaLabel`. Then `npm run build`.
  videos: [
    {
      kicker: 'Interview',
      title:  'Meet the Maker',
      note:   'Coming soon',
      poster: 'assets/jong-4.webp',
      src:    '',
      ariaLabel: 'Play video: Meet the Maker (coming soon)',
    },
    {
      kicker: 'In the Workshop',
      title:  'Making a Jong',
      note:   'Coming soon',
      poster: 'assets/jong-3.webp',
      src:    '',
      ariaLabel: 'Play video: Making a Jong (coming soon)',
    },
  ],
};
