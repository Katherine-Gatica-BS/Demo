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
  initChatUI();
});

/* ---------------- CHAT UI ---------------- */
function initChatUI() {
  const btn = $('#vv-chat-button');
  const box = $('#vv-chat-container');
  const close = $('#vv-chat-close');
  const input = $('#vv-chat-text');
  const sendBtn = $('#vv-chat-send');
  const messages = $('#vv-chat-messages');

  if (!btn || !box || !close || !input || !sendBtn || !messages) return;

  // Abrir/ocultar chat
  btn.addEventListener('click', () => box.classList.toggle('hidden'));
  close.addEventListener('click', () => box.classList.add('hidden'));

  // Enviar mensaje
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage('user', text);
    input.value = '';
    
    // Enviar al webhook n8n
    fetch(window.n8nChatConfig.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    })
      .then(res => res.json())
      .then(data => {
        appendMessage('bot', data.reply || 'No hay respuesta.');
      })
      .catch(err => {
        appendMessage('bot', 'Error al conectar con el chat.');
        console.error(err);
      });
  }

  function appendMessage(sender, text) {
    const div = document.createElement('div');
    div.className = `chat-message ${sender}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
}
