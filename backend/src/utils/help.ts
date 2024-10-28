import { Response } from "express";
import { subscriber } from "../app";

export const handlePubSub = (uid: string): Promise<any> => {
  const time = 5000;

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      subscriber.unsubscribe(uid), reject(new Error("timeout"));
    }, 5000);
    subscriber.subscribe(uid, (data) => {
      resolve(data);
    });
  });
};

export const handleResponses = async (data: any) => {
  try {
    const { message } = data;
    console.log(message);

    console.log(data.message, data.success);

    if (data.success === true) {
      console.log("succeed", data);

      return {
        statusId: 200,
        message: data.message,
        data: data.data,
      };
    } else {
      console.log("failed", data);

      return {
        statusId: 400,
        message: data.message,
        data: data.data,
      };
    }
  } catch (error) {
    return {
      statusId: 500,
      message: "An internal error occurred",
      error: error,
    };
  }
};

export const sendResponse = (res: Response, payload: any) => {
  try {
    console.log(payload);

    const { success, ...data } = JSON.parse(payload);
    console.log(success);
    console.log(data);
    console.log("im here");

    if (!success) {
      res.status(400).json(data);
    } else {
      console.log("not here");
      console.log(data.data);

      res.status(200).send(data.data);
    }
  } catch (err) {
    res.status(500).json({ error: "Invalid response from server" });
  }
};
