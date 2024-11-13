import { createClient } from "redis";
import { ws } from "..";

export const displayBook = async (symbol: string, orderbook: any) => {
  const redis_url = process.env.REDIS_URL || "redis://localhost:6379";

  const pubClient = createClient({
    url: redis_url,
  });
  await pubClient.connect();

  try {
    console.log(`orderbook.${symbol}`);

    await pubClient.publish(`orderbook.${symbol}`, JSON.stringify(orderbook));
  } catch (error) {
    console.log(error);

    throw new Error("cant proceed with the orderbook");
  } finally {
    await pubClient.disconnect();
  }
};
