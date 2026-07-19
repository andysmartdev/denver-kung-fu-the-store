/* ─────────────────────────────────────────────────────────────
   main.js — Denver Kung Fu · The Jong
   Handles: nav scroll state · scroll-reveal · click-to-load video
───────────────────────────────────────────────────────────── */

(function () {
  const nav = document.querySelector('.nav');

  /* ── Nav: transparent on hero, solid once scrolled ── */
  const isTransparent = document.body.dataset.transparentNav === 'true';

  function updateNav() {
    if (!nav) return;
    if (!isTransparent || window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  /* ── Scroll-reveal (IntersectionObserver) ── */
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* ── Click-to-load video facade ──
     Each .video-tile is a real <button>. On activation, if it carries a
     non-empty data-src, we replace the tile's contents with an autoplaying
     iframe (YouTube/Vimeo). No iframe exists until the user opts in.
     To wire a real video: set the tile's data-src to the embed URL. */
  function loadVideo(tile) {
    const src = (tile.dataset.src || '').trim();
    if (!src) return; // placeholder — nothing wired yet

    const sep = src.includes('?') ? '&' : '?';
    const iframe = document.createElement('iframe');
    iframe.className = 'video-tile__frame';
    iframe.src = src + sep + 'autoplay=1';
    iframe.title = tile.getAttribute('aria-label') || 'Video';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;

    tile.innerHTML = '';
    tile.appendChild(iframe);
    tile.classList.add('video-tile--playing');
  }

  document.querySelectorAll('.video-tile').forEach(tile => {
    tile.addEventListener('click', () => loadVideo(tile));
    // <button> already fires click on Enter/Space; no extra keydown needed.
  });
})();
