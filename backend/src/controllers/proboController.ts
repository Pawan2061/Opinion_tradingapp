import { Request, Response } from "express";
import { ORDERBOOK, STOCK_BALANCES, user_with_balances } from "../data/dummy";
const requestQueue = "request";

import { redisClient, ws } from "../app";

export const createUser = async (req: Request, res: any) => {
  try {
    const input = {
      method: "createUser",
      payload: req.params.userId,
    };

    await redisClient.lPush(requestQueue, JSON.stringify(input));

    console.log("upside");

    const data = await redisClient.brPop("receive-user", 0);
    console.log("downside");

    console.log(data, "here");
    console.log(data);

    if (!data) {
      return res.status(409).json({
        message: "couldnt process further",
      });
    }

    return res.status(200).send(JSON.parse(data.element));

    // return res.status(200).json({
    //   data: response,
    // });
    // user_with_balances[userId] = {
    //   balance: 0,
    //   locked: 0,
    // };

    // return res.status(201).json({
    //   user_with_balances,
    // });
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
      ORDERBOOK,
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
    const { stockSymbol, price, quantity, userId, stockType } = req.body;

    if (!stockSymbol || !price || !quantity || !userId || !stockType) {
      return res.status(404).json({
        message: "insufficient creds",
      });
    }

    if (user_with_balances[userId]!.balance < price * quantity) {
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
        ORDERBOOK[stockSymbol].no[newPrice].orders[userId].quantity += quantity;
        ORDERBOOK[stockSymbol].no[newPrice].orders[userId].type = "inverse";
        ORDERBOOK[stockSymbol].yes[newPrice].quantity += quantity;
        user_with_balances[userId].locked += price * quantity;

        user_with_balances[userId].balance -= price * quantity;
        return res.status(200).json({
          orderedStock: ORDERBOOK,
        });
      } else {
        ORDERBOOK[stockSymbol].no[newPrice].orders[userId] = {
          quantity: quantity,
          type: "inverse",
        };
        ORDERBOOK[stockSymbol].no[newPrice].quantity += quantity;
        user_with_balances[userId].locked += price * quantity;

        // STOCK_BALANCES[userId][stockSymbol]["no"].locked += quantity;

        user_with_balances[userId].balance -= price * quantity;
        ws.send(JSON.stringify(ORDERBOOK));
        return res.status(200).json({
          orderedStock: ORDERBOOK,
        });
      }

      ORDERBOOK[stockSymbol].no[newPrice].quantity += quantity;
      user_with_balances[userId].balance -= newPrice * quantity;
      user_with_balances[userId].locked += newPrice * quantity;

      return res.status(200).json({
        orderedStock: ORDERBOOK,
      });
    }

    if (ORDERBOOK[stockSymbol].yes[price].orders) {
      let totalAmount = quantity;

      for (let user in ORDERBOOK[stockSymbol].yes[price].orders) {
        if (totalAmount <= 0) break;
        console.log(ORDERBOOK[stockSymbol].yes[price].orders[user].type);

        let currentValue =
          ORDERBOOK[stockSymbol].yes[price].orders[user].quantity;
        let subtraction = Math.min(totalAmount, currentValue);
        user_with_balances[user].balance += price * subtraction;

        ORDERBOOK[stockSymbol].yes[price].orders[user].quantity -= subtraction;
        totalAmount -= subtraction;
        if (!STOCK_BALANCES[userId]) {
          STOCK_BALANCES[userId] = {};
        }

        if (!STOCK_BALANCES[userId][stockSymbol]) {
          STOCK_BALANCES[userId][stockSymbol] = {
            yes: { locked: 0, quantity: 0 },
          };
        }
        STOCK_BALANCES[userId][stockSymbol]["yes"].quantity += subtraction;
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
        message: "insufficient credentials",
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
        ORDERBOOK[stockSymbol].yes[newPrice].orders[userId].quantity +=
          quantity;
        ORDERBOOK[stockSymbol].yes[newPrice].quantity += quantity;

        ORDERBOOK[stockSymbol].yes[newPrice].orders[userId].type = "inverse";
        // STOCK_BALANCES[userId][stockSymbol]["yes"].locked += quantity;
        user_with_balances[userId].locked += price * quantity;

        user_with_balances[userId].balance -= price * quantity;
        return res.status(200).json({
          orderedStock: ORDERBOOK,
        });
      } else {
        ORDERBOOK[stockSymbol].yes[newPrice].orders[userId] = {
          quantity: quantity,
          type: "inverse",
        };
        ORDERBOOK[stockSymbol].yes[newPrice].quantity += quantity;

        user_with_balances[userId].balance -= price * quantity;
        user_with_balances[userId].locked += price * quantity;
        return res.status(200).json({
          orderedStock: ORDERBOOK,
        });

        // STOCK_BALANCES[userId][stockSymbol]!["yes"].locked += quantity;
      }

      ORDERBOOK[stockSymbol].yes[newPrice].quantity += quantity;
      user_with_balances[userId].balance -= newPrice * quantity;
      user_with_balances[userId].locked += newPrice * quantity;

      return res.status(200).json({
        orderedStock: ORDERBOOK,
      });
    }

    if (ORDERBOOK[stockSymbol].no[price].orders) {
      let totalAmount = quantity;

      for (let user in ORDERBOOK[stockSymbol].no[price].orders) {
        if (totalAmount <= 0) break;

        let currentValue =
          ORDERBOOK[stockSymbol].no[price].orders[user].quantity;
        let subtraction = Math.min(totalAmount, currentValue);

        user_with_balances[user].balance += price * subtraction;

        ORDERBOOK[stockSymbol].no[price].orders[user].quantity -= subtraction;
        totalAmount -= subtraction;
        if (!STOCK_BALANCES[userId]) {
          STOCK_BALANCES[userId] = {};
        }

        if (!STOCK_BALANCES[userId][stockSymbol]) {
          STOCK_BALANCES[userId][stockSymbol] = {
            no: { locked: 0, quantity: 0 },
          };
        }
        STOCK_BALANCES[userId][stockSymbol]["no"].quantity += subtraction;
      }

      ORDERBOOK[stockSymbol].no[price]!.quantity -= quantity - totalAmount;

      if (ORDERBOOK[stockSymbol].no[price].quantity == 0) {
        delete ORDERBOOK[stockSymbol].no[price];
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
    const { userId, quantity, price, stockSymbol } = req.body;
    const symbol = req.params.stockSymbol;

    // const newMint: MINTED_STOCKS = {
    //   quantity: quantity,
    //   userId: userId,
    //   stockSymbol: req.params.id,
    //   price: price,
    // };

    if (user_with_balances[userId].balance <= quantity * price) {
      return res.status(400).json({
        message: "Cant buy due to insufficient balance",
      });
    }
    // STOCK_BALANCES[userId][symbol]["yes"] = {
    //   quantity: quantity,
    //   locked: 0,
    // };
    // STOCK_BALANCES[userId][symbol]["no"] = {
    //   quantity: quantity,
    //   locked: 0,
    // };xs

    if (!ORDERBOOK[symbol].yes[5] || !ORDERBOOK[symbol].no[5]) {
      ORDERBOOK[symbol].yes[5] = { quantity: 0, orders: {} };
      ORDERBOOK[symbol].no[5] = { quantity: 0, orders: {} };
    }
    ORDERBOOK[symbol].yes[5].quantity += quantity;
    ORDERBOOK[symbol].no[5].quantity += quantity;

    ORDERBOOK[symbol].yes[5].orders = {
      [userId]: {
        quantity: quantity,
        type: "normal ",
      },
    };
    ORDERBOOK[symbol].no[5].orders = {
      [userId]: {
        quantity: quantity,
        type: "normal ",
      },
    };

    console.log("ndudhiei");

    user_with_balances[userId].balance -= quantity * price;

    return res.status(200).json({
      ORDERBOOK,
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      error: error,
    });
  }
};

// export const sellYes = (req: Request, res: any) => {
//   try {
//     const { stockSymbol, price, userId, quantity } = req.body;

//     if (!stockSymbol || !price || !userId || !quantity) {
//       return res.json({
//         message: "insufficient credentials",
//       });
//     }

//     // if (user_with_balances[userId].balance <= price * quantity) {
//     //   return res.status(400).json({
//     //     message: "insufficient balance for this user",
//     //   });
//     // }

//     if (!STOCK_BALANCES[userId]) {
//       return res.json({
//         message: "such stock doesnt exist on user stocks",
//       });
//     }

//     // if (!STOCK_BALANCES[userId]) {
//     //   return res.json({
//     //     message: "No stock available for the following user",
//     //   });
//     // }

//     if (STOCK_BALANCES[userId]["yes"].quantity < quantity) {
//       return res.status(400).json({
//         message: "you dont have enough stocks",
//       });
//     }
//     STOCK_BALANCES[userId][stockSymbol]["yes"].locked += quantity;

//     STOCK_BALANCES[userId][stockSymbol]["yes"].quantity -= quantity;

//     ORDERBOOK[stockSymbol].yes[price].quantity += quantity;
//     ORDERBOOK[stockSymbol].yes[price].orders[userId] += quantity;

//     return res.status(200).json({
//       stockbalance: STOCK_BALANCES,
//     });
//   } catch (error) {
//     return res.json({
//       message: error,
//     });
//   }
// };
export const sellYes = (req: Request, res: any) => {
  try {
    const { stockSymbol, price, userId, quantity } = req.body;

    if (!stockSymbol || !price || !userId || !quantity) {
      return res.status(400).json({
        message: "Insufficient credentials",
      });
    }

    if (
      !STOCK_BALANCES[userId] ||
      !STOCK_BALANCES[userId][stockSymbol] ||
      !STOCK_BALANCES[userId][stockSymbol]["yes"]
    ) {
      return res.status(400).json({
        message: "No such stock available for this user",
      });
    }

    if (STOCK_BALANCES[userId][stockSymbol]["yes"].quantity < quantity) {
      return res.status(400).json({
        message: "You don't have enough stocks",
      });
    }

    STOCK_BALANCES[userId][stockSymbol]["yes"].locked += quantity;
    STOCK_BALANCES[userId][stockSymbol]["yes"].quantity -= quantity;

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }
    if (!ORDERBOOK[stockSymbol].yes[price]) {
      ORDERBOOK[stockSymbol].yes[price] = { quantity: 0, orders: {} };
    }
    if (!ORDERBOOK[stockSymbol].yes[price].orders[userId]) {
      ORDERBOOK[stockSymbol].yes[price].orders[userId] = {
        quantity: 0,
        type: "normal ",
      };
    }

    ORDERBOOK[stockSymbol].yes[price].quantity += quantity;
    ORDERBOOK[stockSymbol].yes[price].orders[userId].quantity += quantity;

    return res.status(200).json({
      stockbalance: STOCK_BALANCES,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while processing the request",
      error: error,
    });
  }
};
export const sellNo = (req: Request, res: any) => {
  try {
    const { stockSymbol, price, userId, quantity } = req.body;

    if (!stockSymbol || !price || !userId || !quantity) {
      return res.status(400).json({
        message: "Insufficient credentials",
      });
    }

    if (
      !STOCK_BALANCES[userId] ||
      !STOCK_BALANCES[userId][stockSymbol] ||
      !STOCK_BALANCES[userId][stockSymbol]["no"]
    ) {
      return res.status(400).json({
        message: "No such 'no' stock available for this user",
      });
    }

    if (STOCK_BALANCES[userId][stockSymbol]["no"].quantity < quantity) {
      return res.status(400).json({
        message: "You don't have enough 'no' stocks",
      });
    }

    STOCK_BALANCES[userId][stockSymbol]["no"].locked += quantity;
    STOCK_BALANCES[userId][stockSymbol]["no"].quantity -= quantity;

    if (!ORDERBOOK[stockSymbol]) {
      ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    }
    if (!ORDERBOOK[stockSymbol].no[price]) {
      ORDERBOOK[stockSymbol].no[price] = { quantity: 0, orders: {} };
    }
    if (!ORDERBOOK[stockSymbol].no[price].orders[userId]) {
      ORDERBOOK[stockSymbol].no[price].orders[userId] = {
        quantity: 0,
        type: "normal ",
      };
    }

    ORDERBOOK[stockSymbol].no[price].quantity += quantity;
    ORDERBOOK[stockSymbol].no[price].orders[userId].quantity += quantity;
    ORDERBOOK[stockSymbol].no[price].orders[userId].type = "normal ";

    return res.status(200).json({
      stockbalance: STOCK_BALANCES,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while processing the request",
      error: error,
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
