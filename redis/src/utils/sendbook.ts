import { createClient } from "redis";
import { ws } from "..";

export const displayBook = async (symbol: string, orderbook: any) => {
  const pubClient = createClient();
  await pubClient.connect();

  try {
    console.log("_________________________________");
    console.log(symbol);
    console.log(orderbook);

    // ws.send(JSON.stringify(orderbook));

    await pubClient.publish(symbol, JSON.stringify(orderbook));
    console.log("ppubslieshd");
  } catch (error) {
    console.log(error);

    throw new Error("cant proceed with the orderbook");
  }
};
