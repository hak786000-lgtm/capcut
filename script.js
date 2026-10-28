(() => {
  'use strict';
  const PHONE = '923298612683';
  const MESSAGE = 'Assalam-o-Alaikum! I want to purchase the CapCut Pro Lifetime Tool for Rs. 500. Please share the payment and activation details.';
  const WA_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* BUY NOW buttons: encoded WhatsApp link + press ripple */
  document.querySelectorAll('[data-buy]').forEach(btn => {
    btn.href = WA_URL;
    btn.addEventListener('pointerdown', e => {
      if (reduce) return;
      const r = btn.getBoundingClientRect(), s = Math.max(r.width, r.height);
      const d = document.createElement('span');
      d.className = 'ripple';
      d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      btn.appendChild(d);
      setTimeout(() => d.remove(), 700);
    });
  });

  /* Scroll reveals */
  document.querySelectorAll('.flist li').forEach((li, i) => li.style.setProperty('--i', i));
  const targets = document.querySelectorAll('.flist li, .reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(t => io.observe(t));
  } else targets.forEach(t => t.classList.add('in'));

  if (reduce) return;

  /* 3D tilt on the character (mouse + touch) */
  const stage = document.getElementById('stage'), char = document.getElementById('char');
  const tilt = e => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    char.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg)`;
  };
  stage.addEventListener('pointermove', tilt);
  stage.addEventListener('pointerleave', () => char.style.transform = '');

  /* Floating blue + gold particles */
  const cv = document.getElementById('fx'), ctx = cv.getContext('2d');
  let W, H, dpr, ps = [];
  const make = () => ({
    x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2.2 + .6,
    vy: -(Math.random() * .4 + .12), vx: (Math.random() - .5) * .25,
    c: Math.random() < .4 ? '255,200,58' : '53,160,255', a: Math.random() * .6 + .3, p: Math.random() * 6.28
  });
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ps = Array.from({ length: Math.min(90, Math.round(W * H / 14000)) }, make);
  };
  size(); addEventListener('resize', size);
  let run = true;
  document.addEventListener('visibilitychange', () => { run = !document.hidden; if (run) loop(); });
  function loop() {
    if (!run) return;
    ctx.clearRect(0, 0, W, H);
    for (const p of ps) {
      p.y += p.vy; p.x += p.vx + Math.sin(p.p += .01) * .2;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = `rgba(${p.c},${p.a})`; ctx.shadowColor = `rgb(${p.c})`; ctx.shadowBlur = 12; ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  loop();
})();
