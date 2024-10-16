import express from "express";
import { proboRouter } from "./routes/proboRoute";
import { WebSocket } from "ws";

const app = express();
app.use(express.json());
export const ws = new WebSocket("ws://localhost:8080");
ws.on("open", () => {
  console.log("socketio");
});
app.use("/api/v1", proboRouter);

app.listen(3000, () => {
  console.log(`wokring on port 3000`);
});
