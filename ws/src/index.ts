import { WebSocketServer } from "ws";
import express from "express";
import { createClient } from "redis";
import WebSocket from "ws";
const app = express();
const httpServer = app.listen(8080);

const wss = new WebSocketServer({
  server: httpServer,
});
const redis_url = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient = createClient({
  url: redis_url,
});
const users = new Map<string, Set<WebSocket>>();

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message: WebSocket.RawData) => {
    const messageString =
      typeof message === "string" ? message : message.toString();
    const data = JSON.parse(messageString);

    if (data.type === "subscribe") {
      const { stockSymbol } = data;

      if (!users.has(stockSymbol)) {
        const listener = async (message: string) => {
          users.get(stockSymbol)?.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              const data = {
                event: `event_orderbook_update`,
                message,
              };
              client.send(JSON.stringify(data));
              console.log(
                `Sent update for ${stockSymbol}:`,
                JSON.stringify(data)
              );
            }
          });
        };

        console.log(`orderbook.${stockSymbol}`);

        await redisClient.subscribe(`orderbook.${stockSymbol}`, listener);
        users.set(stockSymbol, new Set([ws]));

        console.log(`Subscribed to orderbook.${stockSymbol}`);
      } else {
        users.get(stockSymbol)?.add(ws);
      }
    }
  });
});

async function setup() {
  try {
    console.log("hi gy");

    await redisClient.connect();
  } catch (error) {
    console.error(error, " is there");
  }
}

setup();
