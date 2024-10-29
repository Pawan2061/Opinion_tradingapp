"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const ws_2 = __importDefault(require("ws"));
const app = (0, express_1.default)();
const httpServer = app.listen(8080);
const wss = new ws_1.WebSocketServer({
    server: httpServer,
});
const redisClient = (0, redis_1.createClient)();
const users = new Map();
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
    ws.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const messageString = typeof message === "string" ? message : message.toString();
        const data = JSON.parse(messageString);
        if (data.type === "subscribe") {
            const { stockSymbol } = data;
            if (!users.has(stockSymbol)) {
                console.log("inside websockets");
                const listener = (message) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    console.log(message, "message is here");
                    (_a = users.get(stockSymbol)) === null || _a === void 0 ? void 0 : _a.forEach((client) => {
                        console.log("inside clients");
                        if (client.readyState === ws_2.default.OPEN) {
                            const data = {
                                event: `event_orderbook_update`,
                                message,
                            };
                            client.send(JSON.stringify(data));
                            console.log(`Sent update for ${stockSymbol}:`, JSON.stringify(data));
                        }
                    });
                });
                console.log(`orderbook.${stockSymbol}`);
                yield redisClient.subscribe(`orderbook.${stockSymbol}`, listener);
                users.set(stockSymbol, new Set([ws]));
                console.log(`Subscribed to orderbook.${stockSymbol}`);
            }
            else {
                (_a = users.get(stockSymbol)) === null || _a === void 0 ? void 0 : _a.add(ws);
            }
        }
    }));
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("hi gy");
            yield redisClient.connect();
        }
        catch (error) {
            console.error(error, " is there");
        }
    });
}
setup();
