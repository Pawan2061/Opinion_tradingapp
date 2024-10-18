import express, { json } from "express";
import { proboRouter } from "./routes/proboRoute";
import { WebSocket } from "ws";
import { createClient } from "redis";

export const redisClient = createClient();
const app = express();
app.use(express.json());

// ws.on("open", () => {
//   console.log("socketio");
//   ws.send("ehfue");
//   // ws.send(data);
// });
app.use("/api/v1", proboRouter);

async function startRedisServer() {
  await redisClient.connect();

  console.log("connected to redis");
  app.listen(3000, () => {
    console.log("server is running on port 3000");
  });
}

startRedisServer();
