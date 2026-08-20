import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "http";

import { connectRedis } from "./redis/redisClient";
import { initializeWebSocket } from "./websocket/websocketHandler";

const app = express();

const PORT =
  Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message:
      "Naruto Card Battle Server is running"
  });
});

const server = createServer(app);

const wss =
  new WebSocketServer({
    server
  });

initializeWebSocket(wss);

async function startServer() {
  try {
    await connectRedis();

    server.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `HTTP server running on port ${PORT}`
        );

        console.log(
          "WebSocket server is ready"
        );
      }
    );
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
}

startServer();