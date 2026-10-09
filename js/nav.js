/* ================================================================
   nav.js  —  Loader animation · Nav scroll · Active link
   ================================================================ */
'use strict';
(function () {

  /* ── Loader: stagger each char in "AE" ─────────────────── */
  const loader = document.getElementById('loader');
  const chars  = loader ? loader.querySelectorAll('.lc') : [];

  chars.forEach((c, i) => {
    c.style.animationDelay = (i * 90) + 'ms';
  });

  window.addEventListener('load', () => {
    /* reveal orbs once page is ready */
    document.querySelectorAll('.orb').forEach(o => o.classList.add('visible'));

    setTimeout(() => {
      if (!loader) return;
      loader.classList.add('fade-out');
      setTimeout(() => loader.classList.add('gone'), 960);
    }, 1900);
  });

  /* ── Nav: stick + shrink on scroll ─────────────────────── */
  const nav = document.getElementById('nav');
  if (!nav) return;

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('stuck', window.scrollY > 48);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Active nav link via IntersectionObserver ───────────── */
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const secObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.remove('active'));
      const hit = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (hit) hit.classList.add('active');
    });
  }, { threshold: 0.4 });

  sections.forEach(s => secObs.observe(s));

})();
