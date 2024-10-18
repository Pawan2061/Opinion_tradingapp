import express from "express";
import { createClient } from "redis";

import { createUser } from "./controllers/userController";
import { processRequests } from "./utils/process";
import { queueRequest } from "./interface/request";
const app = express();

const requestQueue = "request";
export const ws = new WebSocket("ws://localhost:8080");

export const redisClient = createClient({});

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

  await processRequests(JSON.parse(resp?.element || ""));

  // const data = await createUser(resp?.element || "");
  executeProcess();
}

app.listen(3002, () => {
  console.log("wprking on 3002");
});
