// ===== PRELOADER WITH TYPEWRITER =====
const preloaderTexts = ['Открываю что-то особенное...', 'Готовлю звёзды для тебя...', 'Почти готово...'];
let plIdx = 0;
const plTextEl = document.getElementById('preloader-text');
const plBar = document.querySelector('.preloader-bar');

function typePreloaderText() {
  const text = preloaderTexts[plIdx];
  let i = 0;
  plTextEl.textContent = '';
  const iv = setInterval(() => {
    plTextEl.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(iv);
      plIdx++;
      if (plIdx < preloaderTexts.length) {
        setTimeout(() => typePreloaderText(), 600);
      }
    }
  }, 40);
}
typePreloaderText();

// Progress bar animation
let progress = 0;
const progressIv = setInterval(() => {
  progress += Math.random() * 15 + 5;
  if (progress > 100) progress = 100;
  plBar.style.width = progress + '%';
  if (progress >= 100) clearInterval(progressIv);
}, 300);

window.addEventListener('load', () => {
  plBar.style.width = '100%';
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 2200);
});

// ===== TYPED SUBTITLE =====
const subtitleText = 'Два особенных дня. Два секрета. Одна любовь.';
const subtitleEl = document.getElementById('typed-subtitle');
const cursorEl = document.getElementById('cursor');

setTimeout(() => {
  let i = 0;
  const typeIv = setInterval(() => {
    subtitleEl.textContent += subtitleText[i];
    i++;
    if (i >= subtitleText.length) {
      clearInterval(typeIv);
      // Hide cursor after a pause
      setTimeout(() => { cursorEl.style.opacity = '0'; }, 2000);
    }
  }, 50);
}, 2600);

// ===== LOVE QUOTES ROTATOR =====
const quotes = [
  'Ты — лучшее, что случилось в моей жизни',
  'Каждый день с тобой — как маленькое чудо',
  'Твоя улыбка — мой любимый рассвет',
  'Я люблю тебя сильнее, чем вчера, но слабее, чем завтра',
  'Ты — мой дом, где бы мы ни были',
  'С тобой даже тишина звучит как музыка'
];
const quoteTextEl = document.getElementById('quote-text');
let quoteIdx = 0;

function showNextQuote() {
  quoteTextEl.style.opacity = '0';
  setTimeout(() => {
    quoteTextEl.textContent = quotes[quoteIdx];
    quoteTextEl.style.opacity = '1';
    quoteIdx = (quoteIdx + 1) % quotes.length;
  }, 400);
}
setTimeout(() => {
  showNextQuote();
  setInterval(showNextQuote, 5000);
}, 4000);

// ===== STARS + SHOOTING STARS =====
const starsCanvas = document.getElementById('stars-canvas');
const starsCtx = starsCanvas.getContext('2d');
let stars = [];
let shootingStars = [];

function initStars() {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
  stars = [];
  const count = Math.min(350, Math.floor(window.innerWidth * window.innerHeight / 4000));
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height,
      size: Math.random() * 1.8 + 0.2,
      opacity: Math.random(),
      twinkleSpeed: (Math.random() - 0.5) * 0.012,
      hue: Math.random() > 0.5 ? (Math.random() * 40 + 320) : (Math.random() * 30 + 270)
    });
  }
}

function spawnShootingStar() {
  shootingStars.push({
    x: Math.random() * starsCanvas.width * 0.7,
    y: Math.random() * starsCanvas.height * 0.3,
    length: 60 + Math.random() * 80,
    speed: 6 + Math.random() * 6,
    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
    opacity: 1,
    trail: []
  });
}

// Spawn shooting stars periodically
setInterval(() => {
  if (Math.random() > 0.4) spawnShootingStar();
}, 3000);

