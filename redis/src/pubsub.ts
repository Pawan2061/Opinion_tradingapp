import { createClient, RedisClientType } from "redis";

export class PubSubManager {
  private static instance: PubSubManager;
  private pubClient: RedisClientType;
  private subClient: RedisClientType;

  private constructor() {
    this.subClient = createClient({});
    this.pubClient = createClient({});
  }
  public static getInstance(): PubSubManager {
    if (!PubSubManager.instance) {
      PubSubManager.instance = new PubSubManager();
    }
    return PubSubManager.instance;
  }

  private async ensureRedisConnection() {
    try {
      if (!this.pubClient.isOpen) {
        console.log("Connecting pub client to Redis...");
        await this.pubClient.connect();
      }
      if (!this.subClient.isOpen) {
        console.log("Connecting sub client to Redis...");
        await this.subClient.connect();
      }
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }
  public async sendOutput(id: string, data: any) {
    await this.ensureRedisConnection();
    console.log("start");

    await this.pubClient.publish(id, JSON.stringify(data));
    console.log("end");
  }

  public handleOutput = async (output: string) => {
    await this.ensureRedisConnection();
    const finalOutput = JSON.parse(output);
    return finalOutput;
  };
}

export const pubsubManager = PubSubManager.getInstance();
