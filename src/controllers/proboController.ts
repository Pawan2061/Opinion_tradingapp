import { Request, Response } from "express";
import { rampedUsers, STOCK_BALANCES, user_with_balances } from "../data/dummy";
import { onrampedUser } from "../interfaces";
export const getUserBalance = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log(id);

    const user = user_with_balances[id];

    if (user) {
      res.status(200).json({
        id,
        balance: user.balance,
        locked: user.locked,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
export const rampUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    if (!req.body.userId || !req.body.amount) {
      res.status(404).json({
        message: "insufficient credentials",
      });
    }
    const user: onrampedUser = {
      userId: req.body.userId,
      amount: req.body.amount,
    };

    rampedUsers.push(user);
    console.log(user);

    res.status(200).json({
      users: rampedUsers,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      error: error,
    });
  }
};

export const getBalanceStock = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const stockbalance = STOCK_BALANCES[userId];
    console.log(stockbalance);
    res.status(200).json({
      stock: stockbalance,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error,
    });
  }
};
