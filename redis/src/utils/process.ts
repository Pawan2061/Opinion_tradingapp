import {
  buyNo,
  buyYes,
  createSymbol,
  getBalanceStock,
  getOrderbooks,
  getStocks,
  viewOrderbook,
} from "../controllers/stockControl";
import {
  createUser,
  getBalances,
  getUserBalance,
  onRampUser,
} from "../controllers/userController";
import { queueRequest } from "../interface/request";
import { pubsubManager, PubSubManager } from "../pubsub";

export const processRequests = async (request: any) => {
  console.log("im outside");
  console.log(request);
  console.log(request.payload);

  console.log(request.method);

  if (request.method === "createUser") {
    console.log();

    const data = await createUser(request.payload);
    console.log(request.id, "dipenbro");

    await pubsubManager.sendOutput(request.id, data);
  }

  if (request.method === "createSymbol") {
    const data = await createSymbol(request.payload);

    await pubsubManager.sendOutput(request.id, data);
  }

  if (request.method === "onRamp") {
    const data = await onRampUser(request.payload);
    await pubsubManager.sendOutput(request.id, data);
  }

  if (request.method === "getBalance") {
    const data = await getBalances(request.payload);
    await pubsubManager.sendOutput(request.id, data);
  }
  if (request.method === "getUserBalance") {
    const data = await getUserBalance(request.payload);
    await pubsubManager.sendOutput(request.id, data);
  }
  if (request.method === "getOrderbooks") {
    const data = await getOrderbooks(request.payload);
    console.log(request.id, "sargam here");

    await pubsubManager.sendOutput(request.id, data);
  }
  if (request.method === "viewOrderbook") {
    const data = await viewOrderbook(request.payload);
    await pubsubManager.sendOutput(request.id, data);
  }
  if (request.method === "getStocks") {
    const data = await getStocks(request.payload);
    await pubsubManager.sendOutput(request.id, data);
  }
  if (request.method === "getBalanceStock") {
    const data = await getBalanceStock(request.payload);
    await pubsubManager.sendOutput(request.id, data);
  }
  if (request.method === "buyYes") {
    console.log(request.payload, " the payload is here");

    const data = await buyYes(request.payload);
    await pubsubManager.sendOutput(request.id, data);
  }
  if (request.method === "buyNo") {
    console.log(request.payload, " the payload is here");

    const data = await buyNo(request.payload);
    await pubsubManager.sendOutput(request.id, data);
  }
};
