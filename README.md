# Denver Kung Fu · The Jong

A single-page site for **The Muk Yan Jong** — handcrafted Ving Tsun wooden dummies
built by Mike Kilcoyne of Denver Kung Fu. It's a **business card**: photos and video
of the jong and its maker, with a clear call-to-action to **call, text, or email** to
inquire. No online payments, no forms, no server — just a fast static page.

**Contact on the site:** Call or Text (303) 284-8125 · admin@denverkungfu.com

---

## How it's built

Plain static HTML/CSS/JS in `public/`. No framework, no runtime server. The only
tooling is an image-optimization script you run at author time; its output is committed,
so the deployed site is 100% static.

```
public/
  index.html        the whole site (one page)
  css/styles.css    styles (brand tokens: green #0F713E, red #C3262D, cream, dark)
  js/main.js        nav scroll state, scroll-reveal, click-to-load video
  assets/           optimized .webp images (committed) + the logo
assets-src/         original full-res photos (source of truth; not published)
scripts/
  optimize-images.js  sharp build script → optimized WebP into public/assets/
```

To preview locally, just open `public/index.html` in a browser (or serve `public/`
with any static server).

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
until the visitor clicks. Wiring a real video is a **one-attribute edit** in `index.html` —
set the tile's `data-src` to a YouTube/Vimeo **embed** URL:

```html
<!-- before (placeholder) -->
<button ... class="video-tile fade-in" data-src="" aria-label="Play video: Meet the Maker (coming soon)">

<!-- after -->
<button ... class="video-tile fade-in" data-src="https://www.youtube.com/embed/VIDEO_ID" aria-label="Play video: Meet the Maker">
```

Then remove the `<span class="video-tile__note">Coming soon</span>` line for that tile.
On click, the script injects an autoplaying iframe. (Self-hosted `<video>` isn't wired
today; it's a small addition to `main.js` if ever needed.)

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
