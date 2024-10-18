import { json, request, Request, Response } from "express";

import { user_with_balances } from "../data";
import { redisClient } from "..";
import { responseQueue } from ".";

export const createUser = async (userId: string) => {
  try {
    user_with_balances[userId] = {
      balance: 0,
      locked: 0,
    };

    await redisClient.lPush(responseQueue, JSON.stringify(user_with_balances));
  } catch (error) {
    console.log(error);
    return {
      error: error,
    };
  }
};

export const onRampUser = async (payload: any) => {
  try {
    // if (!payload.userId || !payload.amount) {
    //   res.status(404).json({
    //     message: "insufficient credentials",
    //   });
    // }
    if (!user_with_balances[payload.userId]) {
      const newUser = (user_with_balances[payload.userId] = {
        balance: payload.amount,
        locked: 0,
      });
      await redisClient.lPush(
        responseQueue,
        JSON.stringify(user_with_balances)
      );
    }
    user_with_balances[payload.userId].balance += payload.amount;

    await redisClient.lPush(responseQueue, JSON.stringify(user_with_balances));
  } catch (error) {
    return {
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
    }

    await redisClient.lPush(responseQueue, JSON.stringify(userBalances));
  } catch (error) {
    return {
      error: error,
    };
  }
};

export const getUserBalance = async (payload: string) => {
  try {
    const user = user_with_balances[payload];

    console.log(user, "user here");

    if (user) {
      // res.status(200).json({
      //   id,
      //   balance: user.balance,
      //   locked: user.locked,
      // });
      await redisClient.lPush(responseQueue, JSON.stringify(user));
    } else {
      // res.status(404).json({ message: "User not found" });
      console.log("corresponding user info not found");
    }
  } catch (error) {
    return {
      error: error,
    };
  }
};
