import { response, Response } from "express";
import { responseQueue } from ".";
import { WebSocket } from "ws";
import { redisClient, ws } from "..";
import { ORDERBOOK, STOCK_BALANCES, user_with_balances } from "../data";
import { displayBook } from "../utils/sendbook";

export const createSymbol = async (payload: any) => {
  try {
    if (ORDERBOOK.hasOwnProperty(payload.stockSymbol)) {
      console.log("already there");
      return JSON.stringify({
        message: "already availanble",
      });
    }
    ORDERBOOK[payload.stockSymbol] = {
      yes: {},
      no: {},
    };
    console.log("very close");

    // ws.send(JSON.stringify(ORDERBOOK));
    await displayBook(JSON.stringify(ORDERBOOK));

    return JSON.stringify(ORDERBOOK);
  } catch (error) {
    return { error: error };
  }
};

export const getOrderbooks = async (payload: string) => {
  try {
    const orderbooks = ORDERBOOK;
    if (!orderbooks) {
      //   return res.status(404).json({
      //     message: "No orderbook found",
      //   });2
      console.log("not found ");
    }

    await displayBook(JSON.stringify(orderbooks));

    return JSON.stringify(orderbooks);
    // await redisClient.lPush(responseQueue, JSON.stringify(orderbooks));
  } catch (error) {
    return { error: error };
  }
};

export const viewOrderbook = async (payload: string) => {
  try {
    console.log(payload, "here");

    if (!payload) {
      //   return res.status(404).json({
      //     error: "no stocks of such kinds",
      //   });
      console.log("no such stocksymbol found");
      throw Error;
    }

    const book = ORDERBOOK[payload];

    return JSON.stringify(book);
    // console.log(book, "sidd");

    // await redisClient.lPush(responseQueue, JSON.stringify(book));

    // return res.status(200).json({
    //   book,
    // });
  } catch (error) {
    return { error: error };
  }
};

export const getStocks = async (payload: string) => {
  try {
    const stock_balance = STOCK_BALANCES;
    if (!stock_balance) {
      throw new Error("STOCKS NOT AVAILABLE ");
    }
    return JSON.stringify(stock_balance);
    // await redisClient.lPush(responseQueue, JSON.stringify(stock_balance));
  } catch (error) {
    return { error: error };
  }
};

export const getBalanceStock = async (payload: string) => {
  try {
    const stockbalance = STOCK_BALANCES[payload];
    // return res.status(200).json({
    //   stock: stockbalance,
    // });
    console.log("im here");

    if (!stockbalance) {
      console.log("error errorr errror");

      throw new Error("stock couldnt be founds");
    }
    console.log(stockbalance);

    console.log("i hrer");

    return JSON.stringify(stockbalance);

    // await redisClient.lPush(responseQueue, JSON.stringify(stockbalance));
  } catch (error) {
    return { error: error };
  }
};

