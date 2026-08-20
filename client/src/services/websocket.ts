const WS_URL =
  import.meta.env.VITE_WS_URL ||
  "ws://localhost:3000";

let socket: WebSocket | null = null;

export function connectWebSocket(
  onMessage: (data: any) => void,
  onOpen?: () => void,
  onClose?: () => void,
  onError?: (error: Event) => void
): WebSocket {
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log("WebSocket connected");

    if (onOpen) {
      onOpen();
    }
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      console.log("SERVER:", data);

      onMessage(data);
    } catch (error) {
      console.error(
        "Failed to parse WebSocket message:",
        error
      );
    }
  };

  socket.onerror = (error) => {
    console.error(
      "WebSocket error:",
      error
    );

    if (onError) {
      onError(error);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");

    if (onClose) {
      onClose();
    }
  };

  return socket;
}

export function sendMessage(
  message: Record<string, unknown>
): void {
  if (!socket) {
    console.error(
      "WebSocket is not connected"
    );

    return;
  }

  if (
    socket.readyState !==
    WebSocket.OPEN
  ) {
    console.error(
      "WebSocket is not open"
    );

    return;
  }

  socket.send(
    JSON.stringify(message)
  );
}

export function disconnectWebSocket(): void {
  if (socket) {
    socket.close();
    socket = null;
  }
}

export function getWebSocket():
  WebSocket | null {
  return socket;
}