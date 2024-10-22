import { WebSocketServer } from "ws";
import express from "express";
import { createClient } from "redis";
import WebSocket from "ws";
const app = express();
const httpServer = app.listen(8080);

const wss = new WebSocketServer({
  server: httpServer,
});

const redisClient = createClient();
const users = new Map<string, Set<WebSocket>>();

// wss.on("connection", (ws:WebSocket) => {
//   console.log("client connexted");

// ws.on("message", async (message: any) => {
//   // wss.clients.forEach((client)=>{
//   //   if(ws.readyState===WebSocket.OPEN){
//   //     client.send(JSON.stringify(message.))
//   //   }
//   // })
//   console.log(message);

//   const data = JSON.parse(message);
//   console.log(data);

//   // if (data.type === "subscribe") {
//   console.log("reached here");

//   const { stockSymbol } = data;
//   console.log(stockSymbol);

//   if (!users.has(stockSymbol)) {
//     console.log("already inside");

//     const sendData = (message: string) => {
//       console.log("inside send data");

//       console.log(message);
//       if (ws.readyState === WebSocket.OPEN) {
//         const data = {
//           event: "orderbook_change",
//           data: stockSymbol,
//         };
//         ws.send(JSON.stringify(data));
//       }

//       // users.get(stockSymbol)?.forEach((client) => {
//       //   if (client.readyState === WebSocket.OPEN) {
//       //     client.send(
//       //       JSON.stringify({
//       //         event: "orderbook_change",
//       //         data: stockSymbol,
//       //       })
//       //     );
//       //   }
//       // });
//     };

//     console.log("subscribing");

//     await redisClient.subscribe(stockSymbol, sendData);
//     console.log("subscribed");

//     users.set(stockSymbol, new Set([ws]));
//   } else {
//     users.get(stockSymbol)?.add(ws);
//   }

//   // redisClient.on("message", (data) => {

//   //   ws.send(
//   //     JSON.stringify({
//   //       event: "orderbook_change",
//   //       data: data,
//   //     })
//   //   );
//   // });
//   // wss.clients.forEach((client) => {
//   //   client.send(JSON.stringify(data));
//   // });
//   // }
//   // });
//   wss.on("connection", (ws:WebSocket) => {
//     console.log("Client connected");

//     ws.on("message", async (message: WebSocket.RawData) => {
//       const messageString =
//         typeof message === "string" ? message : message.toString();
//       const data = JSON.parse(messageString);

//       if (data.type === "subscribe") {
//         const { stockSymbol } = data;

//         if (!users.has(stockSymbol)) {
//           const listener = (message: string) => {
//             if (ws.readyState === WebSocket.OPEN) {
//               const data = {
//                 event: `event_orderbook_update`,
//                 message,
//               };
//               ws.send(JSON.stringify(data));
//               console.log(
//                 `Sent update for ${stockSymbol}:`,
//                 JSON.stringify(data)
//               );
//             }
//           };

//           await redisClient.subscribe(`orderbook.${stockSymbol}`, listener); // Subscribing to Redis channel
//           users.set(stockSymbol, listener);

//           console.log(`Subscribed to orderbook.${stockSymbol}`);
//         }
//       }

//       // handle unsubscribe logic
//     });
//   });

//   ws.on("close", () => {
//     console.log("Client disconnected");

//     users.forEach((sendData, symbol) => {
//       redisClient.unsubscribe(symbol);

//       users.delete(symbol); // Remove user from map
//     });
//   });
// });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message: WebSocket.RawData) => {
    const messageString =
      typeof message === "string" ? message : message.toString();
    const data = JSON.parse(messageString);

    if (data.type === "subscribe") {
      const { stockSymbol } = data;

      if (!users.has(stockSymbol)) {
        const listener = (message: string) => {
          users.get(stockSymbol)?.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              const data = {
                event: `event_orderbook_update`,
                message,
              };
              client.send(JSON.stringify(data));
              console.log(
                `Sent update for ${stockSymbol}:`,
                JSON.stringify(data)
              );
            }
          });
        };
        console.log(`orderbook.${stockSymbol}`);

        await redisClient.subscribe(`orderbook.${stockSymbol}`, listener); // Subscribing to Redis channel
        users.set(stockSymbol, new Set([ws]));

        console.log(`Subscribed to orderbook.${stockSymbol}`);
      } else {
        users.get(stockSymbol)?.add(ws);
      }
    }

    // handle unsubscribe logic
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
