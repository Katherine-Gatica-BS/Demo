/* -------------------------
   CONFIG: N8N CHAT INTEGRADO (CLOUD)
   ------------------------- */
   const N8N_WEBHOOK_URL =
   "https://kate16.app.n8n.cloud/webhook/42197a58-f37a-4ccc-ba51-c21153417388/chat";
 
 /* ------------------------- */
 
 const $ = sel => document.querySelector(sel);
 const $$ = sel => Array.from(document.querySelectorAll(sel));
 
 document.addEventListener('DOMContentLoaded', () => {
   initChatbotUI();
 });
 
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
 
   // abrir / cerrar
   rootBtn.addEventListener('click', () => {
     container.classList.toggle('hidden');
     if (!container.classList.contains('hidden')) input.focus();
   });
 
   closeBtn.addEventListener('click', () => {
     container.classList.add('hidden');
   });
 
   // helpers UI
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
 
   // enviar mensaje
   async function sendMessage() {
     const text = input.value.trim();
     if (!text) return;
 
     addUserMessage(text);
     input.value = '';
     addTyping();
 
     try {
       const res = await fetch(N8N_WEBHOOK_URL, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           chatInput: text
         })
       });
 
       if (!res.ok) {
         removeTyping();
         addBotMessage('No se pudo obtener respuesta del asistente.');
         return;
       }
 
       const data = await res.json();
       removeTyping();
 
       // Respuesta típica del Agente IA
       let reply = '';
 
       if (Array.isArray(data) && data[0]?.output) {
         reply = data[0].output;
       } else if (data.output) {
         reply = data.output;
       } else {
         reply = 'Respuesta recibida, pero con formato inesperado.';
         console.warn('Respuesta n8n:', data);
       }
 
       addBotMessage(String(reply));
 
     } catch (err) {
       removeTyping();
       addBotMessage('Error al conectar con el asistente.');
       console.error('Chatbot error:', err);
     }
   }
 
   // eventos
   sendBtn.addEventListener('click', sendMessage);
   input.addEventListener('keydown', e => {
     if (e.key === 'Enter') sendMessage();
   });
 
   // saludo inicial
   setTimeout(() => {
     addBotMessage(
       '¡Hola! 👋 Soy el asistente de VideoVision. ¿En qué puedo ayudarte?'
     );
   }, 600);
 }
 