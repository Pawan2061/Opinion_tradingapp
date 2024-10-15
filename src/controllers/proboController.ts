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

// export const buyYes = (req: Request, res: any) => {
//   try {
//     console.log(req.body);

//     const { stockSymbol, price, quantity, userId, stockType } = req.body;
//     if (!stockSymbol || !price || !quantity || !userId || !stockType) {
//       return res.status(404).json({
//         message: "insufficient creds",
//       });
//     }

//     if (user_with_balances[userId].balance < price * quantity) {
//       return res.status(403).json({
//         message: "user doesnt have sufficient balance",
//       });
//     }

//     if (!ORDERBOOK[stockSymbol]) {
//       return res.status(400).json({
//         message: "no stock found",
//       });
//     }

//     if (!ORDERBOOK[stockSymbol]?.yes) {
//       ORDERBOOK[stockSymbol].yes = {};

//       ORDERBOOK[stockSymbol].no[10 - price] = {
//         quantity: quantity,
//         orders: {
//           [userId]: quantity,
//         },
//       };
//       console.log(ORDERBOOK);
//     }

//     if (!ORDERBOOK[stockSymbol].yes[price]) {
//       const newPrice = 10 - price;
//       if (!ORDERBOOK[stockSymbol].no[newPrice]) {
//         ORDERBOOK[stockSymbol].no[newPrice] = {
//           quantity: 0,
//           orders: {},
//         };
//       }

//       if (ORDERBOOK[stockSymbol].no[newPrice].orders[userId]) {
//         ORDERBOOK[stockSymbol].no[newPrice].orders[userId] += quantity;
//       } else {
//         ORDERBOOK[stockSymbol].no[newPrice].orders[userId] = quantity;
//       }
//       ORDERBOOK[stockSymbol].no[newPrice].quantity += quantity;
//       user_with_balances[userId].balance -= price * quantity;
//       user_with_balances[userId].locked += price * quantity;

//       return res.status(200).json({
//         message: "Order placed in no side",
//         orderedStock: ORDERBOOK,
//       });
//     }

//     if (ORDERBOOK[stockSymbol].yes[price].orders) {
//       let totalAmount = quantity;

//       for (let user in ORDERBOOK[stockSymbol].yes[price].orders) {
//         if (totalAmount <= 0) break;
//         let currentValue = ORDERBOOK[stockSymbol].yes[price].orders[user];
//         let subtraction = Math.min(totalAmount, currentValue);
//         ORDERBOOK[stockSymbol].no[price].orders[user] =
//           currentValue - subtraction;
//         totalAmount -= subtraction;
//       }
//       ORDERBOOK[stockSymbol].yes[price].quantity -= quantity - totalAmount;
//       if (ORDERBOOK[stockSymbol].yes[price].quantity == 0) {
//         delete ORDERBOOK[stockSymbol].yes[price];
//       }
//       // ORDERBOOK[stockSymbol].yes[price].quantity! += quantity;

//       // ORDERBOOK[stockSymbol].yes[price].orders[userId] += quantity;
//       // user_with_balances[userId].locked += price * quantity;
//       user_with_balances[userId].balance -= price * quantity;
//     } else {
//       // ORDERBOOK[stockSymbol].yes[price].orders[userId] = quantity;
//       user_with_balances[userId].balance -= price * quantity;
//       user_with_balances[userId].locked += quantity * price;
//     }

