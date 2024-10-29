"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRequests = void 0;
const controllers_1 = require("../controllers");
const stockControl_1 = require("../controllers/stockControl");
const userController_1 = require("../controllers/userController");
const pubsub_1 = require("../pubsub");
const processRequests = async (request) => {
    console.log("im outside");
    console.log(request);
    console.log(request.payload);
    console.log(request.method);
    let data;
    switch (request.method) {
        case "createUser":
            data = await (0, userController_1.createUser)(request.payload);
            break;
        case "createSymbol":
            data = await (0, stockControl_1.createSymbol)(request.payload);
            break;
        case "onRamp":
            data = await (0, userController_1.onRampUser)(request.payload);
            break;
        case "getBalance":
            data = await (0, userController_1.getBalances)(request.payload);
            break;
        case "getUserBalance":
            data = await (0, userController_1.getUserBalance)(request.payload);
            break;
        case "getOrderbooks":
            data = await (0, stockControl_1.getOrderbooks)(request.payload);
            break;
        case "viewOrderbook":
            data = await (0, stockControl_1.viewOrderbook)(request.payload);
            break;
        case "getStocks":
            data = await (0, stockControl_1.getStocks)(request.payload);
            break;
        case "getBalanceStock":
            data = await (0, stockControl_1.getBalanceStock)(request.payload);
            break;
        case "buyYes":
            data = await (0, controllers_1.buyYesOrder)(request.payload);
            break;
        case "buyNo":
            data = await (0, controllers_1.buyNoOrder)(request.payload);
            break;
        case "sellyes":
            data = await (0, stockControl_1.sellYes)(request.payload);
            break;
        case "sellNo":
            data = await (0, stockControl_1.sellNo)(request.payload);
            break;
        case "mintStock":
            data = await (0, stockControl_1.mintStock)(request.payload);
            break;
        case "reset":
            data = await (0, stockControl_1.reset)(request.payload);
            break;
        default:
            console.log(`Unknown method: ${request.method}`);
            return;
    }
    await pubsub_1.pubsubManager.sendOutput(request.id, data);
};
exports.processRequests = processRequests;
