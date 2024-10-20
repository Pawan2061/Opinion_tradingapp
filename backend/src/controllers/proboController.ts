import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { ORDERBOOK, STOCK_BALANCES, user_with_balances } from "../data/dummy";
import { pubsubManager } from "../../../redis/src/pubsub";
const requestQueue = "request";

import { redisClient, subscriber } from "../app";
import { handlePubSub, handleResponses, sendResponse } from "../utils/help";

export interface apResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const createUser = async (req: Request, res: any) => {
  try {
    const id = uuid();
    const input = {
      id: id,
      method: "createUser",
      payload: req.params.userId,
    };

    await redisClient.lPush(requestQueue, JSON.stringify(input));

    try {
      console.log("im inside");

      const data = await handlePubSub(id);
      console.log(data);

      sendResponse(res, data);

      // await handleResponses(data);

      // return res.status(200).send(data);
    } catch (error) {
      return res.status(500).json({ error: "Failed to subscribe to channel" });
    }
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
};

export const createSymbol = async (req: Request, res: any) => {
  try {
    const stockSymbol = req.params.stockSymbol;

    const { userId } = req.body;

    if (!stockSymbol || !userId) {
      return res.status(404).json({
        message: "Insufficient data",
      });
    }
    const id = uuid();

    const input = {
      id: id,

      method: "createSymbol",
      payload: {
        stockSymbol: stockSymbol,
        userId: userId,
      },
    };

    await redisClient.lPush(requestQueue, JSON.stringify(input));

    try {
      const data = await handlePubSub(id);

      sendResponse(res, data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to subscribe to channel" });
    }
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      error: error,
    });
  }
};

