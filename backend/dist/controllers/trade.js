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
exports.buy = exports.sell = void 0;
const proboController_1 = require("./proboController");
const sell = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stockType } = req.body;
    console.log(stockType, "avash neupande here");
    if (stockType === "yes") {
        return (0, proboController_1.sellYes)(req, res);
    }
    else if (stockType === "no") {
        return (0, proboController_1.sellNo)(req, res);
    }
    else {
        return res
            .status(400)
            .json({ error: 'Invalid option. Please provide "yes" or "no".' });
    }
});
exports.sell = sell;
const buy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stockType } = req.body;
    if (stockType === "yes") {
        return (0, proboController_1.buyYes)(req, res);
    }
    else if (stockType === "no") {
        return (0, proboController_1.buyNo)(req, res);
    }
    else {
        return res
            .status(400)
            .json({ error: 'Invalid option. Please provide "yes" or "no".' });
    }
});
exports.buy = buy;
