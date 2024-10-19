import {
  buyNo,
  buyYes,
  createSymbol,
  getBalanceStock,
  getOrderbooks,
  getStocks,
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
      console.log("done");

      data = await createUser(request.payload);
      break;

    case "createSymbol":
      console.log("done");

      data = await createSymbol(request.payload);
      break;

    case "onRamp":
      console.log("done");
      data = await onRampUser(request.payload);
      break;

    case "getBalance":
      console.log("done");

      data = await getBalances(request.payload);
      break;

    case "getUserBalance":
      console.log("done");

      data = await getUserBalance(request.payload);
      break;

    case "getOrderbooks":
      data = await getOrderbooks(request.payload);
      break;

    case "viewOrderbook":
      console.log("done");

      data = await viewOrderbook(request.payload);
      break;

    case "getStocks":
      console.log("done");

      data = await getStocks(request.payload);
      break;

    case "getBalanceStock":
      console.log("done");

      data = await getBalanceStock(request.payload);
      break;

    case "buyYes":
      console.log("done");

      data = await buyYes(request.payload);
      break;

    case "buyNo":
      console.log("success");

      data = await buyNo(request.payload);
      break;
    case "sellyes":
      data = await sellYes(request.payload);
      break;

    default:
      console.log(`Unknown method: ${request.method}`);
      return;
  }

  await pubsubManager.sendOutput(request.id, data);
};
