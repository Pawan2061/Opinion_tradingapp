"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubsubManager = exports.PubSubManager = void 0;
const redis_1 = require("redis");
class PubSubManager {
    constructor() {
        this.handleOutput = async (output) => {
            try {
                const finalOutput = JSON.parse(output);
                return finalOutput;
            }
            catch (error) {
                throw new Error("Invalid JSON format in output");
            }
        };
        this.subClient = (0, redis_1.createClient)({});
        this.pubClient = (0, redis_1.createClient)({});
    }
    static getInstance() {
        if (!PubSubManager.instance) {
            PubSubManager.instance = new PubSubManager();
        }
        return PubSubManager.instance;
    }
    async ensureRedisConnection() {
        try {
            if (!this.pubClient.isOpen) {
                await this.pubClient.connect();
            }
            if (!this.subClient.isOpen) {
                await this.subClient.connect();
            }
        }
        catch (error) {
            throw error;
        }
    }
    async sendOutput(id, data) {
        await this.ensureRedisConnection();
        await this.pubClient.publish(id, JSON.stringify(data));
    }
}
exports.PubSubManager = PubSubManager;
exports.pubsubManager = PubSubManager.getInstance();
