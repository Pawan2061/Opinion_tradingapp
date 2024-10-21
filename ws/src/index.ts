import { WebSocket, WebSocketServer } from "ws";
import express from "express";
import { createClient } from "redis";
const app = express();
const httpServer = app.listen(8080);

const wss = new WebSocketServer({
  server: httpServer,
});

const redisClient = createClient();
const users = new Map<string, Set<WebSocket>>();

wss.on("connection", (ws) => {
  console.log("client connexted");

  ws.on("message", async (message: any) => {
    // wss.clients.forEach((client)=>{
    //   if(ws.readyState===WebSocket.OPEN){
    //     client.send(JSON.stringify(message.))
    //   }
    // })

    const data = JSON.parse(message);
    console.log(data);

    if (data.type === "subscribe") {
      console.log("reached here");

      const { stockSymbol } = data;
      console.log(stockSymbol);

      if (!users.has(stockSymbol)) {
        console.log("already inside");

        const sendData = (message: string) => {
          console.log("data");

          users.get(stockSymbol)?.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  event: "orderbook_change",
                  data: stockSymbol,
                })
              );
            }
          });
        };

        await redisClient.subscribe(stockSymbol, sendData);

        users.set(stockSymbol, new Set([ws]));
      } else {
        users.get(stockSymbol)?.add(ws);
      }

      redisClient.on("message", (data) => {
        console.log(data, "first");

        ws.send(
          JSON.stringify({
            event: "orderbook_change",
            data: data,
          })
        );
      });
      // await redisClient.subscribe(symbol, sendData);
      // users.set(symbol, sendData);
      // ws.send(JSON.stringify(data));
    }
  });
  ws.on("close", () => {
    console.log("Client disconnected");

    // Optionally: Unsubscribe from Redis if needed
    users.forEach((sendData, symbol) => {
      redisClient.unsubscribe(symbol); // Unsubscribe logic
      users.delete(symbol); // Remove user from map
    });
  });
});

async function setup() {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error(error, " is there");
  }
}

setup();
