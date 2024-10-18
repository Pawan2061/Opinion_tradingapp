import {
  MINTED_STOCKS,
  onrampedUser,
  OrderBook,
  Stock,
  userWithBalance,
} from "../interface";

export const user_with_balances: userWithBalance = {
  //   user1: {
  //     balance: 10000,
  //     locked: 0,
  //   },
  //   user2: {
  //     balance: 200,
  //     locked: 0,
  //   },
  //   user5: {
  //     balance: 25000,
  //     locked: 0,
  //   },
};

export const rampedUsers: onrampedUser[] = [];

export const ORDERBOOK: OrderBook = {
  // BTC_USDT_10_Oct_2024_9_30: {
  //   yes: {
  //     "9.5": {
  //       quantity: 12,
  //       orders: {
  //         user1: {
  //           quantity: 2,
  //           type: "normal ",
  //         },
  //         user2: {
  //           quantity: 10,
  //           type: "normal ",
  //         },
  //       },
  //     },
  //     "8.5": {
  //       quantity: 12,
  //       orders: {
  //         user1: {
  //           quantity: 3,
  //           type: "normal ",
  //         },
  //         user2: {
  //           quantity: 3,
  //           type: "normal ",
  //         },
  //         user5: {
  //           quantity: 6,
  //           type: "normal ",
  //         },
  //       },
  //     },
  //   },
  //   no: {
  //     "3": {
  //       quantity: 12,
  //       orders: {
  //         user1: {
  //           quantity: 3,
  //           type: "normal ",
  //         },
  //         user2: {
  //           quantity: 3,
  //           type: "inverse",
  //         },
  //         user5: {
  //           quantity: 6,
  //           type: "normal ",
  //         },
  //       },
  //     },
  //   },
  // },
};

export const STOCK_BALANCES: Stock = {
  // user1: {
  //   BTC_USDT_10_Oct_2024_9_30: {
  //     yes: {
  //       quantity: 10,
  //       locked: 8,
  //     },
  //     no: {
  //       quantity: 10,
  //       locked: 8,
  //     },
  //   },
  // },
  // user2: {
  //   BTC_USDT_10_Oct_2024_9_30: {
  //     no: {
  //       quantity: 10,
  //       locked: 8,
  //     },
  //     yes: {
  //       quantity: 3,
  //       locked: 4,
  //     },
  //   },
  // },
};
