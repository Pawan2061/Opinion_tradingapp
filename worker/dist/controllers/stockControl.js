"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset = exports.mintStock = exports.sellNo = exports.sellYes = exports.buyNo = exports.buyYes = exports.getBalanceStock = exports.getStocks = exports.viewOrderbook = exports.getOrderbooks = exports.createSymbol = void 0;
const data_1 = require("../data");
const sendbook_1 = require("../utils/sendbook");
const createSymbol = async (payload) => {
    try {
        if (data_1.ORDERBOOK.hasOwnProperty(payload.stockSymbol)) {
            console.log("already there");
            return {
                success: false,
                message: "this symbol is already available",
                data: data_1.ORDERBOOK[payload.stockSymbol],
            };
        }
        data_1.ORDERBOOK[payload.stockSymbol] = {
            yes: {},
            no: {},
        };
        console.log("very close");
        const stocksymbol = payload.stockSymbol;
        await (0, sendbook_1.displayBook)(payload.stockSymbol, data_1.ORDERBOOK[payload.stockSymbol]);
        return {
            success: true,
            message: `${payload.stockSymbol} is created`,
            data: data_1.ORDERBOOK[payload.stockSymbol],
        };
    }
    catch (error) {
        return { error: error };
    }
};
exports.createSymbol = createSymbol;
const getOrderbooks = async (payload) => {
    try {
        const orderbooks = data_1.ORDERBOOK;
        if (!orderbooks) {
            return {
                success: false,
                message: "this orderbook is not  available",
                data: {},
            };
        }
        await (0, sendbook_1.displayBook)(payload, JSON.stringify(data_1.ORDERBOOK));
        return {
            success: true,
            message: "ORDERBOOKS:",
            data: data_1.ORDERBOOK,
        };
    }
    catch (error) {
        return { error: error };
    }
};
exports.getOrderbooks = getOrderbooks;
const viewOrderbook = async (payload) => {
    try {
        console.log(payload, "here");
        if (!payload) {
            return {
                success: true,
                message: "insuficient creds:",
                data: {},
            };
        }
        const book = data_1.ORDERBOOK[payload];
        await (0, sendbook_1.displayBook)(payload, data_1.ORDERBOOK[payload]);
        return {
            success: true,
            message: "ORDERBOOK",
            data: data_1.ORDERBOOK[payload],
        };
    }
    catch (error) {
        return { error: error };
    }
};
exports.viewOrderbook = viewOrderbook;
const getStocks = async (payload) => {
    try {
        const stock_balance = data_1.STOCK_BALANCES;
        if (!stock_balance) {
            return {
                success: false,
                message: "this stock is not available",
                data: {},
            };
        }
        return {
            success: true,
            message: "Stocks:",
            data: stock_balance,
        };
    }
    catch (error) {
        return { error: error };
    }
};
exports.getStocks = getStocks;
const getBalanceStock = async (payload) => {
    try {
        const stockbalance = data_1.STOCK_BALANCES[payload];
        //
        if (!stockbalance) {
            return {
                success: false,
                message: "this stock is not available",
                data: {},
            };
        }
        return {
            success: true,
            message: "Stocks",
            data: stockbalance,
        };
    }
    catch (error) {
        return { error: error };
    }
};
exports.getBalanceStock = getBalanceStock;
const buyYes = async (payload) => {
    var _a;
    try {
        if (!payload.stockSymbol ||
            !payload.price ||
            !payload.quantity ||
            !payload.userId ||
            !payload.stockType) {
            return {
                success: false,
                message: "this credentials aren't  available",
                data: {},
            };
        }
        if (data_1.INR_BALANCES[payload.userId].balance <
            payload.price * payload.quantity) {
            return {
                success: false,
                message: "insufficientbalance",
                data: {},
            };
        }
        if (!data_1.ORDERBOOK[payload.stockSymbol]) {
            data_1.ORDERBOOK[payload.stockSymbol] = {
                yes: {},
                no: {},
            };
        }
        if (!((_a = data_1.ORDERBOOK[payload.stockSymbol]) === null || _a === void 0 ? void 0 : _a.yes)) {
            data_1.ORDERBOOK[payload.stockSymbol].yes = {};
        }
        if (!data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price]) {
            const newPrice = 1000 - payload.price;
            if (!data_1.ORDERBOOK[payload.stockSymbol].no[newPrice]) {
                data_1.ORDERBOOK[payload.stockSymbol].no[newPrice] = {
                    total: 0,
                    orders: {},
                };
            }
            if (data_1.ORDERBOOK[payload.stockSymbol].no[newPrice].orders[payload.userId]) {
                data_1.ORDERBOOK[payload.stockSymbol].no[newPrice].orders[payload.userId].quantity += payload.quantity;
                data_1.ORDERBOOK[payload.stockSymbol].no[newPrice].orders[payload.userId].type = "inverse";
                data_1.ORDERBOOK[payload.stockSymbol].yes[newPrice].total += payload.quantity;
                data_1.INR_BALANCES[payload.userId].locked += payload.price * payload.quantity;
                data_1.INR_BALANCES[payload.userId].balance -=
                    payload.price * payload.quantity;
                // r
                await (0, sendbook_1.displayBook)(payload.stockSymbol, data_1.ORDERBOOK[payload.stockSymbol]);
                return {
                    success: true,
                    message: "ORDERBOOK",
                    data: data_1.ORDERBOOK[payload.stockSymbol],
                };
            }
            else {
                data_1.ORDERBOOK[payload.stockSymbol].no[newPrice].orders[payload.userId] = {
                    quantity: payload.quantity,
                    type: "inverse",
                };
                data_1.ORDERBOOK[payload.stockSymbol].no[newPrice].total += payload.quantity;
                data_1.INR_BALANCES[payload.userId].locked += payload.price * payload.quantity;
                data_1.INR_BALANCES[payload.userId].balance -=
                    payload.price * payload.quantity;
                console.log(data_1.ORDERBOOK);
                await (0, sendbook_1.displayBook)(payload.stockSymbol, data_1.ORDERBOOK[payload.stockSymbol]);
                return {
                    success: true,
                    message: "ORDERBOOK",
                    data: data_1.ORDERBOOK[payload.stockSymbol],
                };
            }
        }
        if (data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price].orders) {
            let totalAmount = payload.quantity;
            for (let user in data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price]
                .orders) {
                if (totalAmount <= 0)
                    break;
                console.log(data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price].orders[user].type);
                let currentValue = data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price].orders[user]
                    .quantity;
                let subtraction = Math.min(totalAmount, currentValue);
                data_1.INR_BALANCES[user].balance += payload.price * subtraction;
                data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price].orders[user].quantity -= subtraction;
                totalAmount -= subtraction;
                if (!data_1.STOCK_BALANCES[payload.userId]) {
                    data_1.STOCK_BALANCES[payload.userId] = {};
                }
                if (!data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol]) {
                    data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol] = {
                        yes: { locked: 0, quantity: 0 },
                    };
                }
                data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol]["yes"].quantity +=
                    subtraction;
            }
            data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price].total -=
                payload.quantity - totalAmount;
            if (data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price].total == 0) {
                delete data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price];
            }
            data_1.INR_BALANCES[payload.userId].balance -= payload.price * payload.quantity;
        }
        else {
            data_1.INR_BALANCES[payload.userId].balance -= payload.price * payload.quantity;
            data_1.INR_BALANCES[payload.userId].locked += payload.price * payload.quantity;
        }
        const stockSymbol = payload.stockSymbol;
        await (0, sendbook_1.displayBook)(payload.stockSymbol, data_1.ORDERBOOK[payload.stockSymbol]);
        return {
            success: true,
            message: "ORDERBOOK",
            data: data_1.ORDERBOOK[payload.stockSymbol],
        };
    }
    catch (error) {
        return { error: error };
    }
};
exports.buyYes = buyYes;
const buyNo = async (payload) => {
    var _a;
    try {
        if (!payload.stockSymbol ||
            !payload.price ||
            !payload.quantity ||
            !payload.userId ||
            !payload.stockType) {
            return {
                success: false,
                message: "credentails unavilable",
                data: {},
            };
        }
        if (data_1.INR_BALANCES[payload.userId].balance <
            payload.price * payload.quantity) {
            return {
                success: false,
                message: "insufficient balance",
                data: {},
            };
        }
        if (!data_1.ORDERBOOK[payload.stockSymbol]) {
            data_1.ORDERBOOK[payload.stocksymbol] = {
                yes: {},
                no: {},
            };
        }
        if (!((_a = data_1.ORDERBOOK[payload.stockSymbol]) === null || _a === void 0 ? void 0 : _a.no)) {
            data_1.ORDERBOOK[payload.stockSymbol].no = {};
        }
        if (!data_1.ORDERBOOK[payload.stockSymbol].no[payload.price]) {
            const newPrice = 1000 - payload.price;
            if (!data_1.ORDERBOOK[payload.stockSymbol].yes[newPrice]) {
                data_1.ORDERBOOK[payload.stockSymbol].yes[newPrice] = {
                    total: 0,
                    orders: {},
                };
            }
            if (data_1.ORDERBOOK[payload.stockSymbol].yes[newPrice].orders[payload.userId]) {
                data_1.ORDERBOOK[payload.stockSymbol].yes[newPrice].orders[payload.userId].quantity += payload.quantity;
                data_1.ORDERBOOK[payload.stockSymbol].yes[newPrice].total += payload.quantity;
                data_1.ORDERBOOK[payload.stockSymbol].yes[newPrice].orders[payload.userId].type = "inverse";
                // STOCK_BALANCES[userId][stockSymbol]["yes"].locked += quantity;
                data_1.INR_BALANCES[payload.userId].locked += payload.price * payload.quantity;
                data_1.INR_BALANCES[payload.userId].balance -=
                    payload.price * payload.quantity;
                await (0, sendbook_1.displayBook)(payload.stockSymbol, data_1.ORDERBOOK[payload.stockSymbol]);
                return {
                    success: true,
                    message: "ORDERBOOK",
                    data: data_1.ORDERBOOK[payload.stockSymbol],
                };
                // await redisClient.lPush(responseQueue, JSON.stringify(ORDERBOOK));
            }
            else {
                data_1.ORDERBOOK[payload.stockSymbol].yes[newPrice].orders[payload.userId] = {
                    quantity: payload.quantity,
                    type: "inverse",
                };
                data_1.ORDERBOOK[payload.stockSymbol].yes[newPrice].total += payload.quantity;
                data_1.INR_BALANCES[payload.userId].balance -=
                    payload.price * payload.quantity;
                data_1.INR_BALANCES[payload.userId].locked += payload.price * payload.quantity;
                console.log(data_1.ORDERBOOK);
                await (0, sendbook_1.displayBook)(payload.stockSymbol, data_1.ORDERBOOK[payload.stockSymbol]);
                return {
                    success: true,
                    message: "ORDERBOOK",
                    data: data_1.ORDERBOOK[payload.stockSymbol],
                };
            }
        }
        if (data_1.ORDERBOOK[payload.stockSymbol].no[payload.price].orders) {
            let totalAmount = payload.quantity;
            for (let user in data_1.ORDERBOOK[payload.stockSymbol].no[payload.price]
                .orders) {
                if (totalAmount <= 0)
                    break;
                let currentValue = data_1.ORDERBOOK[payload.stockSymbol].no[payload.price].orders[user]
                    .quantity;
                let subtraction = Math.min(totalAmount, currentValue);
                data_1.INR_BALANCES[user].balance += payload.price * subtraction;
                data_1.ORDERBOOK[payload.stockSymbol].no[payload.price].orders[user].quantity -= subtraction;
                totalAmount -= subtraction;
                if (!data_1.STOCK_BALANCES[payload.userId]) {
                    data_1.STOCK_BALANCES[payload.userId] = {};
                }
                if (!data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol]) {
                    data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol] = {
                        no: { locked: 0, quantity: 0 },
                    };
                }
                data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol]["no"].quantity +=
                    subtraction;
            }
            data_1.ORDERBOOK[payload.stockSymbol].no[payload.price].total -=
                payload.quantity - totalAmount;
            if (data_1.ORDERBOOK[payload.stockSymbol].no[payload.price].total == 0) {
                delete data_1.ORDERBOOK[payload.stockSymbol].no[payload.price];
            }
            data_1.INR_BALANCES[payload.userId].balance -= payload.price * payload.quantity;
        }
        else {
            data_1.INR_BALANCES[payload.userId].balance -= payload.price * payload.quantity;
            data_1.INR_BALANCES[payload.userId].locked += payload.price * payload.quantity;
        }
        await (0, sendbook_1.displayBook)(payload.stockSymbol, data_1.ORDERBOOK[payload.stockSymbol]);
        return {
            success: true,
            message: "ORDERBOOK",
            data: data_1.ORDERBOOK[payload.stockSymbol],
        };
    }
    catch (error) {
        return {
            error: error,
        };
    }
};
exports.buyNo = buyNo;
const sellYes = async (payload) => {
    console.log(payload, "this is mypayload");
    try {
        if (!payload.stockSymbol ||
            !payload.price ||
            !payload.userId ||
            !payload.quantity ||
            !payload.stockType) {
            return {
                success: false,
                message: "insufficient creds",
                data: {},
            };
        }
        if (!data_1.STOCK_BALANCES[payload.userId] ||
            !data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol] ||
            !data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol]["yes"]) {
            return {
                success: false,
                message: "no stocks available",
                data: {},
            };
        }
        if (data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol]["yes"].quantity <
            payload.quantity) {
            return {
                success: false,
                message: "user dont have enough stocks",
                data: {},
            };
        }
        data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol]["yes"].locked +=
            payload.quantity;
        data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol]["yes"].quantity -=
            payload.quantity;
        if (!data_1.ORDERBOOK[payload.stockSymbol]) {
            data_1.ORDERBOOK[payload.stockSymbol] = { yes: {}, no: {} };
        }
        if (!data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price]) {
            data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price] = {
                total: 0,
                orders: {},
            };
        }
        if (!data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price].orders[payload.userId]) {
            data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price].orders[payload.userId] =
                {
                    quantity: 0,
                    type: "normal",
                };
        }
        data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price].total += payload.quantity;
        data_1.ORDERBOOK[payload.stockSymbol].yes[payload.price].orders[payload.userId].quantity += payload.quantity;
        await (0, sendbook_1.displayBook)(payload.stockSymbol, data_1.ORDERBOOK[payload.stockSymbol]);
        return {
            success: true,
            message: "sold this stock",
            data: data_1.STOCK_BALANCES[payload.userId],
        };
    }
    catch (error) {
        return {
            error: error,
        };
    }
};
exports.sellYes = sellYes;
const sellNo = async (payload) => {
    try {
        if (!payload.stockSymbol ||
            !payload.price ||
            !payload.userId ||
            !payload.quantity ||
            !payload.stockType) {
            console.log("Insuffciient");
            return {
                success: false,
                message: "insufficient credentials",
                data: {},
            };
        }
        if (!data_1.STOCK_BALANCES[payload.userId] ||
            !data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol] ||
            !data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol]["no"]) {
            payload.stockSymbol;
            return {
                success: false,
                message: "no such stock available",
                data: {},
            };
        }
        if (data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol]["no"].quantity <
            payload.quantity) {
            return {
                success: true,
                message: "you dont have enough no stocks",
                data: {},
            };
        }
        data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol]["no"].locked +=
            payload.quantity;
        data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol]["no"].quantity -=
            payload.quantity;
        if (!data_1.ORDERBOOK[payload.stockSymbol]) {
            data_1.ORDERBOOK[payload.stockSymbol] = { yes: {}, no: {} };
        }
        if (!data_1.ORDERBOOK[payload.stockSymbol].no[payload.price]) {
            data_1.ORDERBOOK[payload.stockSymbol].no[payload.price] = {
                total: 0,
                orders: {},
            };
        }
        if (!data_1.ORDERBOOK[payload.stockSymbol].no[payload.price].orders[payload.userId]) {
            data_1.ORDERBOOK[payload.stockSymbol].no[payload.price].orders[payload.userId] =
                {
                    quantity: 0,
                    type: "normal",
                };
        }
        data_1.ORDERBOOK[payload.stockSymbol].no[payload.price].total += payload.quantity;
        data_1.ORDERBOOK[payload.stockSymbol].no[payload.price].orders[payload.userId].quantity += payload.quantity;
        data_1.ORDERBOOK[payload.stockSymbol].no[payload.price].orders[payload.userId].type = "normal";
        await (0, sendbook_1.displayBook)(payload.stockSymbol, data_1.ORDERBOOK[payload.stockSymbol]);
        return {
            success: true,
            message: "sold this stock",
            data: data_1.STOCK_BALANCES,
        };
    }
    catch (error) {
        return {
            error: error,
        };
    }
};
exports.sellNo = sellNo;
const mintStock = async (payload) => {
    try {
        // if (
        //   INR_BALANCES[payload.userId].balance <=
        //   payload.quantity * payload.price
        // ) {
        //   return {
        //     success: false,
        //     message: "insufficent balance",
        //     data: {},
        //   };
        // }
        if (!data_1.ORDERBOOK[payload.symbol]) {
            data_1.ORDERBOOK[payload.symbol] = {
                yes: {},
                no: {},
            };
        }
        if (!data_1.ORDERBOOK[payload.symbol].yes[5] || !data_1.ORDERBOOK[payload.symbol].no[5]) {
            data_1.ORDERBOOK[payload.symbol].yes[5] = { total: 0, orders: {} };
            data_1.ORDERBOOK[payload.symbol].no[5] = { total: 0, orders: {} };
        }
        data_1.ORDERBOOK[payload.symbol].yes[5].total += payload.quantity;
        data_1.ORDERBOOK[payload.symbol].no[5].total += payload.quantity;
        data_1.ORDERBOOK[payload.symbol].yes[5].orders = {
            [payload.userId]: {
                quantity: payload.quantity,
                type: "normal",
            },
        };
        data_1.ORDERBOOK[payload.symbol].no[5].orders = {
            [payload.userId]: {
                quantity: payload.quantity,
                type: "normal",
            },
        };
        if (!data_1.STOCK_BALANCES[payload.userId]) {
            data_1.STOCK_BALANCES[payload.userId] = {};
        }
        data_1.STOCK_BALANCES[payload.userId][payload.symbol] = {
            yes: {
                locked: 0,
                quantity: payload.quantity,
            },
            no: {
                locked: 0,
                quantity: payload.quantity,
            },
        };
        console.log("ndudhiei");
        await (0, sendbook_1.displayBook)(payload.symbol, data_1.ORDERBOOK[payload.symbol]);
        return {
            success: true,
            message: "minted this stock",
            data: data_1.ORDERBOOK[payload.symbol],
        };
    }
    catch (error) {
        return {
            error: error,
        };
    }
};
exports.mintStock = mintStock;
const reset = async (payload) => {
    try {
        Object.keys(data_1.STOCK_BALANCES).forEach((key) => delete data_1.STOCK_BALANCES[key]);
        Object.keys(data_1.INR_BALANCES).forEach((key) => delete data_1.INR_BALANCES[key]);
        Object.keys(data_1.ORDERBOOK).forEach((key) => delete data_1.ORDERBOOK[key]);
        console.log("deleted");
        return {
            success: true,
            message: "reset everything",
            data: data_1.ORDERBOOK,
        };
    }
    catch (error) {
        return {
            error: error,
        };
    }
};
exports.reset = reset;
