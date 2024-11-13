"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubClient = exports.redisClient = exports.ws = void 0;
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const process_1 = require("./utils/process");
const ws_1 = require("ws");
const app = (0, express_1.default)();
const requestQueue = "request";
exports.ws = new ws_1.WebSocket("ws://localhost:8080");
exports.ws.on("open", () => {
    console.log("connection established");
});
exports.ws.on("close", () => {
    console.log("connectiion closed");
});
exports.ws.on("error", () => {
    console.log("connectiion error");
});
exports.redisClient = (0, redis_1.createClient)({});
exports.pubClient = (0, redis_1.createClient)({});
async function redisConnect() {
    try {
        await exports.redisClient.connect();
        exports.redisClient.on("error", (err) => {
            console.log("Redis client error", err);
        });
        console.log("connected");
        executeProcess();
    }
    catch (error) {
        console.log(error);
    }
}
redisConnect();
async function executeProcess() {
    console.log("request");
    const resp = await exports.redisClient.brPop(requestQueue, 0);
    console.log("nedeoo");
    console.log(resp);
    await (0, process_1.processRequests)(JSON.parse(resp.element));
    executeProcess();
}
app.listen(3002, () => {
    console.log("wprking on 3002");
});
