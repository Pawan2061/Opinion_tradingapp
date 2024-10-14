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
} from "../controllers/proboController";
import { buy, sell } from "../controllers/trade";
export const proboRouter = express.Router();
proboRouter.post("/user/create/:userId", createUser);
proboRouter.post("/symbol/create/:stockSymbol", createSymbol);
proboRouter.get("/orderbook", getOrderbook);
proboRouter.get("/balances/inr", getBalances);
proboRouter.get("/balances/stock", getStocks);

proboRouter.get("/balance/inr/:id", getUserBalance);
proboRouter.post("/onramp/inr", rampUser);
proboRouter.get("/balance/stock/:userId", getBalanceStock);
proboRouter.post("/order/buy", buy);
proboRouter.post("/order/sell", sell);

proboRouter.post("/order/buy/yes", buyYes);
proboRouter.post("/order/sell/yes", sellYes);

proboRouter.post("/order/buy/no", buyNo);
proboRouter.post("/order/sell/no", sellNo);
proboRouter.get("/orderbook/:stockSymbol", viewOrderbook);

proboRouter.post("/trade/mint/:stockSymbol", mintStock);
