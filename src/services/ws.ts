let socket: WebSocket | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

type MessageCallback = (message: any) => void;

let currentClientId: string | null = null;
let currentOnMessage: MessageCallback | null = null;
let manualClose = false;

const WS_URL = "ws://10.100.0.61:8031/ws/629FBA72-2CEA-43D1-935F-2DFBF712F845"

const connect = () => {
  console.log("🔌 Connecting WebSocket for client:", currentClientId);

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);

      if (message.type === 'ping') {
        console.log("📡 Received ping, sending pong");
        socket?.send(JSON.stringify({ type: 'pong' }));
        return;
      }

      currentOnMessage?.(message);
    } catch (e) {
      console.warn("⚠️ Invalid WebSocket message:", event.data);
    }
  };

  socket.onclose = (event) => {
    console.warn("❌ WebSocket disconnected:", event.reason || "(no reason)");
    socket = null;

    if (!manualClose) {
      console.log("🔄 Reconnecting WebSocket in 5 seconds...");
      reconnectTimeout = setTimeout(() => {
        connect(); // повторно подключаемся
      }, 5000);
    }
  };

  socket.onerror = (error) => {
    console.error("🔥 WebSocket error:", error);
  };
};

export const initWebSocket = (client_id: string, onMessage: MessageCallback) => {
  currentClientId = client_id;
  currentOnMessage = onMessage;
  manualClose = false;

  // 💡 Правильная проверка: можно подключаться, если сокет неактивен
  if (!socket || socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) {
    connect();
  } else {
    console.log("⚠️ WebSocket already open or connecting");
  }
};

export const closeWebSocket = () => {
  console.log("🔌 Manually closing WebSocket...");
  manualClose = true;

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  if (socket) {
    socket.close();
    socket = null;
  }
};
