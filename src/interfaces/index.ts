export interface UserBalance {
  balance: number;
  locked: number;
}
export interface userWithBalance {
  [userId: string]: UserBalance;
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
