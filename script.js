/* -------------------------
   CONFIGURACIÓN (para compatibilidad)
   ------------------------- */
// El script de n8n Chat ya maneja la comunicación, así que NO necesitas la URL aquí.
const N8N_WEBHOOK_URL = "https://kate16.app.n8n.cloud/webhook/42197a58-f37a-4ccc-ba51-c21153417388/chat"; // Lo mantengo por si se usa para otros elementos, pero ya no se necesita en el fetch.

// Selección de elementos del DOM
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  initChatbotUI();  // Inicializamos la interfaz del chat sin hacer fetch manual.
});

/* -------------------------
   CHATBOT UI + INTERACCIÓN
   ------------------------- */
function initChatbotUI() {
  const rootBtn = document.getElementById('vv-chat-button');
  const container = document.getElementById('vv-chat-container');
  const closeBtn = document.getElementById('vv-chat-close');
  const messages = document.getElementById('vv-chat-messages');
  const input = document.getElementById('vv-chat-text');
  const sendBtn = document.getElementById('vv-chat-send');

  if (!rootBtn || !container) return;

  // Abrir / cerrar chat al hacer click en el botón
  rootBtn.addEventListener('click', () => {
    container.classList.toggle('hidden');
    if (!container.classList.contains('hidden')) input.focus();
  });

  closeBtn.addEventListener('click', () => {
    container.classList.add('hidden');
  });

  // Manejadores de mensajes de usuario y bot
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
    img.src = 'img/robot.jpeg';  // Icono del bot
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

  // El botón de enviar (dentro de la interacción con n8n)
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // Mostramos el mensaje del usuario en el chat
    addUserMessage(text);
    input.value = '';  // Limpiamos el campo de entrada
    addTyping();  // Indicamos que el bot está escribiendo

    // Aquí no necesitamos hacer fetch manual a n8n, porque el chat integrado ya maneja la comunicación.
    // La respuesta se gestionará automáticamente por el script cargado desde n8n.

    // Se simula que el bot está escribiendo mientras espera la respuesta real
    setTimeout(() => {
      removeTyping();
      addBotMessage('¡Gracias por tu mensaje! Estoy procesando tu solicitud...');
    }, 1000);
  }

  // Manejamos el evento del botón de enviar
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });

  // Saludo inicial cuando se carga el chat
  setTimeout(() => {
    addBotMessage('¡Hola! 👋 Soy el asistente de VideoVision. ¿En qué puedo ayudarte hoy?');
  }, 600);
}
