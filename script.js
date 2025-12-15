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
  
  // Debug para el chatbot de n8n
  setTimeout(() => {
    const chatRoot = $('#vv-chat-root');
    console.log('Contenedor del chat:', chatRoot);
    if (chatRoot && chatRoot.innerHTML.trim() === '') {
      console.warn('El bundle de n8n no cargó el chat. Activando chatbot personalizado como alternativa.');
      initCustomChatbot();  // Activa el chatbot simple si n8n falla
    } else {
      console.log('Chat de n8n cargado correctamente.');
    }
  }, 3000);  // Espera 3 segundos para que el bundle cargue
});

// Función para chatbot personalizado (alternativa si n8n no funciona)
function initCustomChatbot() {
  const chatRoot = $('#vv-chat-root');
  chatRoot.innerHTML = `
    <div id="custom-chat" style="position: fixed; right: 20px; bottom: 20px; width: 300px; height: 400px; background: #fff; border: 1px solid #ccc; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 9999; display: flex; flex-direction: column;">
      <div style="background: #0b304f; color: #fff; padding: 10px; border-radius: 10px 10px 0 0;">Chat Asistente</div>
      <div id="chat-messages" style="flex: 1; padding: 10px; overflow-y: auto;"></div>
      <input id="chat-input" type="text" placeholder="Escribe un mensaje..." style="padding: 10px; border: none; border-top: 1px solid #ccc;">
      <button id="chat-send" style="background: #ff5a3c; color: #fff; border: none; padding: 10px; cursor: pointer;">Enviar</button>
    </div>
  `;
  
  const messagesDiv = $('#chat-messages');
  const input = $('#chat-input');
  const sendBtn = $('#chat-send');
  
  sendBtn.addEventListener('click', async () => {
    const message = input.value.trim();
    if (!message) return;
    messagesDiv.innerHTML += `<p><strong>Tú:</strong> ${message}</p>`;
    input.value = '';
    
    // Envía a n8n (usando fetch para el trigger público)
    try {
      const response = await fetch('https://kate16.app.n8n.cloud/webhook/42197a58-f37a-4ccc-ba51-c21153417388/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      messagesDiv.innerHTML += `<p><strong>Asistente:</strong> ${data.output || 'Respuesta de n8n'}</p>`;
    } catch (error) {
      messagesDiv.innerHTML += `<p><strong>Asistente:</strong> Lo siento, hay un error. Intenta de nuevo.</p>`;
      console.error('Error en fetch a n8n:', error);
    }
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

/* ------------------ MOBILE NAV ------------------ */
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

/* ------------------ SEARCH ------------------ */
function initSearchSuggestions() {
  const container = $('.search-box');
  if (!container) return;
  const input = $('input', container);
  const suggestions = ['Cámaras IP 4K', 'Central de incendio UL', 'Detector de humo', 'Panel Inim', 'Soporte técnico', 'Grabadores NVR'];
  const list = document.createElement('ul');
  list.className = 'search-suggestions';
  list.hidden = true;
  container.appendChild(list);

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    list.innerHTML = '';
    if (!q) return (list.hidden = true);
    suggestions.filter(s => s.toLowerCase().includes(q)).forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      li.onclick = () => { input.value = text; list.hidden = true; };
      list.appendChild(li);
    });
    list.hidden = list.children.length === 0;
  });
  document.addEventListener('click', e => { if (!container.contains(e.target)) list.hidden = true; });
}

/* ------------------ HERO SLIDER ------------------ */
function initHeroSlider() {
  const wrapper = $('.hero-slider-wrapper'); if (!wrapper) return;
  const slides = $$('.hero-slide', wrapper); let index = 0;
  function show(i) { slides.forEach((s, idx) => { s.style.display = idx===i?'block':'none'; const img=$('img',s); if(img) img.style.opacity=idx===i?'1':'0'; }); }
  show(index);
  setInterval(()=>{ index=(index+1)%slides.length; show(index); },4500);
}

/* ------------------ LAZY LOAD ------------------ */
function initLazyLoad() {
  const imgs = $$('img[data-src]'); if(!imgs.length) return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.src=e.target.dataset.src;
      e.target.removeAttribute('data-src');
      io.unobserve(e.target);
    });
  }, { rootMargin:'200px' });
  imgs.forEach(img=>io.observe(img));
}

/* ------------------ STICKY HEADER ------------------ */
function initStickyHeader() {
  const header = $('#main-header'); if(!header) return;
  const limit=header.offsetHeight;
  window.addEventListener('scroll',()=>{ header.classList.toggle('sticky',window.scrollY>limit); });
}

/* ------------------ CART ------------------ */
function initCartDemo() {
  const btn = $('.cart-btn'); if(!btn) return;
  let count = Number(localStorage.getItem('vv_cart')||0); render();
  btn.onclick = e => { e.preventDefault(); count++; localStorage.setItem('vv_cart',count); render(); }
  function render(){ btn.textContent=`🛒 Carro (${count})`; }
}

/* ------------------ ACCESSIBILITY ------------------ */
function initAccessibilityShortcuts() {
  const input = $('.search-box input');
  document.addEventListener('keydown',e=>{ if(e.key==='/' && input){ e.preventDefault(); input.focus(); }});
}