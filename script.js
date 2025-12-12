/* script.js (completo)
   Contiene:
   - Mobile nav
   - Search suggestions (mock)
   - Hero slider (autoplay, pause on hover, dots)
   - Lazy-loading (IntersectionObserver)
   - Sticky header
   - Cart demo (localStorage)
   - Chatbot (UI + send to N8N webhook)
*/

/* -------------------------
   CONFIG: cambiar/ aquí va el n8n
   ------------------------- */
   const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/42197a58-f37a-4ccc-ba51-c21153417388/chat"; // <- reemplaza con tu webhook
   /* ------------------------- */
   
   const $ = sel => document.querySelector(sel);
   const $$ = sel => Array.from(document.querySelectorAll(sel));
   
   document.addEventListener('DOMContentLoaded', () => {
     initMobileNav();
     initSearchSuggestions();
     initHeroSlider();
     initLazyLoad();
     initStickyHeader();
     initCartDemo();
     initChatbotUI();
     initAccessibilityShortcuts();
   });
   
   /* -------------------------
      Mobile nav
      ------------------------- */
   function initMobileNav() {
     const btn = document.querySelector('.mobile-menu-btn');
     const nav = document.getElementById('navbar');
     if (!btn || !nav) return;
   
     btn.addEventListener('click', (e) => {
       e.stopPropagation();
       const open = nav.classList.toggle('open');
       btn.setAttribute('aria-expanded', open ? 'true' : 'false');
     });
   
     document.addEventListener('click', (e) => {
       if (!nav.contains(e.target) && !btn.contains(e.target)) {
         nav.classList.remove('open');
         btn.setAttribute('aria-expanded', 'false');
       }
     });
   }
   
   /* -------------------------
      Search suggestions (mock)
      ------------------------- */
   function initSearchSuggestions() {
     const container = document.querySelector('.search-box');
     if (!container) return;
     const input = container.querySelector('input');
     const suggestions = [
       'Cámaras IP 4K',
       'Central de incendio UL',
       'Detector de humo óptico',
       'Panel Inim',
       'Cables y conectores',
       'Soporte técnico',
       'Capacitación video vigilancia',
       'Grabadores NVR'
     ];
   
     // crear contenedor
     const list = document.createElement('ul');
     list.className = 'search-suggestions';
     list.style.display = 'none';
     container.appendChild(list);
   
     input.addEventListener('input', (e) => {
       const q = e.target.value.trim().toLowerCase();
       list.innerHTML = '';
       if (!q) { list.style.display = 'none'; return; }
       const matches = suggestions.filter(s => s.toLowerCase().includes(q)).slice(0,6);
       if (matches.length === 0) { list.style.display = 'none'; return; }
       matches.forEach(m => {
         const li = document.createElement('li');
         li.tabIndex = 0;
         li.textContent = m;
         li.addEventListener('click', () => {
           input.value = m;
           list.style.display = 'none';
           performSearch(m);
         });
         li.addEventListener('keydown', (ev) => {
           if (ev.key === 'Enter') { input.value = m; performSearch(m); }
         });
         list.appendChild(li);
       });
       list.style.display = 'block';
     });
   
     document.addEventListener('click', (ev) => {
       if (!container.contains(ev.target)) list.style.display = 'none';
     });
   
     input.addEventListener('keydown', (e) => {
       const items = Array.from(list.querySelectorAll('li'));
       if (items.length === 0) return;
       let idx = items.indexOf(document.activeElement);
       if (e.key === 'ArrowDown') { e.preventDefault(); const next = (idx + 1) % items.length; items[next].focus(); }
       else if (e.key === 'ArrowUp') { e.preventDefault(); const prev = (idx - 1 + items.length) % items.length; items[prev].focus(); }
       else if (e.key === 'Escape') list.style.display = 'none';
       else if (e.key === 'Enter') performSearch(input.value.trim());
     });
   
     function performSearch(q) {
       if (!q) return;
       // reemplaza por navegación a tu buscador real
       console.log('Buscar:', q);
       // window.location.href = `/search?q=${encodeURIComponent(q)}`;
     }
   }
   
   /* -------------------------
      HERO SLIDER
      ------------------------- */
   function initHeroSlider() {
     const wrapper = document.querySelector('.hero-slider-wrapper');
     if (!wrapper) return;
     const slides = Array.from(wrapper.querySelectorAll('.hero-slide'));
     if (slides.length === 0) return;
   
     // dots
     let dots = wrapper.querySelector('.hero-dots');
     if (!dots) {
       dots = document.createElement('div');
       dots.className = 'hero-dots';
       wrapper.appendChild(dots);
     }
     dots.innerHTML = '';
     slides.forEach((s,i) => {
       const b = document.createElement('button');
       b.className = 'hero-dot';
       b.setAttribute('aria-label', `Ir a slide ${i+1}`);
       b.addEventListener('click', () => goTo(i));
       dots.appendChild(b);
     });
   
     // lazy load first
     slides.forEach((s,i) => {
       const img = s.querySelector('img');
       if (!img) return;
       if (i === 0) loadImg(img);
       else img.dataset.lazy = 'true';
     });
   
     let idx = 0;
     let timer = null;
     const delay = 4500;
   
     function show() {
       slides.forEach((s,i) => {
         s.style.display = i === idx ? 'block' : 'none';
         const dot = dots.children[i];
         if (dot) dot.classList.toggle('active', i === idx);
         const img = s.querySelector('img');
         if (img && img.dataset.lazy) { loadImg(img); delete img.dataset.lazy; }
       });
     }
   
     function goTo(i) {
       idx = (i + slides.length) % slides.length;
       show();
       restart();
     }
     function next() { goTo(idx + 1); }
     function restart() { clearInterval(timer); timer = setInterval(next, delay); }
   
     show();
     restart();
   
     wrapper.addEventListener('mouseenter', () => clearInterval(timer));
     wrapper.addEventListener('mouseleave', restart);
   
     document.addEventListener('keydown', (e) => {
       if (e.key === 'ArrowLeft') goTo(idx - 1);
       else if (e.key === 'ArrowRight') goTo(idx + 1);
     });
   
     function loadImg(img) {
       const src = img.dataset.src || img.getAttribute('src');
       if (!src) return;
       if (img.src && img.src.includes(src)) { img.style.opacity = 1; return; }
       img.src = src;
       img.onload = () => img.style.opacity = 1;
       img.onerror = () => { img.style.opacity = 1; img.style.filter = 'grayscale(1)'; };
     }
   }
   
   /* -------------------------
      LAZY LOAD (otros imgs)
      ------------------------- */
   function initLazyLoad() {
     const imgs = Array.from(document.querySelectorAll('img[data-src]'));
     // Excluir los del hero (son manejados ahí)
     const toObserve = imgs.filter(i => !i.closest('.hero-slider-wrapper'));
   
     if ('IntersectionObserver' in window) {
       const io = new IntersectionObserver(entries => {
         entries.forEach(en => {
           if (!en.isIntersecting) return;
           const img = en.target;
           img.src = img.dataset.src;
           img.removeAttribute('data-src');
           io.unobserve(img);
         });
       }, { rootMargin: '200px' });
   
       toObserve.forEach(i => io.observe(i));
     } else {
       toObserve.forEach(i => { i.src = i.dataset.src; i.removeAttribute('data-src'); });
     }
   }
   
   /* -------------------------
      STICKY HEADER
      ------------------------- */
   function initStickyHeader() {
     const header = document.getElementById('main-header');
     if (!header) return;
     const threshold = header.offsetHeight + 10;
     window.addEventListener('scroll', () => {
       if (window.scrollY > threshold) header.classList.add('sticky');
       else header.classList.remove('sticky');
     });
   }
   
   /* -------------------------
      CART DEMO
      ------------------------- */
   function initCartDemo() {
     const btn = document.querySelector('.cart-btn');
     if (!btn) return;
     let count = parseInt(localStorage.getItem('vv_cart_count') || '1', 10);
     render();
   
     btn.addEventListener('click', (e) => {
       e.preventDefault();
       count++;
       localStorage.setItem('vv_cart_count', count);
       render();
     });
   
     function render() {
       btn.textContent = `🛒 Carro (${count})`;
     }
   }
   
   /* -------------------------
      ACCESSIBILITY SHORTCUTS
      ------------------------- */
   function initAccessibilityShortcuts() {
     const input = document.querySelector('.search-box input');
     document.addEventListener('keydown', (e) => {
       const tag = document.activeElement.tagName.toLowerCase();
       if (tag === 'input' || tag === 'textarea' || document.activeElement.isContentEditable) return;
       if (e.key === 's' || e.key === '/') {
         e.preventDefault();
         if (input) { input.focus(); input.select && input.select(); }
       }
     });
   }
   
   /* -------------------------
      CHATBOT UI + INTEGRACIÓN N8N
      ------------------------- */
   function initChatbotUI() {
     const rootBtn = document.getElementById('vv-chat-button');
     const container = document.getElementById('vv-chat-container');
     const closeBtn = document.getElementById('vv-chat-close');
     const messages = document.getElementById('vv-chat-messages');
     const input = document.getElementById('vv-chat-text');
     const sendBtn = document.getElementById('vv-chat-send');
   
     if (!rootBtn || !container) return;
   
     // abrir / cerrar
     rootBtn.addEventListener('click', () => { container.classList.toggle('hidden'); if (!container.classList.contains('hidden')) input.focus(); });
     closeBtn.addEventListener('click', () => container.classList.add('hidden'));
   
     // helpers
     function addUserMessage(text) {
       const div = document.createElement('div');
       div.className = 'vv-msg vv-user';
       div.textContent = text;
       messages.appendChild(div);
       messages.scrollTop = messages.scrollHeight;
     }
   
     function addBotMessage(text) {
       const wrap = document.createElement('div');
       wrap.className = 'vv-msg vv-bot';
       const img = document.createElement('img');
       img.src = 'img/robot.jpeg'; // icono del bot
       img.alt = 'robot';
       const bubble = document.createElement('div');
       bubble.textContent = text;
       wrap.appendChild(img);
       wrap.appendChild(bubble);
       messages.appendChild(wrap);
       messages.scrollTop = messages.scrollHeight;
     }
   
     function addTyping() {
       const el = document.createElement('div');
       el.className = 'vv-typing';
       el.textContent = 'El asistente está escribiendo...';
       el.id = 'vv-typing';
       messages.appendChild(el);
       messages.scrollTop = messages.scrollHeight;
     }
   
     function removeTyping() {
       const t = document.getElementById('vv-typing');
       if (t) t.remove();
     }
   
     // enviar
     async function sendMessage() {
       const text = input.value.trim();
       if (!text) return;
       addUserMessage(text);
       input.value = '';
       addTyping();
   
       // Si no tienes webhook listo y quieres demo local, responde con mock
       if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.includes('TU_N8N_WEBHOOK_URL_AQUI')) {
         // demo: respuesta simulada después de 600ms
         setTimeout(() => {
           removeTyping();
           addBotMessage('Hola 👋 soy el asistente de demo. Reemplace N8N_WEBHOOK_URL en script.js para enviar mensajes reales.');
         }, 600);
         return;
       }
   
       // enviar al webhook (tu n8n)
       try {
         const res = await fetch(N8N_WEBHOOK_URL, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ message: text, source: 'web' })
         });
   
         // esperar respuesta JSON { reply: "texto" } o similar.
         if (!res.ok) {
           removeTyping();
           addBotMessage('Error: no se obtuvo respuesta del asistente.');
           return;
         }
   
         const json = await res.json();
         removeTyping();
   
         // si tu n8n devuelve un campo "reply" o "text" lo mostramos, si no mostramos todo el json
         const reply = json.reply || json.text || (json[0] && (json[0].reply || json[0].text));
         if (reply) addBotMessage(String(reply));
         else addBotMessage(JSON.stringify(json).slice(0, 500)); // no imprimir todo si es grande
   
       } catch (err) {
         removeTyping();
         addBotMessage('Error al conectar con el asistente. Verifica tu webhook.');
         console.error('Chatbot send error', err);
       }
     }
   
     // eventos
     sendBtn.addEventListener('click', sendMessage);
     input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
   
     // saludo inicial (opcional)
     setTimeout(() => {
       addBotMessage('¡Hola! 👋 Soy el asistente de VideoVision. ¿En qué puedo ayudarte hoy?');
     }, 700);
   }
   