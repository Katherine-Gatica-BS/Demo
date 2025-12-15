/* =========================
   CONFIG N8N
========================= */
const N8N_WEBHOOK_URL = "https://kate16.app.n8n.cloud/webhook/041695b0-e8c7-4aa7-ba2b-8e6950761468";

/* =========================
   CHATBOT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const btnOpen = document.getElementById("vv-chat-button");
  const container = document.getElementById("vv-chat-container");
  const btnClose = document.getElementById("vv-chat-close");
  const messages = document.getElementById("vv-chat-messages");
  const input = document.getElementById("vv-chat-text");
  const btnSend = document.getElementById("vv-chat-send");

  if (!btnOpen || !container) return;

  btnOpen.onclick = () => {
    container.classList.toggle("hidden");
    input.focus();
  };

  btnClose.onclick = () => {
    container.classList.add("hidden");
  };

  function addUserMessage(text) {
    const div = document.createElement("div");
    div.className = "vv-msg vv-user";
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function addBotMessage(text) {
    const div = document.createElement("div");
    div.className = "vv-msg vv-bot";
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function addTyping() {
    const div = document.createElement("div");
    div.id = "vv-typing";
    div.className = "vv-typing";
    div.textContent = "Escribiendo...";
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById("vv-typing");
    if (t) t.remove();
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = "";
    addTyping();

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text
        })
      });

      if (!response.ok) {
        removeTyping();
        addBotMessage("Error al conectar con el asistente.");
        return;
      }

      // 🔑 CLAVE: n8n responde TEXTO
      const reply = await response.text();

      removeTyping();
      addBotMessage(reply || "No recibí respuesta.");

    } catch (error) {
      console.error(error);
      removeTyping();
      addBotMessage("Error de red con el asistente.");
    }
  }

  btnSend.onclick = sendMessage;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Mensaje inicial
  setTimeout(() => {
    addBotMessage("¡Hola! 👋 ¿En qué puedo ayudarte?");
  }, 600);
});
