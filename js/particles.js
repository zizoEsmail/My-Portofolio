/* ================================================================
   particles.js  —  DPR-aware particle network canvas
                    Mouse attraction · Depth layers · Color shift
   ================================================================ */
'use strict';
(function () {

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ── Config ── */
  const N        = 80;
  const LINK_R   = 160;
  const SPEED    = 0.32;
  const ATTRACT  = 0.009;
  const DAMP     = 0.988;

  const COLORS = [
    [78,  159, 212],   // blue   — 55%
    [99,  102, 241],   // indigo — 30%
    [144, 200, 240],   // pale   — 15%
  ];

  let W = 0, H = 0, dpr = 1;
  const mouse = { x: -9999, y: -9999 };
  let particles = [];

  /* ── Resize ── */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W   = window.innerWidth;
    H   = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', () => {
    ctx.resetTransform();
    resize();
  }, { passive: true });

  /* ── Mouse ── */
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  /* ── Particle class ── */
  class P {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = init ? Math.random() * W : (Math.random() > 0.5 ? 0 : W);
      this.y  = init ? Math.random() * H : Math.random() * H;
      this.vx = (Math.random() - 0.5) * SPEED * 2;
      this.vy = (Math.random() - 0.5) * SPEED * 2;
      this.r  = Math.random() * 1.4 + 0.4;
      this.a  = Math.random() * 0.4 + 0.15;

      const roll = Math.random();
      this.col = COLORS[roll < 0.55 ? 0 : roll < 0.85 ? 1 : 2];
    }
    update() {
      // attraction toward mouse
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const d  = Math.sqrt(dx * dx + dy * dy) || 1;
      if (d < 220) {
        this.vx += (dx / d) * ATTRACT * (1 - d / 220);
        this.vy += (dy / d) * ATTRACT * (1 - d / 220);
      }
      this.vx *= DAMP;
      this.vy *= DAMP;
      this.x  += this.vx;
      this.y  += this.vy;
      // wrap
      if (this.x < -20) this.x = W + 20;
      if (this.x > W+20) this.x = -20;
      if (this.y < -20) this.y = H + 20;
      if (this.y > H+20) this.y = -20;
    }
    draw() {
      const [r,g,b] = this.col;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < N; i++) particles.push(new P());

  /* ── Draw edges ── */
  function drawEdges() {
    // include mouse as virtual node
    const nodes = [...particles, { x: mouse.x, y: mouse.y, col: [78,159,212] }];
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = particles[i].x - nodes[j].x;
        const dy = particles[i].y - nodes[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < LINK_R) {
          const t = 1 - d / LINK_R;
          const a = t * t * t * 0.32;   // cubic falloff
          const [r,g,b] = particles[i].col;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
          ctx.lineWidth   = t * 1.4;
          ctx.stroke();
        }
      }
    }
  }

  /* ── Loop ── */
  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawEdges();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();

})();
