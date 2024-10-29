"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayBook = void 0;
const redis_1 = require("redis");
const displayBook = async (symbol, orderbook) => {
    const pubClient = (0, redis_1.createClient)();
    await pubClient.connect();
    try {
        console.log(`orderbook.${symbol}`);
        await pubClient.publish(`orderbook.${symbol}`, JSON.stringify(orderbook));
    }
    catch (error) {
        console.log(error);
        throw new Error("cant proceed with the orderbook");
    }
    finally {
        await pubClient.disconnect();
    }
};
exports.displayBook = displayBook;
