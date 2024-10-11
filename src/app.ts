import express from "express";
import { proboRouter } from "./routes/proboRoute";

const app = express();
app.use("/api/v1", proboRouter);

app.use(express.json());
app.listen(3000, () => {
  console.log(`wokring on port 3000`);
});
