import {
  buyNo,
  buyYes,
  createSymbol,
  getBalanceStock,
  getOrderbooks,
  getStocks,
  mintStock,
  reset,
  sellNo,
  sellYes,
  viewOrderbook,
} from "../controllers/stockControl";
import {
  createUser,
  getBalances,
  getUserBalance,
  onRampUser,
} from "../controllers/userController";
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
      data = await buyYes(request.payload);
      break;

    case "buyNo":
      data = await buyNo(request.payload);
      break;
    case "sellyes":
      data = await sellYes(request.payload);
      break;

    case "sellNo":
      data = await sellNo(request.payload);
      break;

    case "mintStock":
      data = await mintStock(request.payload);
      break;

    case "reset":
      data = await reset(request.payload);
      break;

    default:
      console.log(`Unknown method: ${request.method}`);
      return;
  }

  await pubsubManager.sendOutput(request.id, data);
};
