import express from "express";
import { proboRouter } from "./routes/proboRoute";
import { ORDERBOOK, STOCK_BALANCES, user_with_balances } from "./data/dummy";

const app = express();
app.use(express.json());

app.use("/api/v1", proboRouter);
console.log(user_with_balances);
console.log(STOCK_BALANCES);
console.log(ORDERBOOK);

app.listen(3000, () => {
  console.log(`wokring on port 3000`);
});
