import { json, request, Request, Response } from "express";

import { user_with_balances } from "../data";
import { redisClient } from "..";
import { responseQueue } from ".";

export const createUser = async (userId: string) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "user isnt  available",
        data: {},
      };
    }
    user_with_balances[userId] = {
      balance: 0,
      locked: 0,
    };

    return {
      success: true,
      message: "user created successfully",
      data: user_with_balances[userId],
    };
  } catch (error) {
    console.log(error);
    return {
      error: error,
    };
  }
};

export const onRampUser = async (payload: any) => {
  try {
    if (!payload.userId || !payload.amount) {
      return {
        success: false,
        message: "Insufficient credentials: userId and amount are required.",
      };
    }

    if (!user_with_balances[payload.userId]) {
      const newUser = (user_with_balances[payload.userId] = {
        balance: payload.amount,
        locked: 0,
      });
      // await redisClient.lPush(
      //   responseQueue,
      //   JSON.stringify(user_with_balances)
      // );

      return {
        success: true,
        message: "New user created and balance updated.",
        data: user_with_balances[payload.userId],
      };
    }
    user_with_balances[payload.userId].balance += payload.amount;

    // await redisClient.lPush(responseQueue, JSON.stringify(user_with_balances));
    return {
      success: true,
      message: "Balance updated successfully.",
      data: user_with_balances[payload.userId],
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred during onRamp operation.",
      error: error,
    };
  }
};

export const getBalances = async (payload: string) => {
  try {
    const userBalances = user_with_balances;
    if (!userBalances) {
      // return res.status(404).json({
      //   message: "no balances found",
      // });
      console.log("error");
      return {
        success: false,
        message: "no balances found",
        data: userBalances,
      };
    }

    return {
      success: true,
      message: "User balances:",
      data: userBalances,
    };

    // await redisClient.lPush(responseQueue, JSON.stringify(userBalances));
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const getUserBalance = async (payload: string) => {
  try {
    const user = user_with_balances[payload];

    if (user) {
      // res.status(200).json({
      //   id,
      //   balance: user.balance,
      //   locked: user.locked,
      // });
      // await redisClient.lPush(responseQueue, JSON.stringify(user));
      return {
        success: true,
        message: "Userbalance",
        data: user,
      };
    } else {
      // res.status(404).json({ message: "User not found" });
      return {
        success: false,
        message: "user not found",
        data: {},
      };
    }
  } catch (error) {
    return {
      error: error,
    };
  }
};
