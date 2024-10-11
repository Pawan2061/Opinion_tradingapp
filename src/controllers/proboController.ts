import { Request, Response } from "express";
import { ORDERBOOK, STOCK_BALANCES, user_with_balances } from "../data/dummy";

import {
  ApiResponse,
  ErrorResponse,
  MINTED_STOCKS,
  onrampedUser,
  Stock,
} from "../interfaces";

export const createUser = async (req: Request, res: any) => {
  try {
    const userId = req.params.userId;
    console.log(userId);

    user_with_balances[userId] = {
      balance: 0,
      locked: 0,
    };

    return res.status(200).json({
      user: user_with_balances,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

export const createSymbol = (req: Request, res: any) => {
  try {
    const stockSymbol = req.params.stockSymbol;

    const { userId, locked, quantity } = req.body;

    const stockType = "no";
    if (!STOCK_BALANCES[userId]) {
      STOCK_BALANCES[userId] = {};
    }

    if (!STOCK_BALANCES[userId][stockSymbol]) {
      STOCK_BALANCES[userId][stockSymbol] = {};
    }
    STOCK_BALANCES[userId][stockSymbol] = {
      yes: {
        quantity: 0,
        locked: 0,
      },
      no: {
        quantity: 10,
        locked: 1,
      },
    };

    return res.status(200).json({
      stock_balance: STOCK_BALANCES,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

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

    const newUser: onrampedUser = {
      userId: req.body.id,
      amount: req.body.amount,
    };
    user_with_balances[req.body.userId].balance += newUser.amount;

    res.status(200).json({
      user: newUser,
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

    const { stockSymbol, price, quantity, userId } = req.body;

    if (user_with_balances[userId].balance < price * quantity) {
      return res.status(403).json({
        message: "user doesnt have sufficient balance",
      });
    }
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
        quantity: 0,
        orders: {},
      };
    }

    stock.yes[price].quantity += quantity;
    if (stock.yes[price].orders[userId]) {
      stock.yes[price].orders[userId] += quantity;
      user_with_balances[userId].balance -= price * quantity;
    } else {
      stock.yes[price].orders[userId] = quantity;
      user_with_balances[userId].balance -= price * quantity;
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
    const { stockSymbol, price, quantity, userId } = req.body;
    if (user_with_balances[userId].balance < price * quantity) {
      return res.status(403).json({
        message: "user doesnt have sufficient balance",
      });
    }

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
        quantity: quantity,
        orders: {},
      };
    }

    stock.no[price].quantity += quantity;
    if (stock.no[price].orders[userId]) {
      stock.no[price].orders[userId] += quantity;
      user_with_balances[userId].balance -= price * quantity;
    } else {
      stock.no[price].orders[userId] = quantity;
      user_with_balances[userId].balance -= price * quantity;
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
