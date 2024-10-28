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
    [stockSymbol: string]: {
      [outcome: string]: {
        quantity: number;
        locked: number;
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
  price: number;
};

export interface orderType {
  type: "normal " | "inverse";
  quantity: number;
}
export interface OrderBook {
  [stockSymbol: string]: {
    yes: {
      [price: number]: {
        quantity: number;
        orders: {
          [userId: string]: orderType;
        };
      };
    };
    no: {
      [price: number]: {
        quantity: number;
        orders: {
          [userId: string]: orderType;
        };
      };
    };
  };
}

export interface Apiresponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
