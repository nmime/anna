// ===== STARS BACKGROUND =====
const starsCanvas = document.getElementById('stars-canvas');
const starsCtx = starsCanvas.getContext('2d');
let stars = [];

function initStars() {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height,
      size: Math.random() * 2,
      opacity: Math.random(),
      twinkleSpeed: Math.random() * 0.02 + 0.005
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
    starsCtx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    starsCtx.fill();
  });
  requestAnimationFrame(animateStars);
}

initStars();
animateStars();
window.addEventListener('resize', initStars);

// ===== FLOATING HEARTS =====
const heartsBg = document.getElementById('hearts-bg');
const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '💘', '✨', '🌸', '🦋', '💫'];

function spawnHeart() {
  const heart = document.createElement('div');
  heart.classList.add('floating-heart');
  heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * 100 + '%';
  heart.style.fontSize = (Math.random() * 20 + 14) + 'px';
  heart.style.animationDuration = (Math.random() * 8 + 8) + 's';
  heartsBg.appendChild(heart);
  setTimeout(() => heart.remove(), 16000);
}
setInterval(spawnHeart, 1000);

// ===== SPARKLE CURSOR =====
const sparkleEmojis = ['✨', '💖', '⭐', '💕', '🌟'];
let sparkleThrottle = 0;

document.addEventListener('mousemove', (e) => {
  sparkleThrottle++;
  if (sparkleThrottle % 4 !== 0) return;
  const sparkle = document.createElement('div');
  sparkle.classList.add('sparkle');
  sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
  sparkle.style.left = e.clientX + 'px';
  sparkle.style.top = e.clientY + 'px';
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 800);
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
      // Date has passed — show password form
      cardEl.classList.remove('locked');
      cardEl.classList.add('unlocked');
      lockStatus.querySelector('.lock-icon').textContent = '🔓';
      lockStatus.querySelector('.lock-text').textContent = 'Введи пароль, чтобы открыть';
      formEl.style.display = 'block';

      // Remove countdown if exists
      const countdown = cardEl.querySelector('.countdown-mini');
      if (countdown) countdown.remove();
    } else {
      // Not yet — show countdown
      cardEl.classList.add('locked');
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      let countdownEl = cardEl.querySelector('.countdown-mini');
      if (!countdownEl) {
        countdownEl = document.createElement('div');
        countdownEl.className = 'countdown-mini';
        lockStatus.after(countdownEl);
      }
      countdownEl.innerHTML = `
        <div class="countdown-unit"><div class="number">${days}</div><div class="label">дней</div></div>
        <div class="countdown-unit"><div class="number">${hours}</div><div class="label">часов</div></div>
        <div class="countdown-unit"><div class="number">${mins}</div><div class="label">минут</div></div>
        <div class="countdown-unit"><div class="number">${secs}</div><div class="label">секунд</div></div>
      `;
    }
  });
}

updateCardStates();
setInterval(updateCardStates, 1000);

// ===== PASSWORD CHECK =====
function checkPassword(cardKey) {
  const input = document.getElementById('pass-' + cardKey);
  const error = document.getElementById('error-' + cardKey);
  const config = cards[cardKey];
  const entered = input.value.trim().toLowerCase();

  if (entered === config.password) {
    // Success! Redirect with animation
    error.textContent = '';
    const cardEl = document.getElementById('card-' + cardKey);
    cardEl.style.transform = 'scale(1.1)';
    cardEl.style.boxShadow = '0 0 100px rgba(255, 107, 157, 0.5)';
    cardEl.style.borderColor = 'var(--gold)';

    // Burst of hearts
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.style.cssText = `
          position: fixed;
          left: ${cardEl.getBoundingClientRect().left + cardEl.offsetWidth / 2}px;
          top: ${cardEl.getBoundingClientRect().top + cardEl.offsetHeight / 2}px;
          font-size: ${15 + Math.random() * 25}px;
          pointer-events: none;
          z-index: 9999;
          transition: all ${1 + Math.random() * 2}s ease-out;
          opacity: 1;
        `;
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        document.body.appendChild(heart);
        requestAnimationFrame(() => {
          heart.style.transform = `translate(${(Math.random() - 0.5) * 400}px, ${-200 - Math.random() * 400}px) rotate(${Math.random() * 360}deg)`;
          heart.style.opacity = '0';
        });
        setTimeout(() => heart.remove(), 3000);
      }, i * 50);
    }

    setTimeout(() => {
      document.body.style.transition = 'opacity 0.8s ease';
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = config.page;
      }, 800);
    }, 1200);
  } else {
    error.textContent = 'Не угадала... попробуй ещё раз 💭';
    error.classList.remove('shake');
    void error.offsetWidth;
    error.classList.add('shake');
    input.style.borderColor = '#ff4757';
    setTimeout(() => {
      input.style.borderColor = 'rgba(255, 107, 157, 0.2)';
    }, 1000);
  }
}

// Enter key support
document.querySelectorAll('.password-input').forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cardKey = input.id.replace('pass-', '');
      checkPassword(cardKey);
    }
  });
});

// Prevent clicking locked cards
document.querySelectorAll('.date-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (card.classList.contains('locked')) {
      card.style.animation = 'shake 0.5s ease';
      setTimeout(() => card.style.animation = '', 500);
    }
  });
});