function animateStars() {
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

  // Draw stars
  stars.forEach(star => {
    star.opacity += star.twinkleSpeed;
    if (star.opacity > 1 || star.opacity < 0.05) star.twinkleSpeed *= -1;
    starsCtx.beginPath();
    starsCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    starsCtx.fillStyle = `hsla(${star.hue}, 70%, 65%, ${star.opacity * 0.35})`;
    starsCtx.fill();

    // Tiny glow for bigger stars
    if (star.size > 1.2) {
      starsCtx.beginPath();
      starsCtx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
      starsCtx.fillStyle = `hsla(${star.hue}, 70%, 65%, ${star.opacity * 0.06})`;
      starsCtx.fill();
    }
  });

  // Shooting stars
  shootingStars = shootingStars.filter(ss => {
    ss.x += Math.cos(ss.angle) * ss.speed;
    ss.y += Math.sin(ss.angle) * ss.speed;
    ss.opacity -= 0.012;
    ss.trail.push({ x: ss.x, y: ss.y, opacity: ss.opacity });
    if (ss.trail.length > 20) ss.trail.shift();

    // Draw trail
    ss.trail.forEach((point, idx) => {
      const alpha = (idx / ss.trail.length) * ss.opacity * 0.6;
      const width = (idx / ss.trail.length) * 2;
      starsCtx.beginPath();
      starsCtx.arc(point.x, point.y, width, 0, Math.PI * 2);
      starsCtx.fillStyle = `rgba(232, 67, 147, ${alpha * 0.5})`;
      starsCtx.fill();
    });

    // Head glow
    starsCtx.beginPath();
    starsCtx.arc(ss.x, ss.y, 3, 0, Math.PI * 2);
    starsCtx.fillStyle = `rgba(232, 67, 147, ${ss.opacity * 0.6})`;
    starsCtx.fill();
    starsCtx.beginPath();
    starsCtx.arc(ss.x, ss.y, 8, 0, Math.PI * 2);
    starsCtx.fillStyle = `rgba(232, 67, 147, ${ss.opacity * 0.12})`;
    starsCtx.fill();

    return ss.opacity > 0;
  });

  requestAnimationFrame(animateStars);
}

initStars();
animateStars();
window.addEventListener('resize', initStars);

// ===== FLOATING PARTICLES WITH CONNECTIONS =====
const particlesCanvas = document.getElementById('particles-canvas');
const pCtx = particlesCanvas.getContext('2d');
let pParticles = [];
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

function initParticles() {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
  pParticles = [];
  const count = Math.min(60, Math.floor(window.innerWidth / 25));
  for (let i = 0; i < count; i++) {
    pParticles.push({
      x: Math.random() * particlesCanvas.width,
      y: Math.random() * particlesCanvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.25 + 0.05,
      color: ['232,67,147', '244,114,182', '192,132,252', '236,72,153', '251,191,213'][Math.floor(Math.random() * 5)],
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01
    });
  }
}

