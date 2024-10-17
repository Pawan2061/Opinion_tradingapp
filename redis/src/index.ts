import express from "express";
import { createClient } from "redis";
const app = express();

export const redisClient = createClient({});

async function redisConnect() {
  try {
    await redisClient.connect();

    console.log("connected");

    const resp = await redisClient.brPop("22", 0);

    console.log(resp, "thwere");
  } catch (error) {
    console.log(error);
  }
}
redisConnect();

app.listen(3002, () => {
  console.log("wprking on 3002");
});
