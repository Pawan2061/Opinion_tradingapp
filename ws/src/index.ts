import { WebSocket, WebSocketServer } from "ws";
import express from "express";
import { createClient } from "redis";
const app = express();
const httpServer = app.listen(8080);

const wss = new WebSocketServer({
  server: httpServer,
});

const redisClient = createClient();
const users = new Map<string, any>();

wss.on("connection", (ws) => {
  console.log("client connexted");
  ws.on("message", async (message: any) => {
    const data = JSON.parse(message);
    console.log(data);

    if (data.action === "suscribe") {
      console.log("reached here");

      const { symbol } = data;
      console.log(symbol);

      if (!users.has(symbol)) {
        const sendData = (message: string) => {
          if (ws.readyState === WebSocket.OPEN) {
            const toSend = {
              event: "orderbook_change",
              message,
            };
            ws.send(JSON.stringify(data));
          }
        };

        await redisClient.subscribe(symbol, sendData);
        users.set(symbol, sendData);
      }
      ws.send(JSON.stringify(data));
    }
  });
  ws.on("close", () => {
    console.log("closing the server");
  });
});

async function setup() {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error(error, " is there");
  }
}

setup();
