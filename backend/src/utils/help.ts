import { redisClient, subscriber } from "../app";

export const handlePubSub = (uid: string): Promise<any> => {
  return new Promise((resolve) => {
    subscriber.subscribe(uid, (data) => {
      resolve(JSON.parse(data));
    });
  });
};
