import { Request, Response } from "express";
import {
  ORDERBOOK,
  rampedUsers,
  STOCK_BALANCES,
  user_with_balances,
} from "../data/dummy";

import {
  ApiResponse,
  ErrorResponse,
  MINTED_STOCKS,
  onrampedUser,
  OrderBook,
  OrderResponse,
} from "../interfaces";
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

export const orderYes = (req: Request, res: any) => {
  try {
    console.log(req.body);

    const { stockSymbol, price, total, userId } = req.body;

    const stock = ORDERBOOK[stockSymbol];

    if (!stock) {
      return res.status(404).json({
        message: "No stock found for the given stock symbol",
      });
    }

    if (!stock?.yes) {
      stock.yes = {};
    }

    if (!stock.yes[price]) {
      stock.yes[price] = {
        total: total,
        orders: {},
      };
    }

    stock.yes[price].total += total;
    if (stock.yes[price].orders[userId]) {
      stock.yes[price].orders[userId] += total;
    } else {
      stock.yes[price].orders[userId] = total;
    }
    console.log(stock);

    return res.status(200).json({
      orderedStock: stock.yes[price],
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      error: error,
    });
  }
};

export const orderNo = (req: Request, res: any) => {
  try {
    const { stockSymbol, price, total, userId } = req.body;

    const stock = ORDERBOOK[stockSymbol];

    if (!stock) {
      return res.status(404).json({
        error: "No stock found for the given stock symbol",
      });
    }

    if (!stock?.no) {
      stock.no = {};
    }

    if (!stock.no[price]) {
      stock.no[price] = {
        total: total,
        orders: {},
      };
    }

    stock.no[price].total += total;
    if (stock.no[price].orders[userId]) {
      stock.no[price].orders[userId] += total;
    } else {
      stock.no[price].orders[userId] = total;
    }
    console.log(stock);

    return res.status(200).json({
      orderedStock: stock.no[price],
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      error: error,
    });
  }
};
export const viewOrderbook = async (req: Request, res: any) => {
  try {
    const stockSymbol = req.params.stockSymbol;

    if (!stockSymbol) {
      return res.status(404).json({
        error: "ubcn",
      });
    }

    const book = ORDERBOOK[stockSymbol];

    return res.status(200).json({
      book: book,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

export const mintStock = async (req: Request, res: any) => {
  try {
    const { userId, quantity } = req.body;

    const newMint: MINTED_STOCKS = {
      quantity: quantity,
      userId: userId,
      stockSymbol: req.params.id,
      timeStamp: new Date(),
    };
    return res.status(200).json({
      minted_token: newMint,
    });
  } catch (error) {}
};
