let socket: WebSocket | null = null

type MessageCallback = (message: any) => void

export const initWebSocket = (client_id: string, onMessage: MessageCallback) => {
  if (socket) return // предотвратить повторные подключения
 console.log(client_id)
  socket = new WebSocket(`ws://10.100.0.61:8031/ws/test-client-1`)

  socket.onopen = () => {
    console.log("WebSocket connected")
  }

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data)
      onMessage(message)
    } catch (e) {
      console.warn("Invalid WebSocket message:", event.data)
    }
  }

  socket.onclose = () => {
    console.log("WebSocket disconnected")
  }

  socket.onerror = (error) => {
    console.error("WebSocket error:", error)
  }
}

export const closeWebSocket = () => {
  if (socket) {
    socket.close()
    socket = null
  }
}


