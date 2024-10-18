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

export const processRequests = async (request: any) => {
  console.log("im outside");
  console.log(request);
  console.log(request.payload);

  console.log(request.method);

  if (request.method === "createUser") {
    console.log("im inside");

    await createUser(request.payload);
  }

  if (request.method === "createSymbol") {
    await createSymbol(request.payload);
  }

  if (request.method === "onRamp") {
    await onRampUser(request.payload);
  }

  if (request.method === "getBalance") {
    await getBalances(request.payload);
  }
  if (request.method === "getUserBalance") {
    await getUserBalance(request.payload);
  }
  if (request.method === "getOrderbooks") {
    await getOrderbooks(request.payload);
  }
  if (request.method === "viewOrderbook") {
    await viewOrderbook(request.payload);
  }
  if (request.method === "getStocks") {
    await getStocks(request.payload);
  }
  if (request.method === "getBalanceStock") {
    await getBalanceStock(request.payload);
  }
  if (request.method === "buyYes") {
    console.log(request.payload, " the payload is here");

    await buyYes(request.payload);
  }
  if (request.method === "buyNo") {
    console.log(request.payload, " the payload is here");

    await buyNo(request.payload);
  }
};
