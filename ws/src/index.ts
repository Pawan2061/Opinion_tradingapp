import express from "express";
import { WebSocketServer } from "ws";
import { ORDERBOOK } from "../../backend/src/data/dummy";
const app = express();

const server = app.listen(8080);
console.log(JSON.stringify(ORDERBOOK), "here");
const data = JSON.stringify(ORDERBOOK);

const wss = new WebSocketServer({
  server: server,
});
wss.on("connection", (ws: WebSocket) => {
  ws.send(data);

  console.log("wokring here");
});

setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(ORDERBOOK));
    }
  });
}, 10000);
