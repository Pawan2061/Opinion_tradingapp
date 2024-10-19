import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { ORDERBOOK } from "../../backend/src/data/dummy";
const users = new Set<WebSocket>();

const app = express();

const server = app.listen(8080);
const data = JSON.stringify(ORDERBOOK);

const wss = new WebSocketServer({ server });
wss.on("connection", (ws: WebSocket) => {
  console.log("connected");

  ws.send(data);

  ws.on("message", (message, isBinary) => {
    const finalData = isBinary ? message : message.toString();
    console.log(finalData, "Received data");

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(finalData, { binary: isBinary });
      }
    });
  });

  ws.on("close", () => {
    users.delete(ws);
    console.log("Client disconnected");
  });
});

// setInterval(() => {
//   wss.clients.forEach((client) => {
//     if (client.readyState === client.OPEN) {
//       client.send(JSON.stringify(ORDERBOOK));
//     }
//   });
// }, 10000);
