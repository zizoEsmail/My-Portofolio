/* ================================================================
   cursor.js  —  Spring-physics cursor · Magnetic buttons
   ================================================================ */
'use strict';
(function () {

  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  if (!dot || !ring) return;

  /* ── State ── */
  let mx = 0, my = 0;          // real mouse
  let rx = 0, ry = 0;          // ring (lerped)
  let vx = 0, vy = 0;          // ring velocity
  const STIFFNESS = 0.11;      // spring strength
  const DAMPING   = 0.78;      // momentum decay

  /* ── Mouse tracking ── */
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  /* ── Click pulse ── */
  document.addEventListener('mousedown', () => ring.classList.add('on-click'));
  document.addEventListener('mouseup',   () => ring.classList.remove('on-click'));

  /* ── Spring animation loop ── */
  function tick() {
    // dot: snap to cursor
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    // ring: spring toward cursor
    const fx = (mx - rx) * STIFFNESS;
    const fy = (my - ry) * STIFFNESS;
    vx = (vx + fx) * DAMPING;
    vy = (vy + fy) * DAMPING;
    rx += vx;
    ry += vy;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    requestAnimationFrame(tick);
  }
  tick();

  /* ── Hover state ── */
  document.querySelectorAll('a, button, .t-tag, .proj-card, .exp-card, .c-link, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('on-link'));
    el.addEventListener('mouseleave', () => ring.classList.remove('on-link'));
  });

  /* ── Magnetic pull on .btn ── */
  const MAG = 0.36;
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      btn.style.transform = `translate(${(e.clientX - cx) * MAG}px, ${(e.clientY - cy) * MAG}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s var(--spring)';
      setTimeout(() => btn.style.transition = '', 500);
    });
  });

  /* ── Hide cursor outside window ── */
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

})();
