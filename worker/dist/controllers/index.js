"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyNoOrder = exports.buyYesOrder = void 0;
const data_1 = require("../data");
const sendbook_1 = require("../utils/sendbook");
const buyYesOrder = async (payload) => {
    var _a, _b;
    if (!payload.stockSymbol ||
        !payload.price ||
        !payload.quantity ||
        !payload.userId ||
        !payload.stockType) {
        return {
            success: false,
            message: "insufficient credentials",
            data: {},
        };
    }
    if (!data_1.ORDERBOOK[payload.stockSymbol]) {
        return {
            success: false,
            message: "doesnt contain the stocksymbol",
            data: {},
        };
    }
    console.log(payload.price);
    if (data_1.INR_BALANCES[payload.userId].balance <
        payload.price * payload.quantity) {
        return {
            success: false,
            message: "insufficientbalance",
            data: {},
        };
    }
    data_1.INR_BALANCES[payload.userId].balance -= payload.price * payload.quantity;
    data_1.INR_BALANCES[payload.userId].locked += payload.price * payload.quantity;
    let availableYesQuantity = 0;
    let availableNoQuantity = 0;
    const stockOrderBook = data_1.ORDERBOOK[payload.stockSymbol];
    if (stockOrderBook === null || stockOrderBook === void 0 ? void 0 : stockOrderBook.yes[payload.price]) {
        availableYesQuantity = stockOrderBook.yes[payload.price].total;
        availableNoQuantity = ((_a = stockOrderBook.no[1000 - payload.price]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    }
    let remainingQuantity = payload.quantity;
    if (availableYesQuantity > 0) {
        for (const user in stockOrderBook.yes[payload.price].orders) {
            if (remainingQuantity <= 0)
                break;
            const userOrder = stockOrderBook.yes[payload.price].orders[user];
            const orderAvailableQty = userOrder.quantity;
            const quantityToMatch = Math.min(orderAvailableQty, remainingQuantity);
            userOrder.quantity -= quantityToMatch;
            stockOrderBook.yes[payload.price].total -= quantityToMatch;
            remainingQuantity -= quantityToMatch;
            if (userOrder.type === "normal") {
                if (data_1.STOCK_BALANCES[user][payload.stockSymbol].yes) {
                    data_1.STOCK_BALANCES[user][payload.stockSymbol].yes.locked -=
                        quantityToMatch;
                    data_1.INR_BALANCES[user].balance += quantityToMatch * payload.price;
                }
            }
            else if (userOrder.type === "inverse") {
                if (data_1.STOCK_BALANCES[user][payload.stockSymbol].no) {
                    data_1.STOCK_BALANCES[user][payload.stockSymbol].no.quantity +=
                        quantityToMatch;
                    data_1.INR_BALANCES[user].locked -= quantityToMatch * payload.price;
                }
            }
            if (userOrder.quantity === 0) {
                delete stockOrderBook.yes[payload.price].orders[user];
            }
        }
        if (stockOrderBook.yes[payload.price].total === 0) {
            delete stockOrderBook.yes[payload.price];
        }
    }
    if (availableNoQuantity > 0 && stockOrderBook.no[10 - payload.price]) {
        for (const user in stockOrderBook.no[1000 - payload.price].orders) {
            if (remainingQuantity <= 0)
                break;
            const userOrder = stockOrderBook.no[1000 - payload.price].orders[user];
            const orderAvailableQty = userOrder.quantity;
            const quantityToMatch = Math.min(orderAvailableQty, remainingQuantity);
            userOrder.quantity -= quantityToMatch;
            stockOrderBook.no[1000 - payload.price].total -= quantityToMatch;
            remainingQuantity -= quantityToMatch;
            if (userOrder.type === "normal") {
                if (data_1.STOCK_BALANCES[user][payload.stockSymbol].no) {
                    data_1.STOCK_BALANCES[user][payload.stockSymbol].no.locked -=
                        quantityToMatch;
                    data_1.INR_BALANCES[user].balance +=
                        quantityToMatch * (1000 - payload.price);
                }
            }
            else if (userOrder.type === "inverse") {
                if (data_1.STOCK_BALANCES[user][payload.stockSymbol].yes) {
                    data_1.STOCK_BALANCES[user][payload.stockSymbol].yes.quantity +=
                        quantityToMatch;
                    data_1.INR_BALANCES[user].locked -= quantityToMatch * (1000 - payload.price);
                }
            }
            if (userOrder.quantity === 0) {
                delete stockOrderBook.no[1000 - payload.price].orders[user];
            }
        }
        if (stockOrderBook.no[1000 - payload.price].total === 0) {
            delete stockOrderBook.no[1000 - payload.price];
        }
    }
    if (remainingQuantity > 0) {
        const oppositePrice = 1000 - payload.price;
        if (!data_1.ORDERBOOK[payload.stockSymbol].no[oppositePrice]) {
            data_1.ORDERBOOK[payload.stockSymbol].no[oppositePrice] = {
                total: 0,
                orders: {},
            };
        }
        data_1.ORDERBOOK[payload.stockSymbol].no[oppositePrice].total += remainingQuantity;
        data_1.ORDERBOOK[payload.stockSymbol].no[oppositePrice].orders[payload.userId] = {
            type: "inverse",
            quantity: (((_b = data_1.ORDERBOOK[payload.stockSymbol].no[oppositePrice].orders[payload.userId]) === null || _b === void 0 ? void 0 : _b.quantity) || 0) + remainingQuantity,
        };
    }
    if (!data_1.STOCK_BALANCES[payload.userId]) {
        data_1.STOCK_BALANCES[payload.userId] = {};
    }
    if (!data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol]) {
        data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol] = {
            yes: { quantity: 0, locked: 0 },
            no: { quantity: 0, locked: 0 },
        };
    }
    if (data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol].yes) {
        data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol].yes.quantity +=
            payload.quantity - remainingQuantity;
    }
    data_1.INR_BALANCES[payload.userId].locked -=
        (payload.quantity - remainingQuantity) * payload.price;
    await (0, sendbook_1.displayBook)(payload.stockSymbol, data_1.ORDERBOOK[payload.stockSymbol]);
    return {
        success: true,
        message: "ORDERBOOK",
        data: data_1.ORDERBOOK[payload.stockSymbol],
    };
};
exports.buyYesOrder = buyYesOrder;
const buyNoOrder = async (payload) => {
    var _a, _b;
    if (!payload.stockSymbol ||
        !payload.price ||
        !payload.quantity ||
        !payload.userId ||
        !payload.stockType) {
        return {
            success: false,
            message: "insufficient credentials",
            data: {},
        };
    }
    if (!data_1.ORDERBOOK[payload.stockSymbol]) {
        return {
            success: false,
            message: "doesnt contain the stocksymbol",
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
    data_1.INR_BALANCES[payload.userId].balance -= payload.price * payload.quantity;
    data_1.INR_BALANCES[payload.userId].locked += payload.price * payload.quantity;
    let availableYesQuantity = 0;
    let availableNoQuantity = 0;
    const stockOrderBook = data_1.ORDERBOOK[payload.stockSymbol];
    if (stockOrderBook === null || stockOrderBook === void 0 ? void 0 : stockOrderBook.no[payload.price]) {
        availableNoQuantity = stockOrderBook.no[payload.price].total;
        availableYesQuantity = ((_a = stockOrderBook.yes[1000 - payload.price]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    }
    let remainingQuantity = payload.quantity;
    if (availableNoQuantity > 0) {
        for (const user in stockOrderBook.no[payload.price].orders) {
            if (remainingQuantity <= 0)
                break;
            const userOrder = stockOrderBook.no[payload.price].orders[user];
            const orderAvailableQty = userOrder.quantity;
            const quantityToMatch = Math.min(orderAvailableQty, remainingQuantity);
            userOrder.quantity -= quantityToMatch;
            stockOrderBook.no[payload.price].total -= quantityToMatch;
            remainingQuantity -= quantityToMatch;
            if (userOrder.type === "normal") {
                if (data_1.STOCK_BALANCES[user][payload.stockSymbol].no) {
                    data_1.STOCK_BALANCES[user][payload.stockSymbol].no.locked -=
                        quantityToMatch;
                    data_1.INR_BALANCES[user].balance += quantityToMatch * payload.price;
                }
            }
            else if (userOrder.type === "inverse") {
                if (data_1.STOCK_BALANCES[user][payload.stockSymbol].yes) {
                    data_1.STOCK_BALANCES[user][payload.stockSymbol].yes.quantity +=
                        quantityToMatch;
                    data_1.INR_BALANCES[user].locked -= quantityToMatch * payload.price;
                }
            }
            if (userOrder.quantity === 0) {
                delete stockOrderBook.no[payload.price].orders[user];
            }
        }
        if (stockOrderBook.no[payload.price].total === 0) {
            delete stockOrderBook.no[payload.price];
        }
    }
    if (availableYesQuantity > 0 && stockOrderBook.yes[1000 - payload.price]) {
        for (const user in stockOrderBook.yes[1000 - payload.price].orders) {
            if (remainingQuantity <= 0)
                break;
            const userOrder = stockOrderBook.yes[1000 - payload.price].orders[user];
            const orderAvailableQty = userOrder.quantity;
            const quantityToMatch = Math.min(orderAvailableQty, remainingQuantity);
            userOrder.quantity -= quantityToMatch;
            stockOrderBook.yes[1000 - payload.price].total -= quantityToMatch;
            remainingQuantity -= quantityToMatch;
            if (userOrder.type === "normal") {
                if (data_1.STOCK_BALANCES[user][payload.stockSymbol].yes) {
                    data_1.STOCK_BALANCES[user][payload.stockSymbol].yes.locked -=
                        quantityToMatch;
                    data_1.INR_BALANCES[user].balance +=
                        quantityToMatch * (1000 - payload.price);
                }
            }
            else if (userOrder.type === "inverse") {
                if (data_1.STOCK_BALANCES[user][payload.stockSymbol].no) {
                    data_1.STOCK_BALANCES[user][payload.stockSymbol].no.quantity +=
                        quantityToMatch;
                    data_1.INR_BALANCES[user].locked -= quantityToMatch * (1000 - payload.price);
                }
            }
            if (userOrder.quantity === 0) {
                delete stockOrderBook.yes[1000 - payload.price].orders[user];
            }
        }
        if (stockOrderBook.yes[1000 - payload.price].total === 0) {
            delete stockOrderBook.yes[1000 - payload.price];
        }
    }
    if (remainingQuantity > 0) {
        const oppositePrice = 1000 - payload.price;
        if (!data_1.ORDERBOOK[payload.stockSymbol].yes[oppositePrice]) {
            data_1.ORDERBOOK[payload.stockSymbol].yes[oppositePrice] = {
                total: 0,
                orders: {},
            };
        }
        data_1.ORDERBOOK[payload.stockSymbol].yes[oppositePrice].total +=
            remainingQuantity;
        data_1.ORDERBOOK[payload.stockSymbol].yes[oppositePrice].orders[payload.userId] = {
            type: "inverse",
            quantity: (((_b = data_1.ORDERBOOK[payload.stockSymbol].yes[oppositePrice].orders[payload.userId]) === null || _b === void 0 ? void 0 : _b.quantity) || 0) + remainingQuantity,
        };
    }
    if (!data_1.STOCK_BALANCES[payload.userId]) {
        data_1.STOCK_BALANCES[payload.userId] = {};
    }
    if (!data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol]) {
        data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol] = {
            yes: { quantity: 0, locked: 0 },
            no: { quantity: 0, locked: 0 },
        };
    }
    if (data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol].no) {
        data_1.STOCK_BALANCES[payload.userId][payload.stockSymbol].no.quantity +=
            payload.quantity - remainingQuantity;
    }
    data_1.INR_BALANCES[payload.userId].locked -=
        (payload.quantity - remainingQuantity) * payload.price;
    await (0, sendbook_1.displayBook)(payload.stockSymbol, data_1.ORDERBOOK[payload.stockSymbol]);
    return {
        success: true,
        message: "ORDERBOOK",
        data: data_1.ORDERBOOK[payload.stockSymbol],
    };
};
exports.buyNoOrder = buyNoOrder;
