import { json, request, Request, Response } from "express";

import { INR_BALANCES } from "../data";
import { redisClient } from "..";

export const createUser = async (userId: string) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "user isnt  available",
        data: {},
      };
    }
    INR_BALANCES[userId] = {
      balance: 0,
      locked: 0,
    };

    return {
      success: true,
      message: "user created successfully",
      data: INR_BALANCES[userId],
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

    if (!INR_BALANCES[payload.userId]) {
      const newUser = (INR_BALANCES[payload.userId] = {
        balance: payload.amount,
        locked: 0,
      });

      return {
        success: true,
        message: "New user created and balance updated.",
        data: INR_BALANCES[payload.userId],
      };
    }
    INR_BALANCES[payload.userId].balance += payload.amount;

    return {
      success: true,
      message: "Balance updated successfully.",
      data: INR_BALANCES[payload.userId],
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
    const userBalances = INR_BALANCES;
    if (!userBalances) {
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
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const getUserBalance = async (payload: string) => {
  try {
    const user = INR_BALANCES[payload];

    if (user) {
      return {
        success: true,
        message: "Userbalance",
        data: user,
      };
    } else {
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
