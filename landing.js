// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 1800);
});

// ===== STARS BACKGROUND =====
const starsCanvas = document.getElementById('stars-canvas');
const starsCtx = starsCanvas.getContext('2d');
let stars = [];

function initStars() {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
  stars = [];
  const count = Math.min(300, Math.floor(window.innerWidth * window.innerHeight / 5000));
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random(),
      twinkleSpeed: (Math.random() - 0.5) * 0.015,
      hue: Math.random() > 0.8 ? (Math.random() * 40 + 330) : 0 // some pink-ish stars
    });
  }
}

function animateStars() {
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  stars.forEach(star => {
    star.opacity += star.twinkleSpeed;
    if (star.opacity > 1 || star.opacity < 0.1) star.twinkleSpeed *= -1;
    starsCtx.beginPath();
    starsCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    if (star.hue) {
      starsCtx.fillStyle = `hsla(${star.hue}, 80%, 80%, ${star.opacity * 0.7})`;
    } else {
      starsCtx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.8})`;
    }
    starsCtx.fill();
  });
  requestAnimationFrame(animateStars);
}

initStars();
animateStars();
window.addEventListener('resize', initStars);

// ===== FLOATING PARTICLES =====
const particlesCanvas = document.getElementById('particles-canvas');
const pCtx = particlesCanvas.getContext('2d');
let pParticles = [];
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

function initParticles() {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
  pParticles = [];
  for (let i = 0; i < 50; i++) {
    pParticles.push({
      x: Math.random() * particlesCanvas.width,
      y: Math.random() * particlesCanvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      color: ['255,107,157', '247,215,148', '108,92,231', '232,213,245'][Math.floor(Math.random() * 4)]
    });
  }
}

function animateParticles() {
  pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

  pParticles.forEach(p => {
    // Gentle mouse attraction
    const dx = mouseX - p.x;
    const dy = mouseY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 300) {
      p.speedX += dx * 0.00003;
      p.speedY += dy * 0.00003;
    }

    p.x += p.speedX;
    p.y += p.speedY;
    p.speedX *= 0.999;
    p.speedY *= 0.999;

    // Wrap around
    if (p.x < 0) p.x = particlesCanvas.width;
    if (p.x > particlesCanvas.width) p.x = 0;
    if (p.y < 0) p.y = particlesCanvas.height;
    if (p.y > particlesCanvas.height) p.y = 0;

    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
    pCtx.fill();
  });

  // Draw subtle connections
  for (let i = 0; i < pParticles.length; i++) {
    for (let j = i + 1; j < pParticles.length; j++) {
      const dx = pParticles[i].x - pParticles[j].x;
      const dy = pParticles[i].y - pParticles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        pCtx.beginPath();
        pCtx.moveTo(pParticles[i].x, pParticles[i].y);
        pCtx.lineTo(pParticles[j].x, pParticles[j].y);
        pCtx.strokeStyle = `rgba(255, 107, 157, ${0.03 * (1 - dist / 150)})`;
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

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// ===== 3D CARD TILT =====
document.querySelectorAll('.date-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if (card.classList.contains('locked')) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-12px) perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    if (card.classList.contains('locked')) return;
    card.style.transform = '';
  });
});

// ===== DATE CHECKING & CARD STATE =====
const cards = {
  march8: {
    date: new Date('2026-03-08T00:00:00'),
    password: 'most beatiful girl',
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
const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '💘', '✨', '🌸', '🦋', '💫'];

function checkPassword(cardKey) {
  const input = document.getElementById('pass-' + cardKey);
  const error = document.getElementById('error-' + cardKey);
  const config = cards[cardKey];
  const entered = input.value.trim().toLowerCase();

  if (entered === config.password) {
    error.textContent = '';
    const cardEl = document.getElementById('card-' + cardKey);

    // Success glow animation
    cardEl.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    cardEl.style.transform = 'scale(1.05)';
    cardEl.style.boxShadow = '0 0 120px rgba(255, 107, 157, 0.4)';
    cardEl.querySelector('.card-border-glow').style.borderColor = 'rgba(247, 215, 148, 0.5)';

    // Particle burst
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        const rect = cardEl.getBoundingClientRect();
        heart.style.cssText = `
          position: fixed;
          left: ${rect.left + rect.width / 2}px;
          top: ${rect.top + rect.height / 2}px;
          font-size: ${12 + Math.random() * 24}px;
          pointer-events: none;
          z-index: 9999;
          transition: all ${0.8 + Math.random() * 1.5}s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 1;
        `;
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        document.body.appendChild(heart);
        requestAnimationFrame(() => {
          heart.style.transform = `translate(${(Math.random() - 0.5) * 500}px, ${-150 - Math.random() * 350}px) rotate(${Math.random() * 360}deg) scale(0)`;
          heart.style.opacity = '0';
        });
        setTimeout(() => heart.remove(), 2500);
      }, i * 40);
    }

    // Fade out & redirect
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.6s ease';
      document.body.style.opacity = '0';
      setTimeout(() => window.location.href = config.page, 600);
    }, 1000);
  } else {
    error.textContent = 'Не угадала... попробуй ещё раз';
    error.classList.remove('shake');
    void error.offsetWidth;
    error.classList.add('shake');
    input.style.borderColor = 'rgba(253, 121, 168, 0.4)';
    input.style.background = 'rgba(253, 121, 168, 0.05)';
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.background = '';
    }, 1200);
  }
}

// Enter key support
document.querySelectorAll('.password-input').forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      checkPassword(input.id.replace('pass-', ''));
    }
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
    const speed = (i + 1) * 20;
    orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});
