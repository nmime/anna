// Ambient wow-layer: aurora, bokeh sparkles, drifting hearts, shooting stars,
// cursor stardust. Theme-tinted through CSS variables, skipped entirely when
// the visitor prefers reduced motion.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function cssColor(name) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const probe = document.createElement('span');
  probe.style.color = raw;
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color.match(/\d+/g);
  probe.remove();
  return rgb ? rgb.slice(0, 3).join(',') : '160,100,60';
}

function heartPath(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.32);
  ctx.bezierCurveTo(x, y - size * 0.28, x - size, y - size * 0.28, x - size, y + size * 0.22);
  ctx.bezierCurveTo(x - size, y + size * 0.62, x - size * 0.4, y + size * 0.9, x, y + size * 1.18);
  ctx.bezierCurveTo(x + size * 0.4, y + size * 0.9, x + size, y + size * 0.62, x + size, y + size * 0.22);
  ctx.bezierCurveTo(x + size, y - size * 0.28, x, y - size * 0.28, x, y + size * 0.32);
  ctx.closePath();
}

function setupAurora() {
  const aurora = document.createElement('div');
  aurora.className = 'ambient-aurora';
  aurora.setAttribute('aria-hidden', 'true');
  aurora.innerHTML = '<i></i><i></i><i></i>';
  document.body.prepend(aurora);
}

function setupSky() {
  const canvas = document.createElement('canvas');
  canvas.className = 'ambient-sky';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const colors = [cssColor('--accent'), cssColor('--accent-2'), cssColor('--accent-3')];
  let bokeh = [];
  let hearts = [];
  let streaks = [];
  let width = 0;
  let height = 0;
  let running = true;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    bokeh = Array.from({ length: Math.min(34, Math.floor(width / 42)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3.2 + 1.2,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.2 + 0.08,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
      pulse: Math.random() * 0.015 + 0.006
    }));

    hearts = Array.from({ length: Math.min(7, Math.floor(width / 190)) }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * height * 0.6,
      size: Math.random() * 5 + 4,
      vy: Math.random() * 0.24 + 0.12,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.008 + 0.004,
      alpha: Math.random() * 0.1 + 0.08
    }));
  };

  const spawnStreak = () => {
    if (!running || Math.random() < 0.45) return;
    const fromLeft = Math.random() > 0.5;
    streaks.push({
      x: fromLeft ? -40 : Math.random() * width * 0.7,
      y: Math.random() * height * 0.3 + 20,
      angle: Math.PI / 5 + (Math.random() - 0.5) * 0.22,
      speed: Math.random() * 5 + 6,
      life: 1,
      trail: []
    });
  };

  const draw = () => {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);

    bokeh.forEach((b) => {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < -12) b.x = width + 12;
      if (b.x > width + 12) b.x = -12;
      if (b.y < -12) b.y = height + 12;
      if (b.y > height + 12) b.y = -12;
      b.phase += b.pulse;
      const pulse = 1 + Math.sin(b.phase) * 0.32;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${b.color},${b.alpha})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * pulse * 3.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${b.color},${b.alpha * 0.14})`;
      ctx.fill();
    });

    hearts.forEach((h) => {
      h.y -= h.vy;
      h.sway += h.swaySpeed;
      const x = h.x + Math.sin(h.sway) * 26;
      if (h.y < -30) {
        h.y = height + 30;
        h.x = Math.random() * width;
      }
      ctx.fillStyle = `rgba(${colors[1]},${h.alpha})`;
      heartPath(ctx, x, h.y, h.size);
      ctx.fill();
    });

    streaks = streaks.filter((s) => {
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life -= 0.014;
      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > 22) s.trail.shift();
      s.trail.forEach((p, i) => {
        const a = (i / s.trail.length) * s.life * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (i / s.trail.length) * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colors[0]},${a})`;
        ctx.fill();
      });
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colors[0]},${s.life * 0.7})`;
      ctx.fill();
      return s.life > 0 && s.x < width + 60 && s.y < height + 60;
    });

    requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize);
  window.setInterval(spawnStreak, 3400);
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(draw);
  });
  requestAnimationFrame(draw);
}

function setupCursorStardust() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'ambient-stardust';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const gold = cssColor('--accent');
  const rose = cssColor('--accent-2');
  let sparks = [];
  let width = 0;
  let height = 0;
  let last = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', (event) => {
    const now = performance.now();
    if (now - last < 26) return;
    last = now;
    sparks.push({
      x: event.clientX + (Math.random() - 0.5) * 10,
      y: event.clientY + (Math.random() - 0.5) * 10,
      size: Math.random() * 2.4 + 1,
      life: 1,
      vy: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? gold : rose,
      spin: Math.random() * Math.PI
    });
    if (sparks.length > 36) sparks.shift();
  });

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    sparks = sparks.filter((s) => {
      s.life -= 0.028;
      s.y += s.vy;
      s.spin += 0.06;
      if (s.life <= 0) return false;
      const r = s.size * s.life;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.spin);
      ctx.fillStyle = `rgba(${s.color},${s.life * 0.55})`;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(r * 0.4, r * 0.4, 0, r * 2.4);
        ctx.quadraticCurveTo(-r * 0.4, r * 0.4, 0, 0);
      }
      ctx.fill();
      ctx.restore();
      return true;
    });
    requestAnimationFrame(draw);
  };

  requestAnimationFrame(draw);
}

function setupTypewriter() {
  const targets = document.querySelectorAll('[data-typewriter]');
  targets.forEach((el) => {
    const full = el.textContent.trim();
    if (!full) return;
    el.style.minHeight = `${el.offsetHeight}px`;
    el.textContent = '';
    el.classList.add('is-typing');
    let i = 0;
    const tick = () => {
      el.textContent = full.slice(0, i);
      i += 1;
      if (i <= full.length) {
        window.setTimeout(tick, 34);
      } else {
        window.setTimeout(() => el.classList.remove('is-typing'), 1400);
      }
    };
    window.setTimeout(tick, 460);
  });
}

function setupCountUp() {
  const targets = document.querySelectorAll('[data-count-to]');
  targets.forEach((el) => {
    const target = Number(el.dataset.countTo);
    if (!target) return;
    const duration = 1900;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

if (reduceMotion) {
  document.querySelectorAll('[data-count-to]').forEach((el) => {
    el.textContent = el.dataset.countTo;
  });
} else {
  setupAurora();
  setupSky();
  setupCursorStardust();
  setupTypewriter();
  setupCountUp();
}
