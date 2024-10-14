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
    console.log(user_with_balances);

    return res.status(201).json({
      message: `User ${userId} created `,
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

    const { userId } = req.body;
    const val = "yes";

    if (!stockSymbol || !userId) {
      return res.status(404).json({
        message: "Insufficient data",
      });
    }
    ORDERBOOK[stockSymbol] = {
      yes: {},
      no: {},
    };
    console.log(ORDERBOOK);

    return res.status(201).json({
      message: `Symbol ${stockSymbol} created`,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      error: error,
    });
  }
};

export const getBalances = async (req: Response, res: any) => {
  try {
    const userBalances = user_with_balances;

    if (!userBalances) {
      return res.status(404).json({
        message: "no balances found",
      });
    }
    return res.status(200).json({
      INR_BALANCES: userBalances,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

export const getStocks = async (req: Request, res: any) => {
  try {
    const stock_balance = STOCK_BALANCES;
    if (!stock_balance) {
      return res.status(404).json({
        message: "no stock balances found",
      });
    }
    return res.status(200).json({
      stocks: stock_balance,
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
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      res.status(404).json({
        message: "insufficient credentials",
      });
    }
    if (!user_with_balances[userId]) {
      const newUser = (user_with_balances[userId] = {
        balance: amount,
        locked: 0,
      });
    }
    user_with_balances[userId].balance += amount;

    res.status(200).json({
      message: `Onramped ${userId} with amount ${amount}`,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      error: error,
    });
  }
};

export const getBalanceStock = async (req: Request, res: any) => {
  try {
    const userId = req.params.userId;

    const stockbalance = STOCK_BALANCES[userId];
    console.log(stockbalance);
    return res.status(200).json({
      stock: stockbalance,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error,
    });
  }
};

export const buyYes = (req: Request, res: any) => {
  try {
    console.log(req.body);

    const { stockSymbol, price, quantity, userId, stockType } = req.body;
    if (!stockSymbol || !price || !quantity || !userId || !stockType) {
      return res.status(404).json({
        message: "insufficient creds",
      });
    }

    if (user_with_balances[userId].balance < price * quantity) {
      return res.status(403).json({
        message: "user doesnt have sufficient balance",
      });
    }
    // const stock = ORDERBOOK[stockSymbol];

    if (!ORDERBOOK[stockSymbol]) {
      // const newBook = (ORDERBOOK[stockSymbol].no = {
      //   price: {
      //     quantity: quantity,
      //     orders: {
      //       userId: quantity,
      //     },
      //   },
      // });

      return res.status(400).json({
        message: "no stock found",
      });
    }

    if (!ORDERBOOK[stockSymbol]?.yes) {
      ORDERBOOK[stockSymbol].yes = {};

      ORDERBOOK[stockSymbol].no[10 - price] = {
        quantity: quantity,
        orders: {
          [userId]: quantity,
        },
      };
      console.log(ORDERBOOK);
    }

    if (!ORDERBOOK[stockSymbol].yes[price]) {
      const newPrice = 10 - price;
      if (!ORDERBOOK[stockSymbol].no[newPrice]) {
        ORDERBOOK[stockSymbol].no[newPrice] = {
          quantity: 0,
          orders: {},
        };
      }

      if (ORDERBOOK[stockSymbol].no[newPrice].orders[userId]) {
        ORDERBOOK[stockSymbol].no[newPrice].orders[userId] += quantity;
      } else {
        ORDERBOOK[stockSymbol].no[newPrice].orders[userId] = quantity;
      }
      ORDERBOOK[stockSymbol].no[newPrice].quantity += quantity;
      user_with_balances[userId].balance -= price * quantity;
      user_with_balances[userId].locked += price * quantity;

      // ORDERBOOK[stockSymbol].no[newPrice] = {
      //   quantity: 0,
      //   orders: {
      //     [userId]: quantity,
      //   },
      // };
      // ORDERBOOK[stockSymbol].no[10 - price].quantity += quantity;
      return res.status(200).json({
        message: "Order placed in no side",
        orderedStock: ORDERBOOK[stockSymbol].no[10 - price],
      });

      console.log(ORDERBOOK);
    }

    // const user_with_stock = STOCK_BALANCES[userId];

    // if (!user_with_stock) {
    // }

    // const user_newstock = STOCK_BALANCES[userId];
    // if (!user_newstock) {
    //   return res.json({
    //     message: "such user doesnt exist",
    //   });
    // }

    // if (!user_newstock[stockSymbol]) {
    //   return res.json({
    //     message: "no such stock available",
    //   });
    // }

    // if (
    //   !user_newstock[stockSymbol]["yes"] ||
    //   user_newstock[stockSymbol]["yes"].quantity < quantity
    // ) {
    //   return res.json({
    //     message: "couldnt place the order due to less balance",
    //   });
    // }
    // if (!STOCK_BALANCES[userId]) {
    //   STOCK_BALANCES[userId] = {};
    // }

    // if (!STOCK_BALANCES[userId][stockSymbol]) {
    //   STOCK_BALANCES[userId][stockSymbol] = {
    //     yes: { quantity: 0, locked: 0 },
    //     no: { quantity: 0, locked: 0 },
    //   };
    // }

    // STOCK_BALANCES[userId][stockSymbol]["yes"] = {
    //   locked: 0,
    //   quantity: quantity + quantity,
    // };

    if (ORDERBOOK[stockSymbol].yes[price].orders[userId]) {
      ORDERBOOK[stockSymbol].yes[price].quantity! += quantity;

      ORDERBOOK[stockSymbol].yes[price].orders[userId] += quantity;
      user_with_balances[userId].locked += price * quantity;
      user_with_balances[userId].balance -= price * quantity;
    } else {
      ORDERBOOK[stockSymbol].yes[price].orders[userId] = quantity;
      user_with_balances[userId].balance -= price * quantity;
      user_with_balances[userId].locked += quantity * price;
    }

    return res.status(200).json({
      orderedStock: ORDERBOOK[stockSymbol].yes[price],
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      error: error,
    });
  }
};

export const buyNo = (req: Request, res: any) => {
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

export const sellNo = async (req: Request, res: any) => {
  try {
  } catch (error) {}
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
      book,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

export const mintStock = async (req: Request, res: any) => {
  try {
    const { userId, quantity, price } = req.body;

    const newMint: MINTED_STOCKS = {
      quantity: quantity,
      userId: userId,
      stockSymbol: req.params.id,
      price: price,
    };

    if (user_with_balances[userId].balance <= quantity * price) {
      return res.status(400).json({
        message: "Cant buy due to insufficient balance",
      });
    }
    user_with_balances[userId].balance -= quantity * price;

    return res.status(200).json({
      message: `Minted ${newMint.quantity} 'yes' and 'no' tokens for user ${newMint.userId}, remaining balance${user_with_balances[userId].balance}`,
    });
  } catch (error) {}
};

export const sellYes = (req: Request, res: any) => {
  try {
    const { stockSymbol, price, userId, quantity } = req.body;

    if (!stockSymbol || !price || !userId || !quantity) {
      return res.json({
        message: "insufficient credentials",
      });
    }

    // if (user_with_balances[userId].balance <= price * quantity) {
    //   return res.status(400).json({
    //     message: "insufficient balance for this user",
    //   });
    // }

    const user_stock = STOCK_BALANCES[userId];

    if (!user_stock) {
      return res.json({
        message: "such stock doesnt exist on user stocks",
      });
    }

    if (!user_stock[stockSymbol]) {
      return res.json({
        message: "NPo stock available for the following user",
      });
    }

    if (user_stock[stockSymbol]["yes"].quantity < quantity) {
      return res.status(400).json({
        message: "you dont have enough stocks",
      });
    }
    STOCK_BALANCES[userId][stockSymbol]["yes"].locked += quantity;

    STOCK_BALANCES[userId][stockSymbol]["yes"].quantity -= quantity;

    ORDERBOOK[stockSymbol].yes[price].quantity += quantity;
    ORDERBOOK[stockSymbol].yes[price].orders[userId] += quantity;

    return res.status(200).json({
      message: `user ${userId} sold ${quantity} yes for ${price * quantity}`,
    });
  } catch (error) {
    return res.json({
      message: error,
    });
  }
};

export const getOrderbook = async (req: Request, res: any) => {
  try {
    const orderbooks = ORDERBOOK;
    if (!orderbooks) {
      return res.status(404).json({
        message: "No orderbook found",
      });
    }
    return res.status(200).json({
      orderbooks: orderbooks,
    });
  } catch (error) {
    return res.json({
      message: error,
    });
  }
};
