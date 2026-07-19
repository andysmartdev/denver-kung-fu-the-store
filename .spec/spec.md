# Spec — Denver Kung Fu · The Jong (single-page business card)

**Tier:** Standard (kept lean). Rework/simplification of an existing working static site.
**Status:** Clarify Gate PASSED (0 open markers). Awaiting Bulletproof Gate approval.

## Problem & who hurts

The current site is a multi-page "artisan gift shop" built to sell jongs online for $2,500 via Stripe. Sifu no longer wants the site to handle payments or read like a store — he wants a **business card**: a single page that introduces Mike (the maker) and the jong, and uses **images and video** as the draw for potential customers, who then **call or text / email** to inquire. Secondary pain: the current images are unoptimized camera originals (~29 MB total, up to 5184px), so the site loads slowly for some users.

## In scope

A single-page static site that:
- Presents the jong and its maker as a visual showcase (photos + short videos).
- Reads as a business card / portfolio, not a store. No prices, no cart, no checkout, no order form.
- Drives inquiries to phone/text and email.
- Loads fast: optimized responsive images, click-to-load video facades.
- Keeps the existing brand (colors, fonts, logo).

## Non-goals (deliberately NOT building)

- **No payments / e-commerce / Stripe** — removed entirely (code + dependency).
- **No reservation or contact form** — no data collected, no server. Contact = tap-to-call/text + mailto.
- **No multi-page site** — `reserve.html`, `success.html`, `the-jong.html` are removed; content folds into `index.html`.
- **No backend** — `server.js` and the `stripe`/`express`/`dotenv` dependencies are removed.
- **No CMS / admin UI** — content is edited in HTML by a developer.
- **No new brand/visual redesign** — reuse the existing color + type system.
- **No real video wiring yet** — placeholder click-to-play tiles; sources wired in a later pass.
- **No CDN/analytics/cookie banners** — nothing that adds a support or privacy surface.

## User stories (prioritized; each independently shippable)

### P1 — The business card (THIS is the MVP; shippable alone)
As a potential customer, I land on one page that shows me beautiful photos of the jong and its maker, tells me briefly who makes it and the lineage behind it, and gives me an obvious way to call/text or email to inquire.

**Acceptance (Given/When/Then):**
- Given I open the site, When the page loads, Then I see a single-page site (no store nav, no prices, no "Reserve"/"$2,500" anywhere) with the Denver Kung Fu brand (existing colors, fonts, logo).
- Given I am on the page, When I scroll, Then I see, in order: a hero, an image showcase of the jong, a short "what is a jong" blurb, a maker section for Mike, a condensed lineage blurb, a video section (2 tiles), and a contact section.
- Given I want to inquire, When I reach the contact section (and the primary hero CTA), Then I see **"Call or Text: (303) 284-8125"** and **admin@denverkungfu.com**, both actionable (tel: / sms: / mailto:).
- Given I am on a phone, When I view any section, Then the layout is responsive and readable (mobile-first, no horizontal scroll).
- Given the old routes exist in someone's history/bookmarks, When they hit `reserve.html`/`success.html`/`the-jong.html`, Then they are not linked from the live site (removed). *(EARS: The system SHALL NOT contain any link to a payment, reservation, or checkout flow.)*
- **CTA link formats (M9):** phone/text CTAs use E.164 — `tel:+13032848125` and `sms:+13032848125` (bare non-`+1` SMS URIs fail on some mobile platforms).
- **Social/SEO meta (M8):** since distribution = Sifu texting/pasting the link and the thesis is "images sell it," the page includes `og:title/description/image`, `twitter:card` (summary_large_image), `canonical`, a real `description`, and a corrected `<title>` (drop the store framing "Hand Made Jongs"). A blank share preview is the headline failure mode.
- **main.js ↔ HTML contract (M5):** the rewritten `index.html` MUST preserve the hooks `main.js` depends on: `#navToggle`, `#navLinks`, `data-transparent-nav="true"` on `<body>`, and `.fade-in` on reveal targets. Dropping `.fade-in` silently hides content (no error); dropping `data-transparent-nav` breaks the nav.

### P2 — Fast, optimized media
As any visitor (esp. on mobile/slow connections), the page loads quickly without sacrificing visible image quality.

