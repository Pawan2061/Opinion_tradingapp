import express from "express";
import { createClient } from "redis";

import { createUser } from "./controllers/userController";
import { processRequests } from "./utils/process";
import { queueRequest } from "./interface/request";
import { WebSocket } from "ws";
const app = express();

const requestQueue = "request";
export const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
  console.log("connection established");
});

ws.on("close", () => {
  console.log("connectiion closed");
});

ws.on("error", () => {
  console.log("connectiion error");
});
export const redisClient = createClient({});

export const pubClient = createClient({});

async function redisConnect() {
  try {
    await redisClient.connect();
    redisClient.on("error", (err) => {
      console.log("Redis client error", err);
    });

    console.log("connected");
    executeProcess();
  } catch (error) {
    console.log(error);
  }
}
redisConnect();

async function executeProcess() {
  console.log("request");

  const resp = await redisClient.brPop(requestQueue, 0);
  console.log("nedeoo");
  console.log(resp);

  await processRequests(JSON.parse(resp!.element));

  executeProcess();
}

app.listen(3002, () => {
  console.log("wprking on 3002");
});
