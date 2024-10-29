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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriber = exports.redisClient = void 0;
const express_1 = __importDefault(require("express"));
const proboRoute_1 = require("./routes/proboRoute");
const redis_1 = require("redis");
exports.redisClient = (0, redis_1.createClient)();
exports.subscriber = (0, redis_1.createClient)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1", proboRoute_1.proboRouter);
function startRedisServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.redisClient.connect();
        yield exports.subscriber.connect();
        console.log("connected to redis");
        app.listen(3000, () => {
            console.log("server is running on port 3000");
        });
    });
}
startRedisServer();
