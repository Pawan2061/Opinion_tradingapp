export interface UserBalance {
  balance: number;
  locked: number;
}
export interface userWithBalance {
  [userId: string]: {
    balance: number;
    locked: number;
  };
}

export interface onrampedUser {
  userId: string;
  amount: number;
}

export interface Stock {
  [userId: string]: {
    [stockName: string]: {
      [outcome: string]: {
        quantity: number;
        locked: number;
      };
    };
  };
}

export interface OrderBook {
  [stockSymbol: string]: {
    yes: {
      [price: string]: {
        quantity: number;
        orders: {
          [userId: string]: number;
        };
      };
    };
    no: {
      [price: string]: {
        quantity: number;
        orders: {
          [userId: string]: number;
        };
      };
    };
  };
}
export interface OrderResponse {
  orderedStock: {
    total: number;
    orders: {
      [userId: string]: number;
    };
  };
}

export interface ErrorResponse {
  error: any;
}

export type ApiResponse = OrderResponse | ErrorResponse;

export type MINTED_STOCKS = {
  userId: string;
  stockSymbol: string;
  quantity: number;
  timeStamp: Date;
};
