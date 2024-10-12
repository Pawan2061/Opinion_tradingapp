import express from "express";

import {
  orderYes,
  getBalanceStock,
  getUserBalance,
  rampUser,
  orderNo,
  viewOrderbook,
  mintStock,
  createUser,
  createSymbol,
  sellYes,
} from "../controllers/proboController";
export const proboRouter = express.Router();
proboRouter.post("/user/create/:userId", createUser);
proboRouter.post("/balance/inr/:stockSymbol", createSymbol);

proboRouter.get("/balance/inr/:id", getUserBalance);
proboRouter.post("/onramp/inr", rampUser);
proboRouter.get("/balance/stock/:userId", getBalanceStock);

proboRouter.post("/order/buy/yes", orderYes);
proboRouter.post("/order/sell/yes", sellYes);

proboRouter.post("/order/no", orderNo);
proboRouter.get("/orderbook/:stockSymbol", viewOrderbook);

proboRouter.post("/trade/mint/:stockSymbol", mintStock);
