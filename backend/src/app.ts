import express, { json, Response } from "express";
import { proboRouter } from "./routes/proboRoute";
import { WebSocket } from "ws";
import cors from "cors";
import { createClient } from "redis";
import { authLogin, authSignup } from "./controllers/proboController";
const redis_url = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = createClient({
  url: redis_url,
});
export const subscriber = createClient({
  url: redis_url,
});

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/v1", proboRouter);

app.post("/authSignup", authSignup);
app.post("/authLogin", authLogin);

async function startRedisServer() {
  await redisClient.connect();
  await subscriber.connect();

  console.log("connected to redis");
  app.listen(3000, () => {
    console.log("server is running on port 3000");
  });
}

startRedisServer();
