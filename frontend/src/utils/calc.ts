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
  // const yesData = JSON.parse(data as any).yes as any;
  console.log(JSON.parse(data as any).yes, "data.yes in transform");
  console.log(data?.no, "data.no in transform");

  const wsData: WsData = {
    yes: [],
    no: [],
  };

  Object.entries(data.yes).forEach(([price, orderData]) => {
    wsData.yes!.push({
      price: parseFloat(price),
      quantity: orderData.total,
    });
  });

  Object.entries(data.no).forEach(([price, orderData]) => {
    wsData.no!.push({
      price: parseFloat(price),
      quantity: orderData.total,
    });
  });

  return wsData;
}
