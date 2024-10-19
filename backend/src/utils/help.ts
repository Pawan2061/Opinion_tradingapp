import { redisClient, subscriber } from "../app";

export const handlePubSub = (uid: string): Promise<any> => {
  return new Promise((resolve) => {
    subscriber.subscribe(uid, (data) => {
      resolve(data);
    });
  });
};

export const handleResponses = (data: any) => {
  try {
    console.log(data);
    console.log(data.data);
    console.log(data.message);

    if (data.success) {
      console.log("succeed", data);

      return {
        statusId: 400,
        message: data.message,
        data: data.data,
      };
    } else {
      console.log("failed", data);

      return {
        statusId: 200,
        message: data.message,
        data: data.data,
      };
    }
  } catch (error) {
    return error;
  }
};
