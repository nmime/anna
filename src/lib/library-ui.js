import './ambient.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class SitePreloader extends HTMLElement {
  connectedCallback() {
    const icon = this.getAttribute('icon') || '♡';
    const text = this.getAttribute('text') || 'Готовлю страницу';

    this.innerHTML = `
      <div class="preloader" role="status" aria-live="polite">
        <div class="preloader__mark">${icon}</div>
        <p class="preloader__text">${text}</p>
        <div class="preloader__bar" aria-hidden="true"><span></span></div>
      </div>
    `;
    this.hide(0);
  }

  show(text = 'Открываю страницу') {
    const textEl = this.querySelector('.preloader__text');
    if (textEl) textEl.textContent = text;
    this.removeAttribute('aria-hidden');
    this.classList.remove('is-hidden');
  }

  hide(delay = 0) {
    window.setTimeout(() => {
      this.classList.add('is-hidden');
      this.setAttribute('aria-hidden', 'true');
    }, delay);
  }
}

class MemoryGate extends HTMLElement {
  connectedCallback() {
    this.href = this.dataset.href;
    // data-password содержит sha256-хэши вариантов (через |), не сами слова.
    this.passwords = (this.dataset.password || '')
      .toLowerCase()
      .split('|')
      .map((word) => word.trim())
      .filter(Boolean);
    this.password = this.passwords[0] || '';
    this.unlockAt = this.dataset.unlockAt ? new Date(this.dataset.unlockAt) : null;
    this.statusEl = this.querySelector('[data-gate-status]');
    this.form = this.querySelector('[data-gate-form]');
    this.input = this.querySelector('[data-gate-input]');
    this.error = this.querySelector('[data-gate-error]');

    if (!this.password) {
      this.open();
      this.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        navigateWithLoader(this.href);
      });
      return;
    }

    this.addEventListener('click', (event) => {
      if (!this.classList.contains('is-ready') && !event.target.closest('form')) {
        this.statusEl?.focus?.();
      }
    });

    this.form?.addEventListener('submit', (event) => {
      event.preventDefault();
      this.checkPassword();
    });

    this.updateState();
    this.timer = window.setInterval(() => this.updateState(), 1000);
  }

  disconnectedCallback() {
    window.clearInterval(this.timer);
  }

  open() {
    this.classList.remove('is-locked', 'is-ready');
    this.classList.add('is-open');
    if (this.statusEl) this.statusEl.textContent = 'Открыть главу';
  }

  updateState() {
    if (!this.unlockAt || this.unlockAt <= new Date()) {
      this.classList.remove('is-locked');
      this.classList.add('is-ready');
      if (this.statusEl) this.statusEl.textContent = 'Введи пароль';
      return;
    }

    const diff = Math.max(0, this.unlockAt - new Date());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    this.classList.add('is-locked');
    this.classList.remove('is-ready');
    if (this.statusEl) {
      this.statusEl.textContent = `${days}д ${String(hours).padStart(2, '0')}ч ${String(mins).padStart(2, '0')}м ${String(secs).padStart(2, '0')}с`;
    }
  }

  async checkPassword() {
    if (!this.input) return;
    const value = this.input.value.trim().toLowerCase();
    const digest = await sha256Hex(value);

    if (this.passwords.includes(digest)) {
      if (this.error) this.error.textContent = '';
      try {
        localStorage.setItem(`memoryGate:${this.dataset.id}`, 'open');
      } catch {
        // приватный режим — пусть страж на странице пропустит по referrer не выйдет, просто откроем
      }
      this.classList.add('is-unlocking');
      navigateWithLoader(this.href);
      return;
    }

    if (this.error) this.error.textContent = 'Не то слово. Попробуй еще раз.';
    this.input.focus();
  }
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

class LetterEnvelope extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="letter-envelope__stage" role="button" tabindex="0" aria-label="Открыть конверт" aria-expanded="false">
        <div class="letter-envelope__paper"></div>
        <div class="letter-envelope__body"></div>
        <div class="letter-envelope__front"></div>
        <div class="letter-envelope__flap"></div>
        <div class="letter-envelope__seal">архив</div>
      </div>
      <p class="letter-envelope__label">${this.getAttribute('label') || ''}</p>
      <div class="letter-envelope__message">
        <h3>${this.getAttribute('title') || ''}</h3>
        <p>${this.getAttribute('text') || ''}</p>
        <strong>${this.getAttribute('final') || ''}</strong>
      </div>
    `;

    const open = () => {
      if (this.classList.contains('is-open')) return;
      this.classList.add('is-open');
      stage?.setAttribute('aria-expanded', 'true');
    };

    const stage = this.querySelector('.letter-envelope__stage');
    stage?.addEventListener('click', open);
    stage?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  }
}

function setupReveal() {
  const targets = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('will-reveal');
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );

  targets.forEach((target) => {
    target.classList.add('will-reveal');
    observer.observe(target);
  });
}

function setupNav() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 16);
  update();
  window.addEventListener('scroll', update, { passive: true });

  const menu = nav.querySelector('[data-nav-menu]');
  if (!menu) return;

  document.addEventListener('click', (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') menu.open = false;
  });
}

function setupLightbox() {
  document.addEventListener('click', (event) => {
    const tile = event.target.closest('[data-lightbox-src]');
    if (!tile) return;

    const src = tile.dataset.lightboxSrc;
    const title = tile.dataset.lightboxTitle || '';
    const lightbox = document.createElement('div');
    lightbox.className = 'photo-lightbox';
    lightbox.innerHTML = `
      <button type="button" aria-label="Закрыть">×</button>
      <figure>
        <img src="${src}" alt="${title}">
        <figcaption>${title}</figcaption>
      </figure>
    `;

    const close = () => {
      lightbox.remove();
      document.body.style.overflow = '';
    };

    lightbox.addEventListener('click', (lightboxEvent) => {
      if (lightboxEvent.target === lightbox || lightboxEvent.target.closest('button')) close();
    });

    document.body.style.overflow = 'hidden';
    document.body.appendChild(lightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.querySelector('.photo-lightbox')?.remove();
      document.body.style.overflow = '';
    }
  });
}

function setupPageTransitions() {
  window.addEventListener('pageshow', () => {
    getPreloader()?.hide(reduceMotion ? 0 : 220);
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== '_self') return;
    if (link.hasAttribute('download')) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;

    const samePage = url.pathname === window.location.pathname && url.search === window.location.search;
    if (samePage && url.hash) return;

    event.preventDefault();
    if (samePage) return;
    navigateWithLoader(url.href);
  });
}

function getPreloader() {
  return document.querySelector('site-preloader');
}

function navigateWithLoader(href, text = 'Открываю страницу') {
  getPreloader()?.show(text);
  window.location.href = href;
}

if (!customElements.get('site-preloader')) customElements.define('site-preloader', SitePreloader);
if (!customElements.get('memory-gate')) customElements.define('memory-gate', MemoryGate);
if (!customElements.get('letter-envelope')) customElements.define('letter-envelope', LetterEnvelope);

setupReveal();
setupNav();
setupLightbox();
setupPageTransitions();
