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
  yes?: StockData[];
  no?: StockData[];
}

interface payload {
  yes: { [price: string]: OrderData };
  no: { [price: string]: OrderData };
}
export function transform(data: payload): WsData {
  const wsData: WsData = {
    yes: [],
    no: [],
  };

  if (!data) {
    return wsData;
  }

  if (Object.keys(data.yes).length > 0) {
    Object.entries(data.yes).forEach(([price, orderData]) => {
      wsData.yes!.push({
        price: parseInt(price),
        quantity: orderData.total,
      });
    });
  }

  if (Object.keys(data.no).length > 0) {
    Object.entries(data.no).forEach(([price, orderData]) => {
      wsData.no!.push({
        price: parseInt(price),
        quantity: orderData.total,
      });
    });
  }

  return wsData;
}
