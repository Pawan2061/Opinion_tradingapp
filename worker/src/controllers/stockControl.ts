import { response, Response } from "express";
import { WebSocket } from "ws";
import { redisClient, ws } from "..";
import { ORDERBOOK, STOCK_BALANCES, INR_BALANCES } from "../data";
import { displayBook } from "../utils/sendbook";

export const createSymbol = async (payload: any) => {
  try {
    if (ORDERBOOK.hasOwnProperty(payload.stockSymbol)) {
      console.log("already there");
      return {
        success: false,
        message: "this symbol is already available",
        data: ORDERBOOK[payload.stockSymbol],
      };
    }
    ORDERBOOK[payload.stockSymbol] = {
      yes: {},
      no: {},
    };
    console.log("very close");

    const stocksymbol = payload.stockSymbol;
    await displayBook(payload.stockSymbol, ORDERBOOK[payload.stockSymbol]);

    return {
      success: true,
      message: `${payload.stockSymbol} is created`,
      data: ORDERBOOK[payload.stockSymbol],
    };
  } catch (error) {
    return { error: error };
  }
};

export const getOrderbooks = async (payload: string) => {
  try {
    const orderbooks = ORDERBOOK;
    if (!orderbooks) {
      return {
        success: false,
        message: "this orderbook is not  available",
        data: {},
      };
    }

    await displayBook(payload, JSON.stringify(ORDERBOOK));

    return {
      success: true,
      message: "ORDERBOOKS:",
      data: ORDERBOOK,
    };
  } catch (error) {
    return { error: error };
  }
};

export const viewOrderbook = async (payload: string) => {
  try {
    console.log(payload, "here");

    if (!payload) {
      return {
        success: true,
        message: "insuficient creds:",
        data: {},
      };
    }

    const book = ORDERBOOK[payload];

    await displayBook(payload, ORDERBOOK[payload]);
    return {
      success: true,
      message: "ORDERBOOK",
      data: ORDERBOOK[payload],
    };
  } catch (error) {
    return { error: error };
  }
};

export const getStocks = async (payload: string) => {
  try {
    const stock_balance = STOCK_BALANCES;
    if (!stock_balance) {
      return {
        success: false,
        message: "this stock is not available",
        data: {},
      };
    }
    return {
      success: true,
      message: "Stocks:",
      data: stock_balance,
    };
  } catch (error) {
    return { error: error };
  }
};

export const getBalanceStock = async (payload: string) => {
  try {
    const stockbalance = STOCK_BALANCES[payload];
    //

    if (!stockbalance) {
      return {
        success: false,
        message: "this stock is not available",
        data: {},
      };
    }

    return {
      success: true,
      message: "Stocks",
      data: stockbalance,
    };
  } catch (error) {
    return { error: error };
  }
};

