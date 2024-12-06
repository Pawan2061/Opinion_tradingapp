import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
const requestQueue = "request";
const newrequestQueue = "request1";

import { redisClient, subscriber } from "../app";
import { handlePubSub, handleResponses, sendResponse } from "../utils/help";
import prisma from "../utils/prisma";
import { createToken } from "../utils/jwt";
import { JwtPayload } from "../interfaces";

export interface apResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const auth = async (req: Request, res: any) => {
  try {
    console.log("starting ");

    const { username, password } = await req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "insufficient credentials",
      });
    }
    const user = await prisma.user.create({
      data: {
        username: username,
        password: password,
      },
    });
    const payload: JwtPayload = {
      id: user.userId,
      username: user.username,
      password: user.password,
    };

    const token = await createToken(payload);

    return res.status(200).json({
      message: "user created successfully",
      user: user,
      token: token,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
};

export const createUser = async (req: Request, res: any) => {
  try {
    const id = uuid();
    const input = {
      id: id,
      method: "createUser",
      payload: req.params.userId,
    };

    try {
      const data = handlePubSub(id);
      await redisClient.lPush(requestQueue, JSON.stringify(input));
      await redisClient.lPush(newrequestQueue, JSON.stringify(input));

      const finalData = await data;

      sendResponse(res, finalData);
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

    if (!stockSymbol) {
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

    try {
      const data = handlePubSub(id);

      await redisClient.lPush(requestQueue, JSON.stringify(input));
      const finalData = await data;

      sendResponse(res, finalData);
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

    try {
      const data = handlePubSub(id);

      await redisClient.lPush(requestQueue, JSON.stringify(input));
      const finalData = await data;

      sendResponse(res, finalData);
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

    try {
      const data = handlePubSub(id);

      await redisClient.lPush(requestQueue, JSON.stringify(input));
      const finalData = await data;

      sendResponse(res, finalData);
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

    try {
      const data = handlePubSub(id);

      await redisClient.lPush(requestQueue, JSON.stringify(input));
      const finalData = await data;

      sendResponse(res, finalData);
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

    try {
      const data = handlePubSub(id);

      await redisClient.lPush(requestQueue, JSON.stringify(input));
      const finalData = await data;

      sendResponse(res, finalData);
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

    try {
      const data = handlePubSub(id);

      await redisClient.lPush(requestQueue, JSON.stringify(input));
      const finalData = await data;

      sendResponse(res, finalData);
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

    console.log("before parsing");

    try {
      const data = handlePubSub(id);

      await redisClient.lPush(requestQueue, JSON.stringify(input));
      const finalData = await data;

      sendResponse(res, finalData);
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

    try {
      const data = handlePubSub(id);

      await redisClient.lPush(requestQueue, JSON.stringify(input));
      const finalData = await data;

      sendResponse(res, finalData);
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

    try {
      const data = handlePubSub(id);

      await redisClient.lPush(requestQueue, JSON.stringify(input));
      const finalData = await data;

      sendResponse(res, finalData);
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

    const id = uuid();
    const input = {
      id: id,
      method: "mintStock",
      payload: {
        userId: userId,
        quantity: quantity,
        price: price,
        symbol: stockSymbol,
      },
    };

    try {
      const data = handlePubSub(id);

      await redisClient.lPush(requestQueue, JSON.stringify(input));
      const finalData = await data;

      sendResponse(res, finalData);
    } catch (error) {
      return res.status(400).json({
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

export const sellYes = async (req: Request, res: any) => {
  try {
    const { stockSymbol, price, userId, quantity, stockType } = req.body;
    const id = uuid();

    const input = {
      id: id,
      method: "sellyes",
      payload: {
        stockSymbol: stockSymbol,
        price: price,
        userId: userId,
        quantity: quantity,
        stockType: stockType,
      },
    };

    try {
      const data = handlePubSub(id);

      await redisClient.lPush(requestQueue, JSON.stringify(input));
      const finalData = await data;

      sendResponse(res, finalData);
    } catch (error) {
      return res.status(403).json({
        error: error,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while processing the request",
      error: error,
    });
  }
};
export const sellNo = async (req: Request, res: any) => {
  try {
    const { stockSymbol, price, userId, quantity, stockType } = req.body;
    const id = uuid();

    const input = {
      id: id,
      method: "sellNo",
      payload: {
        stockSymbol: stockSymbol,
        price: price,
        userId: userId,
        quantity: quantity,
        stockType: stockType,
      },
    };

    try {
      const data = handlePubSub(id);

      await redisClient.lPush(requestQueue, JSON.stringify(input));
      const finalData = await data;

      sendResponse(res, finalData);
    } catch (error) {
      console.log(error);

      return {
        error: error,
      };
    }
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

    try {
      const data = handlePubSub(id);

      await redisClient.lPush(requestQueue, JSON.stringify(input));
      const finalData = await data;

      sendResponse(res, finalData);
    } catch (error) {
      return res.status(500).json({ error: "Failed to subscribe to channel" });
    }
  } catch (error) {
    return res.json({
      message: error,
    });
  }
};

export const resetMemory = async (req: Request, res: any) => {
  try {
    const id = uuid();
    const input = {
      id: id,
      method: "reset",
      payload: {},
    };

    try {
      const data = handlePubSub(id);

      await redisClient.lPush(requestQueue, JSON.stringify(input));
      const finalData = await data;

      sendResponse(res, finalData);
    } catch (error) {
      return res.status(500).json({ error: "Failed to subscribe to channel" });
    }
  } catch (error) {
    return res.json({
      message: error,
    });
  }
};
