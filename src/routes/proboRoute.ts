import express from "express";

import {
  orderYes,
  getBalanceStock,
  getUserBalance,
  rampUser,
  orderNo,
  viewOrderbook,
} from "../controllers/proboController";
import expressAsyncHandler from "express-async-handler";
export const proboRouter = express.Router();

proboRouter.get("/balance/inr/:id", getUserBalance);
proboRouter.post("/onramp/inr", rampUser);
proboRouter.get("/balance/stock/:userId", getBalanceStock);

proboRouter.post("/order/yes", orderYes);

proboRouter.post("/order/no", orderNo);
proboRouter.get("/orderbook/:stockSymbol", viewOrderbook);