export const buyYes = async (payload: any) => {
  try {
    if (
      !payload.stockSymbol ||
      !payload.price ||
      !payload.quantity ||
      !payload.userId ||
      !payload.stockType
    ) {
      return {
        success: false,
        message: "this credentials aren't  available",
        data: {},
      };
    }

    if (
      INR_BALANCES[payload.userId]!.balance <
      payload.price * payload.quantity
    ) {
      return {
        success: false,
        message: "insufficientbalance",
        data: {},
      };
    }

    if (!ORDERBOOK[payload.stockSymbol]) {
      ORDERBOOK[payload.stockSymbol] = {
        yes: {},
        no: {},
      };
    }

    if (!ORDERBOOK[payload.stockSymbol]?.yes) {
      ORDERBOOK[payload.stockSymbol].yes = {};
    }

    if (!ORDERBOOK[payload.stockSymbol].yes[payload.price]) {
      const newPrice = 1000 - payload.price;

      if (!ORDERBOOK[payload.stockSymbol].no[newPrice]) {
        ORDERBOOK[payload.stockSymbol].no[newPrice] = {
          total: 0,
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
        ORDERBOOK[payload.stockSymbol].yes[newPrice].total += payload.quantity;
        INR_BALANCES[payload.userId].locked += payload.price * payload.quantity;

        INR_BALANCES[payload.userId].balance -=
          payload.price * payload.quantity;
        // r

        await displayBook(payload.stockSymbol, ORDERBOOK[payload.stockSymbol]);
        return {
          success: true,
          message: "ORDERBOOK",
          data: ORDERBOOK[payload.stockSymbol],
        };
      } else {
        ORDERBOOK[payload.stockSymbol].no[newPrice].orders[payload.userId] = {
          quantity: payload.quantity,
          type: "inverse",
        };
        ORDERBOOK[payload.stockSymbol].no[newPrice].total += payload.quantity;
        INR_BALANCES[payload.userId].locked += payload.price * payload.quantity;

        INR_BALANCES[payload.userId].balance -=
          payload.price * payload.quantity;

        console.log(ORDERBOOK);
        await displayBook(payload.stockSymbol, ORDERBOOK[payload.stockSymbol]);

        return {
          success: true,
          message: "ORDERBOOK",
          data: ORDERBOOK[payload.stockSymbol],
        };
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

        let currentValue =
          ORDERBOOK[payload.stockSymbol].yes[payload.price].orders[user]
            .quantity;
        let subtraction = Math.min(totalAmount, currentValue);
        INR_BALANCES[user].balance += payload.price * subtraction;

        ORDERBOOK[payload.stockSymbol].yes[payload.price].orders[
          user
        ].quantity -= subtraction;
        totalAmount -= subtraction;
        if (!STOCK_BALANCES[payload.userId]) {
          STOCK_BALANCES[payload.userId] = {};
        }

        if (!STOCK_BALANCES[payload.userId][payload.stockSymbol]) {
          STOCK_BALANCES[payload.userId][payload.stockSymbol] = {
            yes: { locked: 0, quantity: 0 },
          };
        }

        STOCK_BALANCES[payload.userId][payload.stockSymbol]["yes"].quantity +=
          subtraction;
      }

      ORDERBOOK[payload.stockSymbol].yes[payload.price].total -=
        payload.quantity - totalAmount;
      if (ORDERBOOK[payload.stockSymbol].yes[payload.price].total == 0) {
        delete ORDERBOOK[payload.stockSymbol].yes[payload.price];
      }

      INR_BALANCES[payload.userId].balance -= payload.price * payload.quantity;
    } else {
      INR_BALANCES[payload.userId].balance -= payload.price * payload.quantity;
      INR_BALANCES[payload.userId].locked += payload.price * payload.quantity;
    }
    const stockSymbol = payload.stockSymbol;
    await displayBook(payload.stockSymbol, ORDERBOOK[payload.stockSymbol]);

    return {
      success: true,
      message: "ORDERBOOK",
      data: ORDERBOOK[payload.stockSymbol],
    };
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
      return {
        success: false,
        message: "credentails unavilable",
        data: {},
      };
    }

    if (
      INR_BALANCES[payload.userId].balance <
      payload.price * payload.quantity
    ) {
      return {
        success: false,
        message: "insufficient balance",
        data: {},
      };
    }

    if (!ORDERBOOK[payload.stockSymbol]) {
      ORDERBOOK[payload.stocksymbol] = {
        yes: {},
        no: {},
      };
    }

    if (!ORDERBOOK[payload.stockSymbol]?.no) {
      ORDERBOOK[payload.stockSymbol].no = {};
    }

    if (!ORDERBOOK[payload.stockSymbol].no[payload.price]) {
      const newPrice = 1000 - payload.price;

      if (!ORDERBOOK[payload.stockSymbol].yes[newPrice]) {
        ORDERBOOK[payload.stockSymbol].yes[newPrice] = {
          total: 0,
          orders: {},
        };
      }

      if (ORDERBOOK[payload.stockSymbol].yes[newPrice].orders[payload.userId]) {
        ORDERBOOK[payload.stockSymbol].yes[newPrice].orders[
          payload.userId
        ].quantity += payload.quantity;
        ORDERBOOK[payload.stockSymbol].yes[newPrice].total += payload.quantity;

        ORDERBOOK[payload.stockSymbol].yes[newPrice].orders[
          payload.userId
        ].type = "inverse";
        // STOCK_BALANCES[userId][stockSymbol]["yes"].locked += quantity;
        INR_BALANCES[payload.userId].locked += payload.price * payload.quantity;

        INR_BALANCES[payload.userId].balance -=
          payload.price * payload.quantity;

        await displayBook(payload.stockSymbol, ORDERBOOK[payload.stockSymbol]);

        return {
          success: true,
          message: "ORDERBOOK",
          data: ORDERBOOK[payload.stockSymbol],
        };
        // await redisClient.lPush(responseQueue, JSON.stringify(ORDERBOOK));
      } else {
        ORDERBOOK[payload.stockSymbol].yes[newPrice].orders[payload.userId] = {
          quantity: payload.quantity,
          type: "inverse",
        };
        ORDERBOOK[payload.stockSymbol].yes[newPrice].total += payload.quantity;

        INR_BALANCES[payload.userId].balance -=
          payload.price * payload.quantity;
        INR_BALANCES[payload.userId].locked += payload.price * payload.quantity;

        console.log(ORDERBOOK);
        await displayBook(payload.stockSymbol, ORDERBOOK[payload.stockSymbol]);

        return {
          success: true,
          message: "ORDERBOOK",
          data: ORDERBOOK[payload.stockSymbol],
        };
      }
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

        INR_BALANCES[user].balance += payload.price * subtraction;

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

      ORDERBOOK[payload.stockSymbol].no[payload.price]!.total -=
        payload.quantity - totalAmount;

      if (ORDERBOOK[payload.stockSymbol].no[payload.price].total == 0) {
        delete ORDERBOOK[payload.stockSymbol].no[payload.price];
      }

      INR_BALANCES[payload.userId].balance -= payload.price * payload.quantity;
    } else {
      INR_BALANCES[payload.userId].balance -= payload.price * payload.quantity;
      INR_BALANCES[payload.userId].locked += payload.price * payload.quantity;
    }

    await displayBook(payload.stockSymbol, ORDERBOOK[payload.stockSymbol]);

    return {
      success: true,
      message: "ORDERBOOK",
      data: ORDERBOOK[payload.stockSymbol],
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const sellYes = async (payload: any) => {
  console.log(payload, "this is mypayload");

  try {
    if (
      !payload.stockSymbol ||
      !payload.price ||
      !payload.userId ||
      !payload.quantity ||
      !payload.stockType
    ) {
      return {
        success: false,
        message: "insufficient creds",
        data: {},
      };
    }

    if (
      !STOCK_BALANCES[payload.userId] ||
      !STOCK_BALANCES[payload.userId][payload.stockSymbol] ||
      !STOCK_BALANCES[payload.userId][payload.stockSymbol]["yes"]
    ) {
      return {
        success: false,
        message: "no stocks available",
        data: {},
      };
    }

    if (
      STOCK_BALANCES[payload.userId][payload.stockSymbol]["yes"].quantity <
      payload.quantity
    ) {
      return {
        success: false,
        message: "user dont have enough stocks",
        data: {},
      };
    }

    STOCK_BALANCES[payload.userId][payload.stockSymbol]["yes"].locked +=
      payload.quantity;
    STOCK_BALANCES[payload.userId][payload.stockSymbol]["yes"].quantity -=
      payload.quantity;

    if (!ORDERBOOK[payload.stockSymbol]) {
      ORDERBOOK[payload.stockSymbol] = { yes: {}, no: {} };
    }
    if (!ORDERBOOK[payload.stockSymbol].yes[payload.price]) {
      ORDERBOOK[payload.stockSymbol].yes[payload.price] = {
        total: 0,
        orders: {},
      };
    }
    if (
      !ORDERBOOK[payload.stockSymbol].yes[payload.price].orders[payload.userId]
    ) {
      ORDERBOOK[payload.stockSymbol].yes[payload.price].orders[payload.userId] =
        {
          quantity: 0,
          type: "normal",
        };
    }

    ORDERBOOK[payload.stockSymbol].yes[payload.price].total += payload.quantity;
    ORDERBOOK[payload.stockSymbol].yes[payload.price].orders[
      payload.userId
    ].quantity += payload.quantity;

    await displayBook(payload.stockSymbol, ORDERBOOK[payload.stockSymbol]);

    return {
      success: true,
      message: "sold this stock",
      data: STOCK_BALANCES[payload.userId],
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const sellNo = async (payload: any) => {
  try {
    if (
      !payload.stockSymbol ||
      !payload.price ||
      !payload.userId ||
      !payload.quantity ||
      !payload.stockType
    ) {
      console.log("Insuffciient");

      return {
        success: false,
        message: "insufficient credentials",
        data: {},
      };
    }

    if (
      !STOCK_BALANCES[payload.userId] ||
      !STOCK_BALANCES[payload.userId][payload.stockSymbol] ||
      !STOCK_BALANCES[payload.userId][payload.stockSymbol]["no"]
    ) {
      payload.stockSymbol;

      return {
        success: false,
        message: "no such stock available",
        data: {},
      };
    }

    if (
      STOCK_BALANCES[payload.userId][payload.stockSymbol]["no"].quantity <
      payload.quantity
    ) {
      return {
        success: true,
        message: "you dont have enough no stocks",
        data: {},
      };
    }

    STOCK_BALANCES[payload.userId][payload.stockSymbol]["no"].locked +=
      payload.quantity;
    STOCK_BALANCES[payload.userId][payload.stockSymbol]["no"].quantity -=
      payload.quantity;

    if (!ORDERBOOK[payload.stockSymbol]) {
      ORDERBOOK[payload.stockSymbol] = { yes: {}, no: {} };
    }
    if (!ORDERBOOK[payload.stockSymbol].no[payload.price]) {
      ORDERBOOK[payload.stockSymbol].no[payload.price] = {
        total: 0,
        orders: {},
      };
    }
    if (
      !ORDERBOOK[payload.stockSymbol].no[payload.price].orders[payload.userId]
    ) {
      ORDERBOOK[payload.stockSymbol].no[payload.price].orders[payload.userId] =
        {
          quantity: 0,
          type: "normal",
        };
    }

    ORDERBOOK[payload.stockSymbol].no[payload.price].total += payload.quantity;
    ORDERBOOK[payload.stockSymbol].no[payload.price].orders[
      payload.userId
    ].quantity += payload.quantity;
    ORDERBOOK[payload.stockSymbol].no[payload.price].orders[
      payload.userId
    ].type = "normal";

    await displayBook(payload.stockSymbol, ORDERBOOK[payload.stockSymbol]);

    return {
      success: true,
      message: "sold this stock",
      data: STOCK_BALANCES,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const mintStock = async (payload: any) => {
  try {
    // if (
    //   INR_BALANCES[payload.userId].balance <=
    //   payload.quantity * payload.price
    // ) {
    //   return {
    //     success: false,
    //     message: "insufficent balance",
    //     data: {},
    //   };
    // }

    if (!ORDERBOOK[payload.symbol]) {
      ORDERBOOK[payload.symbol] = {
        yes: {},
        no: {},
      };
    }

    if (!ORDERBOOK[payload.symbol].yes[5] || !ORDERBOOK[payload.symbol].no[5]) {
      ORDERBOOK[payload.symbol].yes[5] = { total: 0, orders: {} };
      ORDERBOOK[payload.symbol].no[5] = { total: 0, orders: {} };
    }
    ORDERBOOK[payload.symbol].yes[5].total += payload.quantity;
    ORDERBOOK[payload.symbol].no[5].total += payload.quantity;

    ORDERBOOK[payload.symbol].yes[5].orders = {
      [payload.userId]: {
        quantity: payload.quantity,
        type: "normal",
      },
    };
    ORDERBOOK[payload.symbol].no[5].orders = {
      [payload.userId]: {
        quantity: payload.quantity,
        type: "normal",
      },
    };

    if (!STOCK_BALANCES[payload.userId]) {
      STOCK_BALANCES[payload.userId] = {};
    }

    STOCK_BALANCES[payload.userId][payload.symbol] = {
      yes: {
        locked: 0,
        quantity: payload.quantity,
      },
      no: {
        locked: 0,
        quantity: payload.quantity,
      },
    };

    console.log("ndudhiei");

    await displayBook(payload.symbol, ORDERBOOK[payload.symbol]);
    return {
      success: true,
      message: "minted this stock",
      data: ORDERBOOK[payload.symbol],
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const reset = async (payload: any) => {
  try {
    Object.keys(STOCK_BALANCES).forEach((key) => delete STOCK_BALANCES[key]);
    Object.keys(INR_BALANCES).forEach((key) => delete INR_BALANCES[key]);
    Object.keys(ORDERBOOK).forEach((key) => delete ORDERBOOK[key]);
    console.log("deleted");

    return {
      success: true,
      message: "reset everything",
      data: ORDERBOOK,
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};
