/* =====================================================
   script.js – ESTABLE + CHAT UI CONTROL
===================================================== */

/* Helpers */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSearchSuggestions();
  initHeroSlider();
  initLazyLoad();
  initStickyHeader();
  initCartDemo();
  initAccessibilityShortcuts();
  initChatUI(); // 👈 ESTO ES LO QUE FALTABA
});

/* --------------------------------------------------
   MOBILE NAV
-------------------------------------------------- */
function initMobileNav() {
  const btn = $('.mobile-menu-btn');
  const nav = $('#navbar');
  if (!btn || !nav) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', nav.classList.contains('open'));
  });

  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --------------------------------------------------
   SEARCH SUGGESTIONS
-------------------------------------------------- */
function initSearchSuggestions() {
  const container = $('.search-box');
  if (!container) return;

  const input = $('input', container);
  const suggestions = [
    'Cámaras IP 4K',
    'Central de incendio UL',
    'Detector de humo',
    'Panel Inim',
    'Soporte técnico',
    'Grabadores NVR'
  ];

  const list = document.createElement('ul');
  list.className = 'search-suggestions';
  list.hidden = true;
  container.appendChild(list);

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    list.innerHTML = '';
    if (!q) return (list.hidden = true);

    suggestions
      .filter(s => s.toLowerCase().includes(q))
      .forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        li.onclick = () => {
          input.value = text;
          list.hidden = true;
        };
        list.appendChild(li);
      });

    list.hidden = list.children.length === 0;
  });

  document.addEventListener('click', e => {
    if (!container.contains(e.target)) list.hidden = true;
  });
}

/* --------------------------------------------------
   HERO SLIDER
-------------------------------------------------- */
function initHeroSlider() {
  const wrapper = $('.hero-slider-wrapper');
  if (!wrapper) return;

  const slides = $$('.hero-slide', wrapper);
  let index = 0;

  function show(i) {
    slides.forEach((s, idx) => {
      s.style.display = idx === i ? 'block' : 'none';
      const img = $('img', s);
      if (img) img.style.opacity = idx === i ? '1' : '0';
    });
  }

  show(index);
  setInterval(() => {
    index = (index + 1) % slides.length;
    show(index);
  }, 4500);
}

/* --------------------------------------------------
   LAZY LOAD
-------------------------------------------------- */
function initLazyLoad() {
  const imgs = $$('img[data-src]');
  if (!imgs.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.src = e.target.dataset.src;
      e.target.removeAttribute('data-src');
      io.unobserve(e.target);
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => io.observe(img));
}

/* --------------------------------------------------
   STICKY HEADER
-------------------------------------------------- */
function initStickyHeader() {
  const header = $('#main-header');
  if (!header) return;

  const limit = header.offsetHeight;
  window.addEventListener('scroll', () => {
    header.classList.toggle('sticky', window.scrollY > limit);
  });
}

/* --------------------------------------------------
   CART DEMO
-------------------------------------------------- */
function initCartDemo() {
  const btn = $('.cart-btn');
  if (!btn) return;

  let count = Number(localStorage.getItem('vv_cart') || 0);
  render();

  btn.onclick = e => {
    e.preventDefault();
    count++;
    localStorage.setItem('vv_cart', count);
    render();
  };

  function render() {
    btn.textContent = `🛒 Carro (${count})`;
  }
}

/* --------------------------------------------------
   ACCESSIBILITY
-------------------------------------------------- */
function initAccessibilityShortcuts() {
  const input = $('.search-box input');
  document.addEventListener('keydown', e => {
    if (e.key === '/' && input) {
      e.preventDefault();
      input.focus();
    }
  });
}

/* --------------------------------------------------
   CHAT UI (CLAVE)
-------------------------------------------------- */
function initChatUI() {
  const btn = $('#vv-chat-button');
  const box = $('#vv-chat-container');
  const close = $('#vv-chat-close');

  if (!btn || !box || !close) return;

  btn.addEventListener('click', () => {
    box.classList.toggle('hidden');
  });

  close.addEventListener('click', () => {
    box.classList.add('hidden');
  });
}
