/* ================================================================
   scroll.js  —  Hero char-by-char reveal (spring stagger)
                 Section reveals via IntersectionObserver
                 Skill bars animate on scroll
                 Counter animation for stat numbers
   ================================================================ */
'use strict';
(function () {

  /* ═══ 1. HERO NAME — char-by-char spring reveal ══════════ */
  document.querySelectorAll('.hero-name .ln').forEach(line => {
    const text = line.textContent;
    line.textContent = '';
    line.setAttribute('aria-label', text);

    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className   = 'ch';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.setAttribute('aria-hidden', 'true');
      span.style.cssText = `
        opacity: 0;
        transform: translateY(105%) rotate(${(Math.random() - 0.5) * 10}deg);
        display: inline-block;
      `;
      line.appendChild(span);
    });
  });

  function fireHeroName() {
    document.querySelectorAll('.hero-name .ch').forEach((ch, i) => {
      ch.style.transition = `
        opacity  0.6s cubic-bezier(0.16,1,0.3,1) ${i * 42}ms,
        transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 42}ms
      `;
      ch.style.opacity   = '1';
      ch.style.transform = 'translateY(0) rotate(0deg)';
    });
  }
  // Fire after loader exits (loader gone ~1.9s + 0.9s fade = ~2.8s total, fire at 2.1s)
  setTimeout(fireHeroName, 2100);

  /* ═══ 2. GENERIC REVEAL ══════════════════════════════════ */
  // data-reveal="fade-up | fade-left | fade-right | fade-scale"
  // data-delay="0" (ms extra)

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el    = e.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('revealed'), delay);
      revealObs.unobserve(el);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    const dir = el.dataset.reveal || 'fade-up';
    // set initial hidden state
    el.style.cssText += `
      opacity: 0;
      will-change: opacity, transform;
      transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
    `;
    if (dir === 'fade-up')    el.style.transform = 'translateY(44px)';
    if (dir === 'fade-left')  el.style.transform = 'translateX(-44px)';
    if (dir === 'fade-right') el.style.transform = 'translateX(44px)';
    if (dir === 'fade-scale') el.style.transform = 'scale(0.93)';

    // add revealed class handler
    const mo = new MutationObserver(() => {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    });
    mo.observe(el, { attributes: true, attributeFilter: ['class'] });

    revealObs.observe(el);
  });

  /* ═══ 3. STAGGER CHILDREN ════════════════════════════════ */
  // data-stagger on parent → each child gets sequential delay
  const staggerObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const parent = e.target;
      const gap    = parseInt(parent.dataset.staggerGap || '70', 10);
      [...parent.children].forEach((child, i) => {
        child.style.cssText += `
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity  0.65s cubic-bezier(0.16,1,0.3,1) ${i * gap}ms,
            transform 0.65s cubic-bezier(0.16,1,0.3,1) ${i * gap}ms;
        `;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            child.style.opacity   = '1';
            child.style.transform = 'none';
          });
        });
      });
      staggerObs.unobserve(parent);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-stagger]').forEach(el => staggerObs.observe(el));

  /* ═══ 4. SKILL BARS ══════════════════════════════════════ */
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const fill  = e.target;
      const idx   = [...document.querySelectorAll('.skill-fill')].indexOf(fill);
      setTimeout(() => {
        fill.style.width = fill.dataset.width + '%';
        setTimeout(() => fill.classList.add('filled'), 1300);
      }, idx * 90);
      barObs.unobserve(fill);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.skill-fill').forEach(b => barObs.observe(b));

  /* ═══ 5. COUNTER ANIMATION ═══════════════════════════════ */
  function animCount(el, target, duration) {
    const start = performance.now();
    const isFloat = String(target).includes('.');
    function step(now) {
      const pct = Math.min((now - start) / duration, 1);
      const val = pct * target;
      el.textContent = isFloat ? val.toFixed(1) + '%' : Math.round(val);
      if (pct < 1) requestAnimationFrame(step);
      else el.textContent = isFloat ? target + '%' : target;
    }
    requestAnimationFrame(step);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const raw = el.dataset.count;
      if (!raw) return;
      const num = parseFloat(raw);
      animCount(el, num, 1400);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.7 });

  document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

})();
