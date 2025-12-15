document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('vv-chat-root');
    if (!root) return;
  
    // Shadow DOM para aislamiento total
    const shadow = root.attachShadow({ mode: 'open' });
  
    shadow.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
          font-family: Inter, Arial, sans-serif;
        }
  
        #fab {
          position: fixed;
          right: 24px;
          bottom: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #ff5a3c;
          color: #fff;
          border: none;
          font-size: 22px;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(0,0,0,.25);
          z-index: 999999;
        }
  
        #panel {
          position: fixed;
          right: 24px;
          bottom: 90px;
          width: 340px;
          height: 460px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,.25);
          display: none;
          flex-direction: column;
          overflow: hidden;
          z-index: 999999;
        }
  
        header {
          background: linear-gradient(90deg, #0b304f, #14445f);
          color: #fff;
          padding: 14px 16px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
  
        header button {
          background: none;
          border: none;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
        }
  
        #messages {
          flex: 1;
          padding: 14px;
          overflow-y: auto;
          background: #f5f7fa;
        }
  
        .bubble {
          max-width: 80%;
          padding: 10px 14px;
          margin-bottom: 10px;
          border-radius: 14px;
          font-size: 14px;
          line-height: 1.4;
        }
  
        .user {
          margin-left: auto;
          background: #ff5a3c;
          color: #fff;
        }
  
        .bot {
          background: #fff;
          color: #1e2a34;
          box-shadow: 0 4px 10px rgba(0,0,0,.08);
        }
  
        footer {
          display: flex;
          padding: 10px;
          gap: 8px;
          border-top: 1px solid #ddd;
        }
  
        footer input {
          flex: 1;
          padding: 10px 12px;
          border-radius: 20px;
          border: 1px solid #ccc;
          outline: none;
        }
  
        footer button {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background: #ff5a3c;
          color: #fff;
          cursor: pointer;
        }
      </style>
  
      <button id="fab">💬</button>
  
      <div id="panel">
        <header>
          <span>Asistente VideoVision</span>
          <button id="close">✕</button>
        </header>
  
        <div id="messages"></div>
  
        <footer>
          <input id="input" placeholder="Escribe tu mensaje…" />
          <button id="send">➤</button>
        </footer>
      </div>
    `;
  
    const fab = shadow.getElementById('fab');
    const panel = shadow.getElementById('panel');
    const close = shadow.getElementById('close');
    const messages = shadow.getElementById('messages');
    const input = shadow.getElementById('input');
    const send = shadow.getElementById('send');
  
    fab.onclick = () => panel.style.display = 'flex';
    close.onclick = () => panel.style.display = 'none';
  
    send.onclick = sendMessage;
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendMessage();
    });
  
    function addBubble(text, type) {
      const div = document.createElement('div');
      div.className = `bubble ${type}`;
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }
  
    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
  
      addBubble(text, 'user');
      input.value = '';
  
      const typing = document.createElement('div');
      typing.className = 'bubble bot';
      typing.textContent = 'Escribiendo…';
      messages.appendChild(typing);
  
      try {
        const res = await fetch('https://kate16.app.n8n.cloud/webhook/videovision-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });
  
        const data = await res.json();
        typing.remove();
        addBubble(data.reply, 'bot');
      } catch {
        typing.remove();
        addBubble('Error de conexión.', 'bot');
      }
    }
  });
  