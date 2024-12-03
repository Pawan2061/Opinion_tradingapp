export interface userState {
  userId: string;
  balance: number;
  stock: UserStockBalance;
}

export interface stock {
  quantity: string;
  locked: string;
}

export interface UserStockBalance {
  [contact: string]: {
    yes?: stock;
    no?: stock;
  };
}