(() => {
  'use strict';
  const PHONE = '923298612683';
  const MESSAGE = 'Assalam-o-Alaikum! I want to purchase the CapCut Pro Lifetime Tool for Rs. 500. Please share the payment and activation details.';
  const WA_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

  /* ADD NEW REVIEW IMAGES HERE: put the file in /reviews and add its path to this list */
  const REVIEWS = ['reviews/review-1.jpg', 'reviews/review-2.jpg', 'reviews/review-3.jpg', 'reviews/review-4.jpg'];

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = id => document.getElementById(id);

  /* BUY NOW */
  document.querySelectorAll('[data-buy]').forEach(b => {
    b.href = WA_URL;
    b.addEventListener('pointerdown', e => {
      if (reduce) return;
      const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), d = document.createElement('span');
      d.className = 'rip';
      d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      b.appendChild(d); setTimeout(() => d.remove(), 500);
    });
  });

  /* Reviews modal + zoom */
  const modal = $('rv'), grid = $('rgrid'), zoom = $('zoom'), zimg = zoom.querySelector('img');
  let built = false, opener = null;
  const build = () => {
    built = true;
    grid.innerHTML = REVIEWS.length ? '' : '<p class="empty">Reviews coming soon.</p>';
    REVIEWS.forEach((src, i) => {
      const im = new Image();
      im.src = src; im.alt = `Customer review ${i + 1}`; im.loading = 'lazy'; im.decoding = 'async';
      im.addEventListener('click', () => { zimg.src = src; zoom.classList.add('open'); zoom.setAttribute('aria-hidden', 'false'); });
      grid.appendChild(im);
    });
  };
  const openR = e => {
    opener = e.currentTarget; if (!built) build();
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock'); $('rvx').focus({ preventScroll: true });
  };
  const closeZ = () => { zoom.classList.remove('open'); zoom.setAttribute('aria-hidden', 'true'); };
  const closeR = () => {
    closeZ(); modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock'); opener && opener.focus({ preventScroll: true });
  };
  document.querySelectorAll('[data-reviews]').forEach(b => b.addEventListener('click', openR));
  $('rvx').addEventListener('click', closeR);
  zoom.addEventListener('click', closeZ);
  addEventListener('keydown', e => { if (e.key === 'Escape') zoom.classList.contains('open') ? closeZ() : closeR(); });
  REVIEWS.forEach(s => { const i = new Image(); i.src = s; }); // warm cache so it opens instantly

  /* Scroll reveal (starts before the element reaches the screen) */
  const rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px 18% 0px' });
    rv.forEach(t => io.observe(t));
  } else rv.forEach(t => t.classList.add('in'));

  if (reduce) return;

  /* 3D tilt (rAF-throttled) */
  const stage = $('stage'), char = $('char'); let raf = 0;
  stage.addEventListener('pointermove', e => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0; const r = stage.getBoundingClientRect();
      char.style.transform = `rotateY(${((e.clientX - r.left) / r.width - .5) * 16}deg) rotateX(${-((e.clientY - r.top) / r.height - .5) * 12}deg)`;
    });
  });
  stage.addEventListener('pointerleave', () => char.style.transform = '');

  /* Light particles: few, no shadows, paused when hidden */
  const cv = $('fx'), ctx = cv.getContext('2d'); let W, H, ps = [], run = true;
  const size = () => {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    const n = (navigator.hardwareConcurrency || 4) <= 4 ? 22 : 38;
    ps = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + .7, v: Math.random() * .5 + .2, c: Math.random() < .4 ? '255,197,49' : '70,160,255' }));
  };
  size(); addEventListener('resize', size);
  document.addEventListener('visibilitychange', () => { run = !document.hidden; if (run) tick(); });
  function tick() {
    if (!run) return;
    ctx.clearRect(0, 0, W, H);
    for (const p of ps) {
      p.y -= p.v; if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      ctx.fillStyle = `rgba(${p.c},.75)`; ctx.fillRect(p.x, p.y, p.r * 2, p.r * 2);
    }
    requestAnimationFrame(tick);
  }
  tick();
})();
