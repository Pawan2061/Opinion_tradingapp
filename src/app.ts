import express from "express";
import { proboRouter } from "./routes/proboRoute";

const app = express();
app.use(express.json());
app.use("/api/v1", proboRouter);
app.listen(3000, () => {
  console.log(`wokring on port 3000`);
});
