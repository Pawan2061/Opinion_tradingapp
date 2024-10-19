import { ws } from "..";

export const displayBook = async (orderbook: string) => {
  try {
    ws.send(orderbook);
  } catch (error) {
    console.log(error);

    throw new Error("cant proceed with the orderbook");
  }
};
