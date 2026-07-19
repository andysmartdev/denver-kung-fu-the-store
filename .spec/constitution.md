# Constitution — Denver Kung Fu · The Jong (business-card rework)

Durable principles for this project. ~10 lines. Reused across the build.

1. **Static, build-tool-free at runtime.** The deployed artifact is plain HTML/CSS/JS in `/public`. No server, no runtime framework. A build *script* (image optimization) is allowed but its output is pre-committed so the deploy stays fully static.
2. **No money, no PII, no server.** Payments are removed entirely. The site collects nothing and stores nothing. Contact is a phone number and an email address, nothing more.
3. **Preserve the existing brand.** Keep the current CSS color scheme and type system (green `#0F713E`, red `#C3262D`, cream `#F5F0E8`, dark `#141210`; Cormorant Garamond / Inter / Noto Serif SC). Visual identity does not change.
4. **Business card, not a shop.** One page. The draw is imagery and video of the jong and its maker — not commerce, not long essays.
5. **Performance is a feature.** Images must be web-optimized (responsive, lazy, modern format) with quality retained. No multi-MB originals shipped to the browser. Video uses a click-to-load facade — no heavy player until the user opts in.
6. **Low support surface.** Deploys to a static host (GitHub Pages pipeline retained). Owner (Sifu / Mike) should never have to touch code to keep it running.
7. **Ship bar (factory batch-1):** live URL + honest positioning + README. Not app-store polish.
