import { atom, DefaultValue, selector } from "recoil";
import { userState } from "../interface/types";

export const userBalanceState = atom<userState>({
  key: "users",
  default: {
    userId: "",
    balance: 0,
    stock: {},
  },
});

export const balanceSelector = selector<number>({
  key: "userbalance",
  get: ({ get }) => {
    const user = get(userBalanceState);
    return user.balance;
  },
  set: ({ get, set }, newBalance) => {
    if (!(newBalance instanceof DefaultValue)) {
      const user = get(userBalanceState);
      set(userBalanceState, {
        ...user,
        balance: newBalance,
      });
    }
  },
});

export const stockSelector = selector({
  key: "userStock",
  get: ({ get }) => {
    const user = get(userBalanceState);
    return user.stock;
  },
});

export const userIdSelector = selector<string>({
  key: "userId",
  get: ({ get }) => {
    const user = get(userBalanceState);
    return user.userId;
  },

  set: ({ get, set }, userId) => {
    if (!(userId instanceof DefaultValue)) {
      const user = get(userBalanceState);
      set(userBalanceState, {
        ...user,
        userId: userId,
      });
    }
  },
});

export const authState = atom<string | null>({
  key: "authstate",
  default: null,
});

export const authSelector = selector<{ user: string } | null>({
  key: "authselector",
  get: ({ get }) => {
    const user = get(authState);
    if (!user) {
      return null;
    }
    return {
      user,
    };
  },
});

export const orderBookAtom = atom({
  key: "orderBookAtom",
  default: [
    {
      name: "BTC_USDT_10_Oct_2024_9_30",
      orders: {
        yes: [
          {
            price: 9.5,
            quantity: 12,
            orders: [
              { user: "user1", quantity: 2, type: "normal" },
              { user: "user2", quantity: 10, type: "normal" },
            ],
          },
          {
            price: 8.5,
            quantity: 12,
            orders: [
              { user: "user1", quantity: 3, type: "normal" },
              { user: "user2", quantity: 3, type: "normal" },
              { user: "user5", quantity: 6, type: "normal" },
            ],
          },
        ],
        no: [
          {
            price: 3,
            quantity: 12,
            orders: [
              { user: "user1", quantity: 3, type: "normal" },
              { user: "user2", quantity: 3, type: "inverse" },
              { user: "user5", quantity: 6, type: "normal" },
            ],
          },
        ],
      },
    },
    {
      name: "ETH_USDT_10_Oct_2024_9_30",
      orders: {
        yes: [
          {
            price: 7.5,
            quantity: 8,
            orders: [
              { user: "user3", quantity: 4, type: "normal" },
              { user: "user4", quantity: 4, type: "normal" },
            ],
          },
        ],
        no: [
          {
            price: 4,
            quantity: 5,
            orders: [
              { user: "user3", quantity: 2, type: "normal" },
              { user: "user4", quantity: 3, type: "inverse" },
            ],
          },
        ],
      },
    },
    {
      name: "LTC_USDT_10_Oct_2024_9_30",
      orders: {
        yes: [
          {
            price: 5.5,
            quantity: 10,
            orders: [
              { user: "user6", quantity: 5, type: "normal" },
              { user: "user7", quantity: 5, type: "normal" },
            ],
          },
        ],
        no: [
          {
            price: 2,
            quantity: 6,
            orders: [
              { user: "user6", quantity: 2, type: "normal" },
              { user: "user7", quantity: 4, type: "inverse" },
            ],
          },
        ],
      },
    },
  ],
});

export const orderbookName = selector({
  key: "orderbookName",
  get: ({ get }) => {
    const orderBook = get(orderBookAtom);
    return Object.keys(orderBook)[0];
  },
});

export const orderbookCount = selector({
  key: "orderbookNo",
  get: ({ get }) => {
    const orderBook = get(orderBookAtom);
    return Object.keys(orderBook).length;
  },
});
