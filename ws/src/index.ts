import express from "express";
import { WebSocketServer } from "ws";
const app = express();

const server = app.listen(8080);

const wss = new WebSocketServer({
  server: server,
});

wss.on("connection", (ws: WebSocket) => {
  ws.send("wokringnvrn");
  console.log("wokring here");
});
