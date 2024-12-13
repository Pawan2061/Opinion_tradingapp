import express from "express";

import {
  getBalanceStock,
  getUserBalance,
  rampUser,
  viewOrderbook,
  mintStock,
  createUser,
  createSymbol,
  sellYes,
  getOrderbook,
  getBalances,
  getStocks,
  buyYes,
  buyNo,
  sellNo,
  resetMemory,
  authSignup,
} from "../controllers/proboController";
import { buy, sell } from "../controllers/trade";
export const proboRouter = express.Router();
proboRouter.get("/", (req: Request, res: any) => {
  return res.send("hello");
});
// proboRouter.post("/auth", authSignup);
proboRouter.post("/user/create/:userId", createUser);
proboRouter.post("/symbol/create/:stockSymbol", createSymbol);
proboRouter.post("/onramp/inr", rampUser);
proboRouter.get("/balances/inr", getBalances);
proboRouter.get("/balance/inr/:id", getUserBalance);
proboRouter.get("/orderbook", getOrderbook);
proboRouter.get("/balances/stock", getStocks);
proboRouter.get("/balance/stock/:userId", getBalanceStock);
proboRouter.get("/orderbook/:stockSymbol", viewOrderbook);
proboRouter.post("/order/buy/yes", buyYes);
proboRouter.post("/order/buy/no", buyNo);
proboRouter.post("/order/sell/yes", sellYes);
proboRouter.post("/order/sell/no", sellNo);
proboRouter.post("/trade/mint/", mintStock);

proboRouter.post("/order/buy", buy);
proboRouter.post("/order/sell", sell);

proboRouter.post("/reset", resetMemory);
