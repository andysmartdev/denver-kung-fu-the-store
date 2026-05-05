/* ─────────────────────────────────────────────────────────────
   main.js — Denver Kung Fu Jong Store
   Handles: nav scroll/toggle + scroll-reveal animations
───────────────────────────────────────────────────────────── */

(function () {
  const nav       = document.querySelector('.nav');
  const toggle    = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  /* ── Nav: transparent on landing, solid elsewhere ── */
  const isTransparent = document.body.dataset.transparentNav === 'true';

  function updateNav() {
    if (!isTransparent || window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  /* ── Mobile nav toggle ── */
  toggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

/* ── Close mobile menu on Escape ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      toggle?.classList.remove('open');
      toggle?.focus();
    }
  });

  /* Close on link tap (mobile) */
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle?.classList.remove('open');
    });
  });

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
})();
