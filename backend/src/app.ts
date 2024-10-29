import express, { json } from "express";
import { proboRouter } from "./routes/proboRoute";
import { WebSocket } from "ws";
import { createClient } from "redis";
const redis_url = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({
  url: redis_url,
});
export const subscriber = createClient({
  url: redis_url,
});
const app = express();
app.use(express.json());

app.use("/api/v1", proboRouter);

async function startRedisServer() {
  await redisClient.connect();
  await subscriber.connect();

  console.log("connected to redis");
  app.listen(3000, () => {
    console.log("server is running on port 3000");
  });
}

startRedisServer();
