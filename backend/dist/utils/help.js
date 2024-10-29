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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = exports.handleResponses = exports.handlePubSub = void 0;
const app_1 = require("../app");
const handlePubSub = (uid) => {
    const time = 5000;
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            app_1.subscriber.unsubscribe(uid), reject(new Error("timeout"));
        }, 5000);
        app_1.subscriber.subscribe(uid, (data) => {
            resolve(data);
        });
    });
};
exports.handlePubSub = handlePubSub;
const handleResponses = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = data;
        console.log(message);
        console.log(data.message, data.success);
        if (data.success === true) {
            console.log("succeed", data);
            return {
                statusId: 200,
                message: data.message,
                data: data.data,
            };
        }
        else {
            console.log("failed", data);
            return {
                statusId: 400,
                message: data.message,
                data: data.data,
            };
        }
    }
    catch (error) {
        return {
            statusId: 500,
            message: "An internal error occurred",
            error: error,
        };
    }
});
exports.handleResponses = handleResponses;
const sendResponse = (res, payload) => {
    try {
        console.log(payload);
        const _a = JSON.parse(payload), { success } = _a, data = __rest(_a, ["success"]);
        console.log(success);
        console.log(data);
        console.log("im here");
        if (!success) {
            res.status(400).json(data);
        }
        else {
            console.log("not here");
            console.log(data.data);
            res.status(200).send(data.data);
        }
    }
    catch (err) {
        res.status(500).json({ error: "Invalid response from server" });
    }
};
exports.sendResponse = sendResponse;
