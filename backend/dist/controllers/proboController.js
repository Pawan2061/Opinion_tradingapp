"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMemory = exports.getOrderbook = exports.sellNo = exports.sellYes = exports.mintStock = exports.viewOrderbook = exports.buyNo = exports.buyYes = exports.getBalanceStock = exports.rampUser = exports.getUserBalance = exports.getStocks = exports.getBalances = exports.createSymbol = exports.createUser = void 0;
const uuid_1 = require("uuid");
const requestQueue = "request";
const app_1 = require("../app");
const help_1 = require("../utils/help");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
        const input = {
            id: id,
            method: "createUser",
            payload: req.params.userId,
        };
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            return res.status(500).json({ error: "Failed to subscribe to channel" });
        }
    }
    catch (error) {
        return res.status(400).json({
            error,
        });
    }
});
exports.createUser = createUser;
const createSymbol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stockSymbol = req.params.stockSymbol;
        const { userId } = req.body;
        if (!stockSymbol) {
            return res.status(404).json({
                message: "Insufficient data",
            });
        }
        const id = (0, uuid_1.v4)();
        const input = {
            id: id,
            method: "createSymbol",
            payload: {
                stockSymbol: stockSymbol,
                userId: userId,
            },
        };
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to subscribe to channel" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            error: error,
        });
    }
});
exports.createSymbol = createSymbol;
const getBalances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
        const input = {
            id: id,
            method: "getBalance",
            payload: {},
        };
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            return res.status(500).json({ error: "Failed to subscribe to channel" });
        }
    }
    catch (error) {
        return res.status(400).json({
            error: error,
        });
    }
});
exports.getBalances = getBalances;
const getStocks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
        const input = {
            id: id,
            method: "getStocks",
            payload: {},
        };
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            return res.status(500).json({ error: "Failed to subscribe to channel" });
        }
    }
    catch (error) {
        return res.status(400).json({
            error: error,
        });
    }
});
exports.getStocks = getStocks;
const getUserBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const id = (0, uuid_1.v4)();
        const input = {
            id: id,
            method: "getUserBalance",
            payload: userId,
        };
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            return res.status(500).json({ error: "Failed to subscribe to channel" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});
exports.getUserBalance = getUserBalance;
const rampUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, amount } = req.body;
        const id = (0, uuid_1.v4)();
        const input = {
            method: "onRamp",
            id: id,
            payload: {
                userId: userId,
                amount: amount,
            },
        };
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to subscribe to channel" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            error: error,
        });
    }
});
exports.rampUser = rampUser;
const getBalanceStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
        const userId = req.params.userId;
        const input = {
            id: id,
            method: "getBalanceStock",
            payload: userId,
        };
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            return res.status(400).send(error);
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            error: error,
        });
    }
});
exports.getBalanceStock = getBalanceStock;
const buyYes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stockSymbol, price, quantity, userId, stockType } = req.body;
        const id = (0, uuid_1.v4)();
        const input = {
            id: id,
            method: "buyYes",
            payload: {
                stockSymbol,
                price,
                quantity,
                userId,
                stockType,
            },
        };
        console.log("before parsing");
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            return res.status(403).json({
                error: error,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            error: error,
        });
    }
});
exports.buyYes = buyYes;
const buyNo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stockSymbol, price, quantity, userId, stockType } = req.body;
        const id = (0, uuid_1.v4)();
        const input = {
            id: id,
            method: "buyNo",
            payload: {
                stockSymbol: stockSymbol,
                price: price,
                quantity: quantity,
                userId: userId,
                stockType: stockType,
            },
        };
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            return res.status(403).json({
                error: error,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            error: error,
        });
    }
});
exports.buyNo = buyNo;
const viewOrderbook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stockSymbol = req.params.stockSymbol;
        const id = (0, uuid_1.v4)();
        const input = {
            id: id,
            method: "viewOrderbook",
            payload: stockSymbol,
        };
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            return res.status(400).send(error);
        }
    }
    catch (error) {
        return res.status(400).json({
            error: error,
        });
    }
});
exports.viewOrderbook = viewOrderbook;
const mintStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, quantity, price, stockSymbol } = req.body;
        const id = (0, uuid_1.v4)();
        const input = {
            id: id,
            method: "mintStock",
            payload: {
                userId: userId,
                quantity: quantity,
                price: price,
                symbol: stockSymbol,
            },
        };
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            return res.status(400).json({
                error: error,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            error: error,
        });
    }
});
exports.mintStock = mintStock;
const sellYes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stockSymbol, price, userId, quantity, stockType } = req.body;
        const id = (0, uuid_1.v4)();
        const input = {
            id: id,
            method: "sellyes",
            payload: {
                stockSymbol: stockSymbol,
                price: price,
                userId: userId,
                quantity: quantity,
                stockType: stockType,
            },
        };
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            return res.status(403).json({
                error: error,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing the request",
            error: error,
        });
    }
});
exports.sellYes = sellYes;
const sellNo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stockSymbol, price, userId, quantity, stockType } = req.body;
        const id = (0, uuid_1.v4)();
        const input = {
            id: id,
            method: "sellNo",
            payload: {
                stockSymbol: stockSymbol,
                price: price,
                userId: userId,
                quantity: quantity,
                stockType: stockType,
            },
        };
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            console.log(error);
            return {
                error: error,
            };
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "An error occurred while processing the request",
            error: error,
        });
    }
});
exports.sellNo = sellNo;
const getOrderbook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
        const input = {
            id: id,
            method: "getOrderbooks",
            payload: {},
        };
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            return res.status(500).json({ error: "Failed to subscribe to channel" });
        }
    }
    catch (error) {
        return res.json({
            message: error,
        });
    }
});
exports.getOrderbook = getOrderbook;
const resetMemory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v4)();
        const input = {
            id: id,
            method: "reset",
            payload: {},
        };
        try {
            const data = (0, help_1.handlePubSub)(id);
            yield app_1.redisClient.lPush(requestQueue, JSON.stringify(input));
            const finalData = yield data;
            (0, help_1.sendResponse)(res, finalData);
        }
        catch (error) {
            return res.status(500).json({ error: "Failed to subscribe to channel" });
        }
    }
    catch (error) {
        return res.json({
            message: error,
        });
    }
});
exports.resetMemory = resetMemory;