export const buyYes = async (payload: any) => {
  try {
    console.log(payload, "data is here");

    if (
      !payload.stockSymbol ||
      !payload.price ||
      !payload.quantity ||
      !payload.userId ||
      !payload.stockType
    ) {
      //   return res.status(404).json({
      //     message: "insufficient creds",
      //   });
      console.log("insufficientcreds");
    }

    if (
      user_with_balances[payload.userId]!.balance <
      payload.price * payload.quantity
    ) {
      //   return res.status(403).json({
      //     message: "user doesn't have sufficient balance",
      //   });
      console.log("user doesnt have sufficient balance");
    }

    if (!ORDERBOOK[payload.stockSymbol]) {
      //   return res.status(400).json({
      //     message: "no stock found",
      //   });
      // console.log("no stock found");
      ORDERBOOK[payload.stockSymbol] = {
        yes: {},
        no: {},
      };
    }

    if (!ORDERBOOK[payload.stockSymbol]?.yes) {
      ORDERBOOK[payload.stockSymbol].yes = {};
    }

    // Handle logic for a new price on the "yes" side
    if (!ORDERBOOK[payload.stockSymbol].yes[payload.price]) {
      const newPrice = 10 - payload.price;

      if (!ORDERBOOK[payload.stockSymbol].no[newPrice]) {
        ORDERBOOK[payload.stockSymbol].no[newPrice] = {
          quantity: 0,
          orders: {},
        };
      }

      if (ORDERBOOK[payload.stockSymbol].no[newPrice].orders[payload.userId]) {
        ORDERBOOK[payload.stockSymbol].no[newPrice].orders[
          payload.userId
        ].quantity += payload.quantity;
        ORDERBOOK[payload.stockSymbol].no[newPrice].orders[
          payload.userId
        ].type = "inverse";
        ORDERBOOK[payload.stockSymbol].yes[newPrice].quantity +=
          payload.quantity;
        user_with_balances[payload.userId].locked +=
          payload.price * payload.quantity;

        user_with_balances[payload.userId].balance -=
          payload.price * payload.quantity;
        // return res.status(200).json({
        //   orderedStock: ORDERBOOK,
        // });
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(ORDERBOOK));
        } else {
          console.error("WebSocket is not open");
        } // await redisClient.lPush(responseQueue, JSON.stringify(ORDERBOOK));
        return JSON.stringify(ORDERBOOK);
      } else {
        ORDERBOOK[payload.stockSymbol].no[newPrice].orders[payload.userId] = {
          quantity: payload.quantity,
          type: "inverse",
        };
        ORDERBOOK[payload.stockSymbol].no[newPrice].quantity +=
          payload.quantity;
        user_with_balances[payload.userId].locked +=
          payload.price * payload.quantity;

        // STOCK_BALANCES[userId][stockSymbol]["no"].locked += quantity;

        user_with_balances[payload.userId].balance -=
          payload.price * payload.quantity;
        // ws.send(JSON.stringify(ORDERBOOK));
        // return res.status(200).json({
        //   orderedStock: ORDERBOOK,
        // });
        console.log(ORDERBOOK);
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(ORDERBOOK));
        } else {
          console.error("WebSocket is not open");
        } // await redisClient.lPush(responseQueue, JSON.stringify(ORDERBOOK));
        return JSON.stringify(ORDERBOOK);
      }
    }

    if (ORDERBOOK[payload.stockSymbol].yes[payload.price].orders) {
      let totalAmount = payload.quantity;

      for (let user in ORDERBOOK[payload.stockSymbol].yes[payload.price]
        .orders) {
        if (totalAmount <= 0) break;
        console.log(
          ORDERBOOK[payload.stockSymbol].yes[payload.price].orders[user].type
        );

        console.log("order is processing 1");

        let currentValue =
          ORDERBOOK[payload.stockSymbol].yes[payload.price].orders[user]
            .quantity;
        let subtraction = Math.min(totalAmount, currentValue);
        user_with_balances[user].balance += payload.price * subtraction;

        ORDERBOOK[payload.stockSymbol].yes[payload.price].orders[
          user
        ].quantity -= subtraction;
        totalAmount -= subtraction;
        if (!STOCK_BALANCES[payload.userId]) {
          STOCK_BALANCES[payload.userId] = {};
        }
        console.log("order is processing 2");

        if (!STOCK_BALANCES[payload.userId][payload.stockSymbol]) {
          STOCK_BALANCES[payload.userId][payload.stockSymbol] = {
            yes: { locked: 0, quantity: 0 },
          };
        }
        STOCK_BALANCES[payload.userId][payload.stockSymbol]["yes"].quantity +=
          subtraction;
        console.log("order is processing 3");
      }

      ORDERBOOK[payload.stockSymbol].yes[payload.price].quantity -=
        payload.quantity - totalAmount;
      if (ORDERBOOK[payload.stockSymbol].yes[payload.price].quantity == 0) {
        delete ORDERBOOK[payload.stockSymbol].yes[payload.price];
      }
      console.log("order is processing 4");

      user_with_balances[payload.userId].balance -=
        payload.price * payload.quantity;
    } else {
      user_with_balances[payload.userId].balance -=
        payload.price * payload.quantity;
      user_with_balances[payload.userId].locked +=
        payload.price * payload.quantity;
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(ORDERBOOK));
    } else {
      console.error("WebSocket is not open");
    }
    // await redisClient.lPush(responseQueue, JSON.stringify(ORDERBOOK));
    return JSON.stringify(ORDERBOOK);
  } catch (error) {
    return { error: error };
  }
};
export const buyNo = async (payload: any) => {
  try {
    if (
      !payload.stockSymbol ||
      !payload.price ||
      !payload.quantity ||
      !payload.userId ||
      !payload.stockType
    ) {
      // return res.status(404).json({
      //   message: "insufficient credentials",
      // });
      console.log("insufficient credentials");
    }

    if (
      user_with_balances[payload.userId].balance <
      payload.price * payload.quantity
    ) {
      // return res.status(403).json({
      //   message: "user doesn't have sufficient balance",
      // });
      console.log("user doesnt have sufficient balanace");
    }

    if (!ORDERBOOK[payload.stockSymbol]) {
      // return res.status(400).json({
      //   message: "no stock found",
      // });
      ORDERBOOK[payload.stocksymbol] = {
        yes: {},
        no: {},
      };
    }

    if (!ORDERBOOK[payload.stockSymbol]?.no) {
      ORDERBOOK[payload.stockSymbol].no = {};
    }

    if (!ORDERBOOK[payload.stockSymbol].no[payload.price]) {
      const newPrice = 10 - payload.price;

      if (!ORDERBOOK[payload.stockSymbol].yes[newPrice]) {
        ORDERBOOK[payload.stockSymbol].yes[newPrice] = {
          quantity: 0,
          orders: {},
        };
      }

      if (ORDERBOOK[payload.stockSymbol].yes[newPrice].orders[payload.userId]) {
        ORDERBOOK[payload.stockSymbol].yes[newPrice].orders[
          payload.userId
        ].quantity += payload.quantity;
        ORDERBOOK[payload.stockSymbol].yes[newPrice].quantity +=
          payload.quantity;

        ORDERBOOK[payload.stockSymbol].yes[newPrice].orders[
          payload.userId
        ].type = "inverse";
        // STOCK_BALANCES[userId][stockSymbol]["yes"].locked += quantity;
        user_with_balances[payload.userId].locked +=
          payload.price * payload.quantity;

        user_with_balances[payload.userId].balance -=
          payload.price * payload.quantity;
        // return res.status(200).json({
        //   orderedStock: ORDERBOOK,
        // });
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(ORDERBOOK));
        } else {
          console.error("WebSocket is not open");
        }
        return JSON.stringify(ORDERBOOK);
        // await redisClient.lPush(responseQueue, JSON.stringify(ORDERBOOK));
      } else {
        ORDERBOOK[payload.stockSymbol].yes[newPrice].orders[payload.userId] = {
          quantity: payload.quantity,
          type: "inverse",
        };
        ORDERBOOK[payload.stockSymbol].yes[newPrice].quantity +=
          payload.quantity;

        user_with_balances[payload.userId].balance -=
          payload.price * payload.quantity;
        user_with_balances[payload.userId].locked +=
          payload.price * payload.quantity;
        // return res.status(200).json({
        //   orderedStock: ORDERBOOK,
        // });
        console.log(ORDERBOOK);
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(ORDERBOOK));
        } else {
          console.error("WebSocket is not open");
        }
        // await redisClient.lPush(responseQueue, JSON.stringify(ORDERBOOK));
        return JSON.stringify(ORDERBOOK);

        // STOCK_BALANCES[userId][stockSymbol]!["yes"].locked += quantity;
      }

      // ORDERBOOK[payload.stockSymbol].yes[newPrice].quantity += payload.quantity;
      // user_with_balances[payload.userId].balance -= newPrice * payload.quantity;
      // user_with_balances[payload.userId].locked += newPrice * payload.quantity;

      // // return res.status(200).json({
      // //   orderedStock: ORDERBOOK,
      // // });
      // await redisClient.lPush(responseQueue, JSON.stringify(ORDERBOOK));
    }

    if (ORDERBOOK[payload.stockSymbol].no[payload.price].orders) {
      let totalAmount = payload.quantity;

      for (let user in ORDERBOOK[payload.stockSymbol].no[payload.price]
        .orders) {
        if (totalAmount <= 0) break;

        let currentValue =
          ORDERBOOK[payload.stockSymbol].no[payload.price].orders[user]
            .quantity;
        let subtraction = Math.min(totalAmount, currentValue);

        user_with_balances[user].balance += payload.price * subtraction;

        ORDERBOOK[payload.stockSymbol].no[payload.price].orders[
          user
        ].quantity -= subtraction;
        totalAmount -= subtraction;
        if (!STOCK_BALANCES[payload.userId]) {
          STOCK_BALANCES[payload.userId] = {};
        }

        if (!STOCK_BALANCES[payload.userId][payload.stockSymbol]) {
          STOCK_BALANCES[payload.userId][payload.stockSymbol] = {
            no: { locked: 0, quantity: 0 },
          };
        }
        STOCK_BALANCES[payload.userId][payload.stockSymbol]["no"].quantity +=
          subtraction;
      }

      ORDERBOOK[payload.stockSymbol].no[payload.price]!.quantity -=
        payload.quantity - totalAmount;

      if (ORDERBOOK[payload.stockSymbol].no[payload.price].quantity == 0) {
        delete ORDERBOOK[payload.stockSymbol].no[payload.price];
      }

      user_with_balances[payload.userId].balance -=
        payload.price * payload.quantity;
    } else {
      user_with_balances[payload.userId].balance -=
        payload.price * payload.quantity;
      user_with_balances[payload.userId].locked +=
        payload.price * payload.quantity;
    }

    // await redisClient.lPush(responseQueue, JSON.stringify(ORDERBOOK));
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(ORDERBOOK));
    } else {
      console.error("WebSocket is not open");
    }
    return JSON.stringify(ORDERBOOK);

    // return res.status(200).json({
    //   orderedStock: ORDERBOOK,
    // });
  } catch (error) {
    return {
      error: error,
    };
  }
};
