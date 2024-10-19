import { redisClient, subscriber } from "../app";

export const handleOutput = async (output: string) => {
  const finalOutput = JSON.parse(output);
  return finalOutput;
};

export const handlePubSub = (uid: string): Promise<any> => {
  console.log("im inside handlepubsub");

  return new Promise((resolve) => {
    console.log("inside resolve");

    subscriber.subscribe(uid, (data) => {
      console.log(uid, "uid is here and", data, "is here");

      resolve(data);
    });
  });
};
