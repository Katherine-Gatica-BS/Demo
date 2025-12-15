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
   CONFIG: aquí va el webhook de n8n (PRODUCCIÓN)
   ------------------------- */
   const N8N_WEBHOOK_URL = "https://kate16.app.n8n.cloud/webhook/041695b0-e8c7-4aa7-ba2b-8e6950761468";
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
         });
         list.appendChild(li);
       });
   
       list.style.display = 'block';
     });
   
     document.addEventListener('click', (ev) => {
       if (!container.contains(ev.target)) list.style.display = 'none';
     });
   }
   
   /* -------------------------
      CHATBOT UI + N8N
   ------------------------- */
   function initChatbotUI() {
     const rootBtn = document.getElementById('vv-chat-button');
     const container = document.getElementById('vv-chat-container');
     const closeBtn = document.getElementById('vv-chat-close');
     const messages = document.getElementById('vv-chat-messages');
     const input = document.getElementById('vv-chat-text');
     const sendBtn = document.getElementById('vv-chat-send');
   
     if (!rootBtn || !container) return;
   
     rootBtn.addEventListener('click', () => {
       container.classList.toggle('hidden');
       if (!container.classList.contains('hidden')) input.focus();
     });
   
     closeBtn.addEventListener('click', () => container.classList.add('hidden'));
   
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
       img.src = 'img/robot.jpeg';
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
       el.id = 'vv-typing';
       el.textContent = 'El asistente está escribiendo...';
       messages.appendChild(el);
       messages.scrollTop = messages.scrollHeight;
     }
   
     function removeTyping() {
       const t = document.getElementById('vv-typing');
       if (t) t.remove();
     }
   
     async function sendMessage() {
       const text = input.value.trim();
       if (!text) return;
   
       addUserMessage(text);
       input.value = '';
       addTyping();
   
       try {
         const res = await fetch(N8N_WEBHOOK_URL, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ message: text, source: 'web' })
         });
   
         if (!res.ok) {
           removeTyping();
           addBotMessage('Error al comunicarse con el asistente.');
           return;
         }
   
         // ✅ CAMBIO CLAVE: ahora leemos TEXTO
         const replyText = await res.text();
         removeTyping();
         addBotMessage(replyText);
   
       } catch (err) {
         removeTyping();
         addBotMessage('Error de conexión con el asistente.');
         console.error('Chatbot send error', err);
       }
     }
   
     sendBtn.addEventListener('click', sendMessage);
     input.addEventListener('keydown', (e) => {
       if (e.key === 'Enter') sendMessage();
     });
   
     setTimeout(() => {
       addBotMessage('¡Hola! 👋 Soy el asistente de VideoVision. ¿En qué puedo ayudarte?');
     }, 700);
   }
   