**Acceptance:**
- Given the source images (current 8 + 8–10 incoming), When the build script runs, Then each produces **ONE capped-width WebP** (not a multi-width matrix — see CUT C1), lowercase-named, pre-committed to `public/assets/`.
- Given the page renders, When images load, Then below-the-fold `<img>` images are lazy-loaded (`loading="lazy"`); full-bleed CSS backgrounds use `image-set()` with a plain single-URL fallback (backgrounds can't use `srcset`).
- EARS: No single image asset served SHALL exceed ~250 KB for a hero/full-bleed image, or ~150 KB for a gallery/inline image, while retaining visually high quality. Cap widths: hero/full-bleed ~1920px, gallery/inline ~1600px.
- Given a new batch of images arrives, When I drop them in `assets-src/` and re-run the script, Then optimized variants are generated with no per-image hand-tuning.
- **Asset-reference contract (M2):** output naming is deterministic and lowercase (`jong-1.webp` … from `Jong_1.JPEG`, `jongwall-wide.webp`, `jongwall-narrow.webp`). EVERY reference is updated: all `<img>` tags AND the three CSS `background-image`s — `styles.css` dark-section overlay (`JongWall_narrow`), hero (`JongWall_wide`), and page-hero (`Jong_6`, which is deleted with `the-jong.html`). A **case-sensitive** verify step (grep refs vs actual filenames) is in the DoD — "opens in my browser" does NOT catch a Linux/Pages 404.

**If a real Lighthouse hero regression appears later**, add `srcset` to that one image only — do not build the width matrix up front.

### P3 — Video showcase (click-to-load facade)
As a potential customer, I can watch two short videos about the jong maker, but the page doesn't load heavy players until I choose to.

**Acceptance:**
- Given the page loads, When I view the video section, Then I see **two** attractive tiles (poster image + play affordance + title) — NOT embedded/autoplaying players. No iframe exists in the initial DOM.
- Given I click/tap a video tile, When it activates, Then an **iframe** (YouTube/Vimeo) is injected from the tile's `data-src` — the player is created only on interaction. (CUT C2: iframe-from-`data-src` only; no host-agnostic `<video>` branch — a `<video>` path is a 5-min add later if self-hosting ever happens.)
- Given real video sources are not yet available, When the site ships, Then the tiles render as clearly-styled placeholders; swapping in a real URL is editing one `data-src` attribute, no layout change.
- **Accessibility floor (C3):** each tile is a real `<button>` (or `<a>`) with an `aria-label`, keyboard-activatable (Enter/Space) — NOT a `<div onclick>`.
- Titles are content-neutral placeholders the owner can rename; working titles: "Meet the Maker" and "Making a Jong."

## Assumptions resolved (was NEEDS CLARIFICATION)

- **Deploy:** Prep production-ready on branch `revise-for-initial-launch`; owner wires DNS later. Keep the existing GitHub Pages workflow (push→main→Pages). **Do NOT commit a CNAME (M4):** peaceiris wipes gh-pages each publish and a placeholder/commented CNAME is invalid → knocks the site off its `github.io` URL the moment main is pushed. Document the domain + the peaceiris `cname:` input in the README instead. Do NOT push to `main` or alter the live deploy without explicit go.
- **Video hosting:** Placeholders now. Facade built host-agnostic (works for YouTube/Vimeo iframe or self-hosted `<video>` by editing one config/data attribute).
- **Content depth:** Business card + condensed lineage + short "what is a jong." Drop the full 6-node lineage tree, the specs table, and the 108-form essay.
- **Image pipeline:** Add a `sharp` Node build script (dev dependency only) → responsive WebP, output pre-committed. Deploy stays static.

## Stack / Plan (folded in — Standard tier)

- **Runtime:** static HTML/CSS/JS in `/public`. Single `index.html`.
- **CSS:** keep `styles.css`; prune dead payment/multi-page rules; add video-facade + responsive-image rules. Preserve tokens.
- **JS:** keep `main.js` (nav + scroll reveal); add click-to-load video facade logic. Remove `reserve.js`.
- **Build (dev-only):** `sharp` script `scripts/optimize-images.js`; reads `assets-src/`, writes optimized WebP variants to `public/assets/`. `package.json` reworked: drop `express`/`stripe`/`dotenv`, add `sharp` as devDependency, add `"optimize"` script; remove `start`/`dev` server scripts.
- **Deploy:** existing `.github/workflows/deploy.yml` unchanged (publishes `./public`).
- **Removed files:** `server.js`, `public/reserve.html`, `public/success.html`, `public/the-jong.html`, `public/js/reserve.js`, `.env.example`.

## Definition of Done (Verify)

- P1 acceptance all pass against the rendered page in a real browser (desktop + mobile viewport).
- Grep proves zero references to Stripe/reserve/checkout/$2,500/price across shipped files.
- Every served image is a responsive optimized WebP under the size budget; page weight sanity-checked.
- Video tiles show placeholders with working click-to-load behavior against a dummy source.
- README updated (positioning + how to add images/video + how to wire the domain). Site runs by opening `public/index.html` (no server).
