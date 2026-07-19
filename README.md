# Denver Kung Fu · The Jong

A single-page site for **The Muk Yan Jong** — handcrafted Ving Tsun wooden dummies
built by Mike Kilcoyne of Denver Kung Fu. It's a **business card**: photos and video
of the jong and its maker, with a clear call-to-action to **call, text, or email** to
inquire. No online payments, no forms, no server — just a fast static page.

**Contact on the site:** admin@denverkungfu.com (email only for now)

---

## How it's built

Plain static HTML/CSS/JS in `public/`. No framework, no runtime server. Two small
author-time build steps produce the committed output, so the **deployed site is 100%
static** — no build runs on the visitor's browser or on the deploy host.

```
site.config.js        SINGLE SOURCE OF TRUTH — email, address, meta, video tiles
src/index.html        HTML template (edit layout here; uses {{placeholders}})
scripts/
  build-html.js       stamps site.config.js into public/index.html
  optimize-images.js   sharp → optimized WebP into public/assets/
assets-src/           original full-res photos (source of truth; not published)
public/               ← GENERATED + committed; this is what deploys
  index.html          generated from src/ + site.config.js — DO NOT edit by hand
  css/styles.css      styles (brand tokens: green #0F713E, red #C3262D, cream, dark)
  js/main.js          nav scroll state, scroll-reveal, click-to-load video
  assets/             optimized .webp images + the logo
```

### The one rule that matters

**Don't edit `public/index.html` directly — it's generated and will be overwritten.**
Edit `src/index.html` (layout) or `site.config.js` (content), then run the build.

### Build commands

```bash
npm install        # first time only
npm run build      # optimize images + generate public/index.html
# or individually:
npm run optimize   # just re-generate the WebP images
npm run html       # just re-stamp public/index.html from the template + config
```

`npm run html` fails loudly if the template has an unresolved `{{placeholder}}`, so a
typo can't ship a literal `{{email}}` to the page.

### Changing the email, address, etc.

Edit the value **once** in `site.config.js`, run `npm run build`, commit. It updates
everywhere it appears (hero, nav, contact card, footer, `mailto:` links, and the page
metadata) — no find-and-replace.

> Contact is **email-only** right now (phone removed at Sifu's request). To add a phone
> back later: re-add a `phone` object to `site.config.js` and wire `tel:`/`sms:` buttons
> in `src/index.html` — the nav/hero/contact layout that held two contact methods is in
> git history (commit before this one) if you want it back.

To preview locally, open `public/index.html` in a browser (or serve `public/` with any
static server).

---

## Adding / updating images

Photos are optimized from originals so the site stays fast (the originals are
3–5 MB each; the shipped WebP versions are ~50–250 KB).

1. Drop the new photo(s) into **`assets-src/`**.
2. (Optional) add an entry to the `MAP` in `scripts/optimize-images.js` to control the
   output name and profile (`fullbleed` for hero/background, `inline` for gallery,
   `overlay` for darkened backgrounds). Unmapped files get a lowercased name + `inline`.
3. Run:
   ```bash
   npm install        # first time only (installs sharp)
   npm run optimize
   ```
4. Reference the new `assets/<name>.webp` in `index.html`, and commit the generated file.

Budgets the script targets: hero/full-bleed ≤ ~250 KB (max 1920px), gallery/inline
≤ ~150 KB (max 1600px).

---

## Adding the real videos

The two tiles under **"Meet the Maker"** are click-to-load facades: nothing heavy loads
until the visitor clicks. They're defined in the `videos` array in **`site.config.js`**.
To wire a real video, edit that entry:

```js
{
  kicker: 'Interview',
  title:  'Meet the Maker',
  note:   '',                                             // was 'Coming soon' — clear it
  poster: 'assets/jong-4.webp',
  src:    'https://www.youtube.com/embed/VIDEO_ID',       // YouTube/Vimeo EMBED url
  ariaLabel: 'Play video: Meet the Maker',                // drop " (coming soon)"
},
```

Then `npm run html` (or `npm run build`). On click, the script injects an autoplaying
iframe from `src`. (Self-hosted `<video>` isn't wired today; it's a small addition to
`main.js` if ever needed.)

---

## Deploying

`.github/workflows/deploy.yml` publishes `public/` to **GitHub Pages** on every push to
**`main`**. Current working branch: `revise-for-initial-launch`. Merge/push to `main`
when ready to go live.

### Pointing a custom domain

Do **not** commit a `CNAME` file — the deploy action (peaceiris) rewrites the Pages
branch each run and a stale/placeholder CNAME will knock the site off its URL. Instead,
when DNS is ready, add the `cname` input to the workflow:

```yaml
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          cname: yourdomain.com     # <-- add this line
```

…and point the domain's DNS at GitHub Pages per GitHub's docs (A/AAAA records for an
apex domain, or a CNAME record for a subdomain).

---

## What this used to be

This started as a Stripe-backed online store (multi-page, `$2,500` checkout, Express
server). All of that was removed for the business-card rework. See `.spec/` for the
spec, constitution, and task history behind the change.
