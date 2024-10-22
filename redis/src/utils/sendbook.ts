import { createClient } from "redis";
import { ws } from "..";

export const displayBook = async (symbol: string, orderbook: any) => {
  const pubClient = createClient();
  await pubClient.connect();

  try {
    console.log(`orderbook.${symbol}  this is nothing else`);

    await pubClient.publish(`orderbook.${symbol}`, JSON.stringify(orderbook));
  } catch (error) {
    console.log(error);

    throw new Error("cant proceed with the orderbook");
  }
};
