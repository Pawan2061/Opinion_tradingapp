"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBalance = exports.getBalances = exports.onRampUser = exports.createUser = void 0;
const data_1 = require("../data");
const createUser = async (userId) => {
    try {
        if (!userId) {
            return {
                success: false,
                message: "user isnt  available",
                data: {},
            };
        }
        data_1.INR_BALANCES[userId] = {
            balance: 0,
            locked: 0,
        };
        return {
            success: true,
            message: "user created successfully",
            data: data_1.INR_BALANCES[userId],
        };
    }
    catch (error) {
        console.log(error);
        return {
            error: error,
        };
    }
};
exports.createUser = createUser;
const onRampUser = async (payload) => {
    try {
        if (!payload.userId || !payload.amount) {
            return {
                success: false,
                message: "Insufficient credentials: userId and amount are required.",
            };
        }
        if (!data_1.INR_BALANCES[payload.userId]) {
            const newUser = (data_1.INR_BALANCES[payload.userId] = {
                balance: payload.amount,
                locked: 0,
            });
            return {
                success: true,
                message: "New user created and balance updated.",
                data: data_1.INR_BALANCES[payload.userId],
            };
        }
        data_1.INR_BALANCES[payload.userId].balance += payload.amount;
        return {
            success: true,
            message: "Balance updated successfully.",
            data: data_1.INR_BALANCES[payload.userId],
        };
    }
    catch (error) {
        return {
            success: false,
            message: "An error occurred during onRamp operation.",
            error: error,
        };
    }
};
exports.onRampUser = onRampUser;
const getBalances = async (payload) => {
    try {
        const userBalances = data_1.INR_BALANCES;
        if (!userBalances) {
            console.log("error");
            return {
                success: false,
                message: "no balances found",
                data: userBalances,
            };
        }
        return {
            success: true,
            message: "User balances:",
            data: userBalances,
        };
    }
    catch (error) {
        return {
            error: error,
        };
    }
};
exports.getBalances = getBalances;
const getUserBalance = async (payload) => {
    try {
        const user = data_1.INR_BALANCES[payload];
        if (user) {
            return {
                success: true,
                message: "Userbalance",
                data: user,
            };
        }
        else {
            return {
                success: false,
                message: "user not found",
                data: {},
            };
        }
    }
    catch (error) {
        return {
            error: error,
        };
    }
};
exports.getUserBalance = getUserBalance;
