import { sellNo, sellYes } from "./proboController";
import { Request } from "express";
type stockSymbol = string;
export const sell = async (req: Request, res: any) => {
  const { stockSymbol } = req.body;
  if (stockSymbol === "yes") {
    return sellYes(req, res);
  } else if (stockSymbol === "no") {
    return sellNo(req, res);
  } else {
    return res
      .status(400)
      .json({ error: 'Invalid option. Please provide "yes" or "no".' });
  }
};