//     return res.status(200).json({
//       orderedStock: ORDERBOOK[stockSymbol].yes[price],
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(400).json({
//       error: error,
//     });
//   }
// };

export const buyYes = (req: Request, res: any) => {
  try {
    const { stockSymbol, price, quantity, userId, stockType } = req.body;

    if (!stockSymbol || !price || !quantity || !userId || !stockType) {
      return res.status(404).json({
        message: "insufficient creds",
      });
    }

    if (user_with_balances[userId].balance < price * quantity) {
      return res.status(403).json({
        message: "user doesn't have sufficient balance",
      });
    }

    if (!ORDERBOOK[stockSymbol]) {
      return res.status(400).json({
        message: "no stock found",
      });
    }

    if (!ORDERBOOK[stockSymbol]?.yes) {
      ORDERBOOK[stockSymbol].yes = {};
    }

    // Handle logic for a new price on the "yes" side
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

      return res.status(200).json({
        orderedStock: ORDERBOOK,
      });
    }

    // If the price exists on the "yes" side, process the order
    if (ORDERBOOK[stockSymbol].yes[price].orders) {
      let totalAmount = quantity;

      for (let user in ORDERBOOK[stockSymbol].yes[price].orders) {
        if (totalAmount <= 0) break;
        let currentValue = ORDERBOOK[stockSymbol].yes[price].orders[user];
        let subtraction = Math.min(totalAmount, currentValue);
        ORDERBOOK[stockSymbol].yes[price].orders[user] =
          currentValue - subtraction;
        totalAmount -= subtraction;
      }

      ORDERBOOK[stockSymbol].yes[price].quantity -= quantity - totalAmount;
      if (ORDERBOOK[stockSymbol].yes[price].quantity == 0) {
        delete ORDERBOOK[stockSymbol].yes[price];
      }

      user_with_balances[userId].balance -= price * quantity;
    } else {
      user_with_balances[userId].balance -= price * quantity;
      user_with_balances[userId].locked += price * quantity;
    }

    return res.status(200).json({
      orderedStock: ORDERBOOK,
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
    const { stockSymbol, price, quantity, userId, stockType } = req.body;

    if (!stockSymbol || !price || !quantity || !userId || !stockType) {
      return res.status(404).json({
        message: "insufficient creds",
      });
    }

    if (user_with_balances[userId].balance < price * quantity) {
      return res.status(403).json({
        message: "user doesn't have sufficient balance",
      });
    }

    if (!ORDERBOOK[stockSymbol]) {
      return res.status(400).json({
        message: "no stock found",
      });
    }

    if (!ORDERBOOK[stockSymbol]?.no) {
      ORDERBOOK[stockSymbol].no = {};
    }

    if (!ORDERBOOK[stockSymbol].no[price]) {
      const newPrice = 10 - price;

      if (!ORDERBOOK[stockSymbol].yes[newPrice]) {
        ORDERBOOK[stockSymbol].yes[newPrice] = {
          quantity: 0,
          orders: {},
        };
      }

      if (ORDERBOOK[stockSymbol].yes[newPrice].orders[userId]) {
        ORDERBOOK[stockSymbol].yes[newPrice].orders[userId] += quantity;
      } else {
        ORDERBOOK[stockSymbol].yes[newPrice].orders[userId] = quantity;
      }

      ORDERBOOK[stockSymbol].yes[newPrice].quantity += quantity;
      user_with_balances[userId].balance -= price * quantity;
      user_with_balances[userId].locked += price * quantity;

      return res.status(200).json({
        orderedStock: ORDERBOOK,
      });
    }

    if (ORDERBOOK[stockSymbol].no[price].orders) {
      let totalAmount = quantity;

      for (let user in ORDERBOOK[stockSymbol].no[price].orders) {
        if (totalAmount <= 0) break;
        let currentValue = ORDERBOOK[stockSymbol].no[price].orders[user];
        let subtraction = Math.min(totalAmount, currentValue);
        ORDERBOOK[stockSymbol].no[price].orders[user] =
          currentValue - subtraction;
        totalAmount -= subtraction;
      }
      ORDERBOOK[stockSymbol].no[price].quantity -= quantity - totalAmount;
      if (ORDERBOOK[stockSymbol].no[price].quantity == 0) {
        delete ORDERBOOK[stockSymbol].no[price];
      }

      // ORDERBOOK[stockSymbol].no[price].orders[userId] += quantity;
      user_with_balances[userId].balance -= price * quantity;
      // user_with_balances[userId].locked += price * quantity;
    } else {
      // ORDERBOOK[stockSymbol].no[price].orders[userId] = quantity;
      user_with_balances[userId].balance -= price * quantity;
      user_with_balances[userId].locked += price * quantity;
    }

    return res.status(200).json({
      orderedStock: ORDERBOOK,
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
      // message: `user ${userId} sold ${quantity} yes for ${price * quantity}`,
      ORDERBOOK,
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

export const resetMemory = async (req: Request, res: any) => {
  try {
    // Object.assign(STOCK_BALANCES, {});
    // Object.assign(ORDERBOOK, {});
    // Object.assign(user_with_balances, {});
    Object.keys(STOCK_BALANCES).forEach((key) => delete STOCK_BALANCES[key]);
    Object.keys(user_with_balances).forEach(
      (key) => delete user_with_balances[key]
    );
    Object.keys(ORDERBOOK).forEach((key) => delete ORDERBOOK[key]);

    return res.status(200).json({
      STOCK_BALANCES,
      user_with_balances,
      ORDERBOOK,
    });
  } catch (error) {
    return res.json({
      message: error,
    });
  }
};
