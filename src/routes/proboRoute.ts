import express from "express";

import { getBalanceStock, getUserBalance, rampUser } from "../controllers";
export const proboRouter = express.Router();

proboRouter.get("/balance/inr/:id", getUserBalance);
proboRouter.post("/onramp/inr", rampUser);
proboRouter.get("/balance/stock/:userId", getBalanceStock);
