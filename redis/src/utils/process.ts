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

  let data;

  switch (request.method) {
    case "createUser":
      data = await createUser(request.payload);
      break;

    case "createSymbol":
      data = await createSymbol(request.payload);
      break;

    case "onRamp":
      data = await onRampUser(request.payload);
      break;

    case "getBalance":
      data = await getBalances(request.payload);
      break;

    case "getUserBalance":
      data = await getUserBalance(request.payload);
      break;

    case "getOrderbooks":
      data = await getOrderbooks(request.payload);
      console.log(request.id, "sargam here");
      break;

    case "viewOrderbook":
      data = await viewOrderbook(request.payload);
      break;

    case "getStocks":
      data = await getStocks(request.payload);
      break;

    case "getBalanceStock":
      data = await getBalanceStock(request.payload);
      break;

    case "buyYes":
      console.log(request.payload, " the payload is here");
      data = await buyYes(request.payload);
      break;

    case "buyNo":
      console.log(request.payload, " the payload is here");
      data = await buyNo(request.payload);
      break;

    default:
      console.log(`Unknown method: ${request.method}`);
      return;
  }

  await pubsubManager.sendOutput(request.id, data);
};
