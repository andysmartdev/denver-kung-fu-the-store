# Tasks — Denver Kung Fu · The Jong rework

Ordered, atomic, checkable. **Sequencing corrected per Bulletproof Gate M1:** teardown → salvage prose → optimize images FIRST → author index.html ONCE against final optimized filenames → video. This avoids writing markup against `.JPEG` originals and rewriting it later.

## Phase A — Teardown
- [x] T1 — Remove payment/server files: `server.js`, `.env.example`, `public/js/reserve.js`, `public/reserve.html`, `public/success.html`, `public/the-jong.html`.
- [x] T2 — Rework `package.json`: drop `express`/`stripe`/`dotenv` deps and `start`/`dev` scripts; add `sharp` devDependency + `"optimize"` script; update name/description. **Regenerate `package-lock.json` via `npm install` (M6)** so removed deps are gone and sharp's win32 optional dep is captured.

## Phase B — Salvage + image pipeline (do BEFORE authoring the page — M1)
- [x] T3 — Extract the reusable prose from `the-jong.html`/`index.html` before/while deleting (condensed "what is a jong", maker copy, lineage) into the spec or a scratch note so the single page can reuse it.
- [x] T4 — Create `assets-src/`, move the 8 original JPEGs there. **Commit originals in `assets-src/` (M7)** for fresh-clone reproducibility (already excluded from publish — only `./public` ships). Logo `Denver-Logo_Long.webp` stays in `public/assets`.
- [x] T5 — Write `scripts/optimize-images.js` (sharp): each source → **ONE capped-width WebP (C1)**, lowercase deterministic name (`jong-1.webp`…, `jongwall-wide.webp`, `jongwall-narrow.webp`). Caps: hero/full-bleed ~1920px ≤~250KB, gallery/inline ~1600px ≤~150KB, quality-tuned. Idempotent; handles future drops with no hand-tuning.
- [x] T6 — `npm install` + `npm run optimize`; commit optimized WebP outputs to `public/assets/`. Confirm sizes against budget.

## Phase C — P1: the business card (MVP; author against FINAL optimized filenames)
- [x] T7 — Rewrite `public/index.html` as ONE page: hero → jong image showcase → short "what is a jong" → Mike (maker) → condensed lineage blurb → 2 video tiles → contact → footer. No prices/reserve/cart/multi-page nav. **Preserve main.js hooks (M5):** `data-transparent-nav="true"` on body, `.fade-in` on reveal targets. (Chose the minimal nav — logo + single Call/Text CTA — so the old `#navToggle`/`#navLinks` mobile-menu machinery was intentionally removed from BOTH the HTML and main.js, not preserved.) All `<img>` reference lowercase `.webp`; below-fold `loading="lazy"`.
- [x] T8 — Contact CTAs (hero + contact section): `tel:+13032848125`, `sms:+13032848125`, `mailto:admin@denverkungfu.com`, displayed as "Call or Text: (303) 284-8125" + the email. No "$2,500"/"Reserve" anywhere.
- [x] T9 — Add SEO/social meta (M8): fix `<title>`, add `description`, `og:title/description/image`, `twitter:card=summary_large_image`, `canonical`. `og:image` points to an optimized jong WebP.
- [x] T10 — Prune `styles.css`: remove reserve/success/pricing/specs-table/lineage-tree/page-hero rules no longer used; keep tokens + brand. Update the 3 `background-image` refs to lowercase `.webp` via `image-set()` + single-URL fallback (M3); remove the page-hero `Jong_6` rule (dies with the-jong.html). Add video-facade styles.
- [x] T11 — Update nav (single-page anchor links only; logo + Call/Text emphasis) + footer (remove store links; keep DKF external links + contact).

## Phase D — P3: video facade
- [x] T12 — Add video section: 2 tiles, each a real `<button>`/`<a>` with `aria-label`, keyboard-activatable (C3), poster (optimized jong image) + play affordance + title ("Meet the Maker" / "Making a Jong"), real source in a `data-src` attribute.
- [x] T13 — Add facade JS to `main.js`: on click/Enter/Space, inject a YouTube/Vimeo iframe from `data-src` (C2 — iframe only). No iframe in initial DOM.
- [x] T14 — Smoke-check the mechanism with a dummy `data-src`; document the one-attribute swap for real sources.

## Phase E — Ship prep + verify
- [x] T15 — README: positioning, how to add images (drop in `assets-src/`, `npm run optimize`), how to wire real video (`data-src`), how to point a domain (peaceiris `cname:` input — NO committed CNAME, M4). NO push to `main`.
- [x] T16 — **Case-sensitive asset verify (M2):** grep every image ref in HTML+CSS against actual filenames in `public/assets` (exact case) — catch the Linux/Pages 404 that local browsers hide.
- [x] T17 — Full self-verify (verify skill): all P1–P3 DoD in a real browser (desktop + mobile viewport); grep proves zero stripe/reserve/checkout/2500/price refs in shipped files.
