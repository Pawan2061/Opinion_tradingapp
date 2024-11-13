import { createClient, RedisClientType } from "redis";
const redis_url = process.env.REDIS_URL || "redis://localhost:6379";

export class PubSubManager {
  private static instance: PubSubManager;
  private pubClient: RedisClientType;
  private subClient: RedisClientType;

  private constructor() {
    this.subClient = createClient({
      url: redis_url,
    });
    this.pubClient = createClient({
      url: redis_url,
    });
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
        await this.pubClient.connect();
      }
      if (!this.subClient.isOpen) {
        await this.subClient.connect();
      }
    } catch (error) {
      throw error;
    }
  }
  public async sendOutput(id: string, data: any) {
    await this.ensureRedisConnection();

    await this.pubClient.publish(id, JSON.stringify(data));
  }

  public handleOutput = async (output: string) => {
    try {
      const finalOutput = JSON.parse(output);

      return finalOutput;
    } catch (error) {
      throw new Error("Invalid JSON format in output");
    }
  };
}

export const pubsubManager = PubSubManager.getInstance();