function animateParticles() {
  pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

  pParticles.forEach(p => {
    // Mouse attraction
    const dx = mouseX - p.x;
    const dy = mouseY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 250) {
      p.speedX += dx * 0.00004;
      p.speedY += dy * 0.00004;
    }

    p.x += p.speedX;
    p.y += p.speedY;
    p.speedX *= 0.998;
    p.speedY *= 0.998;

    // Wrap
    if (p.x < -10) p.x = particlesCanvas.width + 10;
    if (p.x > particlesCanvas.width + 10) p.x = -10;
    if (p.y < -10) p.y = particlesCanvas.height + 10;
    if (p.y > particlesCanvas.height + 10) p.y = -10;

    // Pulsing size
    p.pulsePhase += p.pulseSpeed;
    const pulseFactor = 1 + Math.sin(p.pulsePhase) * 0.3;

    // Particle with glow
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.size * pulseFactor, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
    pCtx.fill();

    // Glow
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.size * pulseFactor * 3, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(${p.color}, ${p.opacity * 0.1})`;
    pCtx.fill();
  });

  // Connections
  for (let i = 0; i < pParticles.length; i++) {
    for (let j = i + 1; j < pParticles.length; j++) {
      const dx = pParticles[i].x - pParticles[j].x;
      const dy = pParticles[i].y - pParticles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        pCtx.beginPath();
        pCtx.moveTo(pParticles[i].x, pParticles[i].y);
        pCtx.lineTo(pParticles[j].x, pParticles[j].y);
        pCtx.strokeStyle = `rgba(232, 67, 147, ${0.06 * (1 - dist / 120)})`;
        pCtx.lineWidth = 0.5;
        pCtx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
window.addEventListener('resize', initParticles);

// ===== FLOATING EMOJIS =====
const emojiContainer = document.getElementById('floating-emojis');
const emojis = ['💕', '💖', '✨', '🌸', '🦋', '💫', '🌷', '💗', '🌟', '💘'];

function spawnFloatingEmoji() {
  const el = document.createElement('div');
  el.classList.add('float-emoji');
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  el.style.left = Math.random() * 100 + '%';
  el.style.fontSize = (14 + Math.random() * 18) + 'px';
  el.style.animationDuration = (10 + Math.random() * 10) + 's';
  el.style.animationDelay = Math.random() * 2 + 's';
  emojiContainer.appendChild(el);
  setTimeout(() => el.remove(), 22000);
}
setInterval(spawnFloatingEmoji, 1800);

// ===== CURSOR TRAIL =====
const trailCanvas = document.getElementById('cursor-trail');
const trailCtx = trailCanvas.getContext('2d');
let trail = [];
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

function initTrail() {
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}

if (!isMobile) {
  initTrail();
  window.addEventListener('resize', initTrail);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    trail.push({
      x: e.clientX,
      y: e.clientY,
      opacity: 1,
      size: 4,
      hue: 340 + Math.random() * 30
    });
    if (trail.length > 30) trail.shift();
  });

  function animateTrail() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    // Draw trail
    trail.forEach((point, i) => {
      point.opacity -= 0.035;
      point.size *= 0.97;
      if (point.opacity <= 0) return;

      // Gradient dot
      const gradient = trailCtx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.size * 3);
      gradient.addColorStop(0, `hsla(${point.hue}, 80%, 70%, ${point.opacity * 0.4})`);
      gradient.addColorStop(1, `hsla(${point.hue}, 80%, 70%, 0)`);
      trailCtx.beginPath();
      trailCtx.arc(point.x, point.y, point.size * 3, 0, Math.PI * 2);
      trailCtx.fillStyle = gradient;
      trailCtx.fill();

      // Core
      trailCtx.beginPath();
      trailCtx.arc(point.x, point.y, point.size * 0.5, 0, Math.PI * 2);
      trailCtx.fillStyle = `hsla(${point.hue}, 90%, 85%, ${point.opacity * 0.6})`;
      trailCtx.fill();
    });

    trail = trail.filter(p => p.opacity > 0);

    // Draw cursor dot
    if (trail.length > 0) {
      const last = { x: mouseX, y: mouseY };
      trailCtx.beginPath();
      trailCtx.arc(last.x, last.y, 5, 0, Math.PI * 2);
      trailCtx.fillStyle = 'rgba(232, 67, 147, 0.5)';
      trailCtx.fill();
      trailCtx.beginPath();
      trailCtx.arc(last.x, last.y, 2, 0, Math.PI * 2);
      trailCtx.fillStyle = 'rgba(232, 67, 147, 0.8)';
      trailCtx.fill();
    }

    requestAnimationFrame(animateTrail);
  }
  animateTrail();
} else {
  document.addEventListener('touchmove', (e) => {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
  });
}

// ===== 3D CARD TILT + SPOTLIGHT =====
document.querySelectorAll('.date-card').forEach(card => {
  const spotlight = card.querySelector('.card-spotlight');

  card.addEventListener('mousemove', (e) => {
    if (card.classList.contains('locked')) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-12px) perspective(800px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;

    // Move spotlight
    if (spotlight) {
      spotlight.style.left = (e.clientX - rect.left) + 'px';
      spotlight.style.top = (e.clientY - rect.top) + 'px';
    }
  });

  card.addEventListener('mouseleave', () => {
    if (card.classList.contains('locked')) return;
    card.style.transform = '';
  });
});

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15 - 2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ===== DATE CHECKING & CARD STATE =====
const cards = {
  march8: {
    date: new Date('2026-03-08T00:00:00'),
    password: 'принцесса',
    page: 'march8.html'
  },
  march11: {
    date: new Date('2026-03-11T00:00:00'),
    password: 'only my girl',
    page: 'birthday.html'
  }
};

function updateCardStates() {
  const now = new Date();

  Object.keys(cards).forEach(key => {
    const cardEl = document.getElementById('card-' + key);
    const lockStatus = cardEl.querySelector('.card-lock-status');
    const formEl = document.getElementById('form-' + key);
    const config = cards[key];
    const diff = config.date - now;

    if (diff <= 0) {
      cardEl.classList.remove('locked');
      cardEl.classList.add('unlocked');
      lockStatus.querySelector('.lock-icon').textContent = '🔓';
      lockStatus.querySelector('.lock-text').textContent = 'Введи пароль, чтобы открыть';
      formEl.style.display = 'block';
      const countdown = cardEl.querySelector('.countdown-mini');
      if (countdown) countdown.remove();
    } else {
      cardEl.classList.add('locked');
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      let countdownEl = cardEl.querySelector('.countdown-mini');
      if (!countdownEl) {
        countdownEl = document.createElement('div');
        countdownEl.className = 'countdown-mini';
        lockStatus.after(countdownEl);
      }
      countdownEl.innerHTML = `
        <div class="countdown-unit"><div class="number">${days}</div><div class="label">дн</div></div>
        <div class="countdown-unit"><div class="number">${String(hours).padStart(2,'0')}</div><div class="label">час</div></div>
        <div class="countdown-unit"><div class="number">${String(mins).padStart(2,'0')}</div><div class="label">мин</div></div>
        <div class="countdown-unit"><div class="number">${String(secs).padStart(2,'0')}</div><div class="label">сек</div></div>
      `;
    }
  });
}

updateCardStates();
setInterval(updateCardStates, 1000);

// ===== PASSWORD CHECK =====
const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '💘', '✨', '🌸', '🦋', '💫', '🌟', '🌷'];

function checkPassword(cardKey) {
  const input = document.getElementById('pass-' + cardKey);
  const error = document.getElementById('error-' + cardKey);
  const config = cards[cardKey];
  const entered = input.value.trim().toLowerCase();

  if (entered === config.password) {
    error.textContent = '';
    const cardEl = document.getElementById('card-' + cardKey);

    // Success glow
    cardEl.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
    cardEl.style.transform = 'scale(1.08)';
    cardEl.style.boxShadow = '0 0 150px rgba(232, 67, 147, 0.25)';
    cardEl.querySelector('.card-border-glow').style.borderColor = 'rgba(232, 67, 147, 0.4)';
    cardEl.querySelector('.card-border-glow').style.boxShadow = '0 0 60px rgba(232, 67, 147, 0.15), inset 0 0 60px rgba(244, 114, 182, 0.08)';

    // Particle burst
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        const rect = cardEl.getBoundingClientRect();
        heart.style.cssText = `
          position: fixed;
          left: ${rect.left + rect.width / 2}px;
          top: ${rect.top + rect.height / 2}px;
          font-size: ${12 + Math.random() * 28}px;
          pointer-events: none;
          z-index: 9999;
          transition: all ${0.6 + Math.random() * 1.5}s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 1;
          filter: drop-shadow(0 0 8px rgba(232, 67, 147, 0.2));
        `;
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        document.body.appendChild(heart);
        requestAnimationFrame(() => {
          const angle = (Math.PI * 2 / 40) * i;
          const radius = 150 + Math.random() * 250;
          heart.style.transform = `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius - 100}px) rotate(${Math.random() * 360}deg) scale(0)`;
          heart.style.opacity = '0';
        });
        setTimeout(() => heart.remove(), 2500);
      }, i * 35);
    }

    // Screen flash
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:rgba(244,114,182,0.1);z-index:9997;pointer-events:none;transition:opacity 0.8s ease';
    document.body.appendChild(flash);
    setTimeout(() => { flash.style.opacity = '0'; setTimeout(() => flash.remove(), 800); }, 100);

    // Fade out & redirect
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0, 1)';
      document.body.style.opacity = '0';
      setTimeout(() => window.location.href = config.page, 800);
    }, 1200);
  } else {
    error.textContent = 'Не угадала... попробуй ещё раз 💭';
    error.classList.remove('shake');
    void error.offsetWidth;
    error.classList.add('shake');
    input.style.borderColor = 'rgba(232, 67, 147, 0.4)';
    input.style.background = 'rgba(232, 67, 147, 0.04)';

    // Shake the whole card
    const cardEl = document.getElementById('card-' + cardKey);
    cardEl.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
      cardEl.style.animation = '';
      input.style.borderColor = '';
      input.style.background = '';
    }, 1000);
  }
}

// Enter key support
document.querySelectorAll('.password-input').forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      checkPassword(input.id.replace('pass-', ''));
    }
  });

  // Glow effect on type
  input.addEventListener('input', () => {
    const wrap = input.closest('.input-wrap');
    const glow = wrap.querySelector('.input-glow');
    glow.style.opacity = input.value.length > 0 ? '0.5' : '0';
  });
});

// Shake locked cards on click
document.querySelectorAll('.date-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (card.classList.contains('locked') && !e.target.closest('.card-password-form')) {
      card.style.animation = 'shake 0.5s ease';
      setTimeout(() => card.style.animation = '', 500);
    }
  });
});

// ===== MESH ORB MOUSE PARALLAX =====
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth - 0.5;
  const y = e.clientY / window.innerHeight - 0.5;
  document.querySelectorAll('.mesh-orb').forEach((orb, i) => {
    const speed = (i + 1) * 25;
    orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
  // Aurora parallax too
  document.querySelectorAll('.aurora-band').forEach((band, i) => {
    const speed = (i + 1) * 10;
    band.style.marginLeft = `${x * speed}px`;
  });
});

// ===== KEYBOARD EASTER EGG =====
let konamiSequence = '';
document.addEventListener('keydown', (e) => {
  konamiSequence += e.key;
  if (konamiSequence.includes('love')) {
    konamiSequence = '';
    // Heart explosion from center
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const h = document.createElement('div');
        h.style.cssText = `position:fixed;left:50vw;top:50vh;font-size:${20 + Math.random() * 30}px;pointer-events:none;z-index:9999;transition:all ${1 + Math.random() * 2}s cubic-bezier(0.16,1,0.3,1);opacity:1`;
        h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        document.body.appendChild(h);
        requestAnimationFrame(() => {
          h.style.transform = `translate(${(Math.random() - 0.5) * 600}px, ${(Math.random() - 0.5) * 600}px) scale(0)`;
          h.style.opacity = '0';
        });
        setTimeout(() => h.remove(), 3000);
      }, i * 30);
    }
  }
  if (konamiSequence.length > 20) konamiSequence = konamiSequence.slice(-10);
});
