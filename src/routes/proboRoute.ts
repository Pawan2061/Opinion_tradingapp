import express from "express";
import asyncHandler from "express-async-handler";
import {
  orderYes,
  getBalanceStock,
  getUserBalance,
  rampUser,
} from "../controllers/proboController";
export const proboRouter = express.Router();

proboRouter.get("/balance/inr/:id", getUserBalance);
proboRouter.post("/onramp/inr", rampUser);
proboRouter.get("/balance/stock/:userId", getBalanceStock);
// @ts-ignore
proboRouter.post("/order/yes", asyncHandler(orderYes));