export const getBalances = async (req: Response, res: any) => {
  try {
    const id = uuid();
    const input = {
      id: id,
      method: "getBalance",
      payload: {},
    };

    await redisClient.lPush(requestQueue, JSON.stringify(input));

    try {
      const data = await handlePubSub(id);
      sendResponse(res, data);
    } catch (error) {
      return res.status(500).json({ error: "Failed to subscribe to channel" });
    }
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

export const getStocks = async (req: Request, res: any) => {
  try {
    const id = uuid();
    const input = {
      id: id,
      method: "getStocks",
      payload: {},
    };

    await redisClient.lPush(requestQueue, JSON.stringify(input));

    try {
      const data = await handlePubSub(id);

      sendResponse(res, data);
    } catch (error) {
      return res.status(500).json({ error: "Failed to subscribe to channel" });
    }
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

export const getUserBalance = async (req: Request, res: any) => {
  try {
    const userId = req.params.id;
    const id = uuid();

    const input = {
      id: id,
      method: "getUserBalance",
      payload: userId,
    };

    await redisClient.lPush(requestQueue, JSON.stringify(input));

    try {
      const data = await handlePubSub(id);
      sendResponse(res, data);
    } catch (error) {
      return res.status(500).json({ error: "Failed to subscribe to channel" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
export const rampUser = async (req: Request, res: any) => {
  try {
    const { userId, amount } = req.body;
    const id = uuid();

    const input = {
      method: "onRamp",

      id: id,
      payload: {
        userId: userId,
        amount: amount,
      },
    };

    await redisClient.lPush(requestQueue, JSON.stringify(input));

    try {
      const data = await handlePubSub(id);

      sendResponse(res, data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to subscribe to channel" });
    }
  } catch (error) {
    console.log(error);

    res.status(400).json({
      error: error,
    });
  }
};

export const getBalanceStock = async (req: Request, res: any) => {
  try {
    const id = uuid();
    const userId = req.params.userId;
    const input = {
      id: id,
      method: "getBalanceStock",
      payload: userId,
    };

    await redisClient.lPush(requestQueue, JSON.stringify(input));

    try {
      const data = await handlePubSub(id);
      // return res.status(200).send(data);
      sendResponse(res, data);
    } catch (error) {
      return res.status(400).send(error);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error,
    });
  }
};

export const buyYes = async (req: Request, res: any) => {
  try {
    const { stockSymbol, price, quantity, userId, stockType } = req.body;
    const id = uuid();

    const input = {
      id: id,
      method: "buyYes",
      payload: {
        stockSymbol,
        price,
        quantity,
        userId,
        stockType,
      },
    };

    await redisClient.lPush(requestQueue, JSON.stringify(input));
    console.log("before parsing");

    try {
      const data = await handlePubSub(id);
      sendResponse(res, data);
    } catch (error) {
      return res.status(403).json({
        error: error,
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      error: error,
    });
  }
};

export const buyNo = async (req: Request, res: any) => {
  try {
    const { stockSymbol, price, quantity, userId, stockType } = req.body;
    const id = uuid();

    const input = {
      id: id,
      method: "buyNo",
      payload: {
        stockSymbol: stockSymbol,
        price: price,
        quantity: quantity,
        userId: userId,
        stockType: stockType,
      },
    };

    await redisClient.lPush(requestQueue, JSON.stringify(input));

    try {
      const data = await handlePubSub(id);

      sendResponse(res, data);
    } catch (error) {
      return res.status(403).json({
        error: error,
      });
    }
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
    const id = uuid();
    const input = {
      id: id,
      method: "viewOrderbook",
      payload: stockSymbol,
    };

    await redisClient.lPush(requestQueue, JSON.stringify(input));

    try {
      const data = await handlePubSub(id);
      sendResponse(res, data);
    } catch (error) {
      return res.status(400).send(error);
    }
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

    const id = uuid();
    const input = {
      id: id,
      method: "mintStock",
      payload: {
        userId: userId,
        quantity: quantity,
        price: price,
        symbol: symbol,
      },
    };

    await redisClient.lPush(requestQueue, JSON.stringify(input));
    try {
      const data = await handlePubSub(id);
      sendResponse(res, data);
    } catch (error) {
      return res.status(400).json({
        error: error,
      });
    }

    // if (user_with_balances[userId].balance <= quantity * price) {
    //   return res.status(400).json({
    //     message: "Cant buy due to insufficient balance",
    //   });
    // }
    // // STOCK_BALANCES[userId][symbol]["yes"] = {
    // //   quantity: quantity,
    // //   locked: 0,
    // // };
    // // STOCK_BALANCES[userId][symbol]["no"] = {
    // //   quantity: quantity,
    // //   locked: 0,
    // // };xs

    // if (!ORDERBOOK[symbol].yes[5] || !ORDERBOOK[symbol].no[5]) {
    //   ORDERBOOK[symbol].yes[5] = { quantity: 0, orders: {} };
    //   ORDERBOOK[symbol].no[5] = { quantity: 0, orders: {} };
    // }
    // ORDERBOOK[symbol].yes[5].quantity += quantity;
    // ORDERBOOK[symbol].no[5].quantity += quantity;

    // ORDERBOOK[symbol].yes[5].orders = {
    //   [userId]: {
    //     quantity: quantity,
    //     type: "normal ",
    //   },
    // };
    // ORDERBOOK[symbol].no[5].orders = {
    //   [userId]: {
    //     quantity: quantity,
    //     type: "normal ",
    //   },
    // };

    // console.log("ndudhiei");

    // user_with_balances[userId].balance -= quantity * price;

    // return res.status(200).json({
    //   ORDERBOOK,
    // });
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
export const sellYes = async (req: Request, res: any) => {
  try {
    const { stockSymbol, price, userId, quantity } = req.body;
    const id = uuid();

    const input = {
      id: id,
      method: "sellyes",
      payload: {
        stockSymbol: stockSymbol,
        price: price,
        userId: userId,
        quantity: quantity,
      },
    };

    await redisClient.lPush(requestQueue, JSON.stringify(input));

    try {
      const data = await handlePubSub(id);

      sendResponse(res, data);
    } catch (error) {
      return res.status(403).json({
        error: error,
      });
    }

    // if (!stockSymbol || !price || !userId || !quantity) {
    //   return res.status(400).json({
    //     message: "Insufficient credentials",
    //   });
    // }

    // if (
    //   !STOCK_BALANCES[userId] ||
    //   !STOCK_BALANCES[userId][stockSymbol] ||
    //   !STOCK_BALANCES[userId][stockSymbol]["yes"]
    // ) {
    //   return res.status(400).json({
    //     message: "No such stock available for this user",
    //   });
    // }

    // if (STOCK_BALANCES[userId][stockSymbol]["yes"].quantity < quantity) {
    //   return res.status(400).json({
    //     message: "You don't have enough stocks",
    //   });
    // }

    // STOCK_BALANCES[userId][stockSymbol]["yes"].locked += quantity;
    // STOCK_BALANCES[userId][stockSymbol]["yes"].quantity -= quantity;

    // if (!ORDERBOOK[stockSymbol]) {
    //   ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    // }
    // if (!ORDERBOOK[stockSymbol].yes[price]) {
    //   ORDERBOOK[stockSymbol].yes[price] = { quantity: 0, orders: {} };
    // }
    // if (!ORDERBOOK[stockSymbol].yes[price].orders[userId]) {
    //   ORDERBOOK[stockSymbol].yes[price].orders[userId] = {
    //     quantity: 0,
    //     type: "normal ",
    //   };
    // }

    // ORDERBOOK[stockSymbol].yes[price].quantity += quantity;
    // ORDERBOOK[stockSymbol].yes[price].orders[userId].quantity += quantity;

    // return res.status(200).json({
    //   stockbalance: STOCK_BALANCES,
    // });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while processing the request",
      error: error,
    });
  }
};
export const sellNo = async (req: Request, res: any) => {
  try {
    const { stockSymbol, price, userId, quantity } = req.body;
    const id = uuid();

    const input = {
      id: id,
      method: "sellNo",
      payload: {
        stockSymbol: stockSymbol,
        price: price,
        userId: userId,
        quantity: quantity,
      },
    };
    await redisClient.lPush(requestQueue, JSON.stringify(input));

    try {
      const data = await handlePubSub(id);
      sendResponse(res, data);
    } catch (error) {
      console.log(error);

      return {
        error: error,
      };
    }

    // if (!stockSymbol || !price || !userId || !quantity) {
    //   return res.status(400).json({
    //     message: "Insufficient credentials",
    //   });
    // }

    // if (
    //   !STOCK_BALANCES[userId] ||
    //   !STOCK_BALANCES[userId][stockSymbol] ||
    //   !STOCK_BALANCES[userId][stockSymbol]["no"]
    // ) {
    //   return res.status(400).json({
    //     message: "No such 'no' stock available for this user",
    //   });
    // }

    // if (STOCK_BALANCES[userId][stockSymbol]["no"].quantity < quantity) {
    //   return res.status(400).json({
    //     message: "You don't have enough 'no' stocks",
    //   });
    // }

    // STOCK_BALANCES[userId][stockSymbol]["no"].locked += quantity;
    // STOCK_BALANCES[userId][stockSymbol]["no"].quantity -= quantity;

    // if (!ORDERBOOK[stockSymbol]) {
    //   ORDERBOOK[stockSymbol] = { yes: {}, no: {} };
    // }
    // if (!ORDERBOOK[stockSymbol].no[price]) {
    //   ORDERBOOK[stockSymbol].no[price] = { quantity: 0, orders: {} };
    // }
    // if (!ORDERBOOK[stockSymbol].no[price].orders[userId]) {
    //   ORDERBOOK[stockSymbol].no[price].orders[userId] = {
    //     quantity: 0,
    //     type: "normal ",
    //   };
    // }

    // ORDERBOOK[stockSymbol].no[price].quantity += quantity;
    // ORDERBOOK[stockSymbol].no[price].orders[userId].quantity += quantity;
    // ORDERBOOK[stockSymbol].no[price].orders[userId].type = "normal ";

    // return res.status(200).json({
    //   stockbalance: STOCK_BALANCES,
    // });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while processing the request",
      error: error,
    });
  }
};

export const getOrderbook = async (req: Request, res: any) => {
  try {
    const id = uuid();
    const input = {
      id: id,
      method: "getOrderbooks",
      payload: {},
    };

    await redisClient.lPush(requestQueue, JSON.stringify(input));

    try {
      const data = await handlePubSub(id);
      sendResponse(res, data);
    } catch (error) {
      return res.status(500).json({ error: "Failed to subscribe to channel" });
    }

    // const data = await redisClient.brPop(responseQueue, 0);
    // console.log(data?.element);

    // if (!data) {
    //   return res.status(409).json({
    //     message: "couldnot process further",
    //   });
    // }

    // return res.status(200).json({
    //   orderbook: JSON.parse(data.element),
    // });

    // const orderbooks = ORDERBOOK;
    // if (!orderbooks) {
    //   return res.status(404).json({
    //     message: "No orderbook found",
    //   });
    // }
    // return res.status(200).json({
    //   orderbooks: orderbooks,
    // });
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
