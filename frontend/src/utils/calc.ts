import { AuthPayload } from "../interface/types";
import axios from "axios";

interface StockData {
  price: number;
  quantity: number;
}
interface OrderData {
  total: number;
  orders: {
    [buyer: string]: {
      normal: number;
      inverse: number;
    };
  };
}
interface WsData {
  yes: StockData[];
  no: StockData[];
}

interface payload {
  yes: { [price: string]: OrderData };
  no: { [price: string]: OrderData };
}
export function transform(data: payload): WsData {
  const parse = JSON.parse(data as any);
  console.log("type of ", typeof parse);

  const yesData = JSON.parse(data as any).yes as any;
  console.log(yesData, "yes data is here");

  console.log(JSON.parse(data as any).yes, "data.yes in transform");
  console.log(data, "data.no in transform");

  const wsData: WsData = {
    yes: [],
    no: [],
  };
  console.log(parse.yes, "wow");

  Object.entries(parse.yes).forEach(([price, orderData]: any) => {
    wsData.yes!.push({
      price: parseFloat(price),
      quantity: orderData.total,
    });
  });

  Object.entries(parse.no).forEach(([price, orderData]: any) => {
    wsData.no!.push({
      price: parseFloat(price),
      quantity: orderData.total,
    });
  });
  console.log(wsData, "data to be displayed is here");

  return wsData;
}

export async function hanldeAuth(data: AuthPayload) {
  try {
    const response = await axios.post("http://localhost:3000/auth", data);
    console.log(response, "response here");

    return response.data;
  } catch (error) {
    return "auth failed";
  }
}
