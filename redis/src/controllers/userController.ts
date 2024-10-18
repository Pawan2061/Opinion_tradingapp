import { json, Request, Response } from "express";

import { createClient } from "redis";
import { user_with_balances } from "../data";
import { redisClient } from "..";

export const createUser = async (userId: string) => {
  try {
    user_with_balances[userId] = {
      balance: 0,
      locked: 0,
    };

    await redisClient.lPush("receive-user", JSON.stringify(user_with_balances));
  } catch (error) {
    console.log(error);
    return {
      error: error,
    };
  }
};
