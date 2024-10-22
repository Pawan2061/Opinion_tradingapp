import { buyNo, buyYes, sellNo, sellYes } from "./proboController";
import { Request } from "express";
type stockSymbol = string;
export const sell = async (req: Request, res: any) => {
  const { stockType } = req.body;
  console.log(stockType, "avash neupande here");

  if (stockType === "yes") {
    return sellYes(req, res);
  } else if (stockType === "no") {
    return sellNo(req, res);
  } else {
    return res
      .status(400)
      .json({ error: 'Invalid option. Please provide "yes" or "no".' });
  }
};

export const buy = async (req: Request, res: any) => {
  const { stockType } = req.body;
  if (stockType === "yes") {
    return buyYes(req, res);
  } else if (stockType === "no") {
    return buyNo(req, res);
  } else {
    return res
      .status(400)
      .json({ error: 'Invalid option. Please provide "yes" or "no".' });
  }
};
