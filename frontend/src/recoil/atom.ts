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

export const authState = atom({
  key: "authstate",
  default: null,
});

export const authSelector = selector({
  key: "authselector",
  get: ({ get }) => {
    const user = get(authState);
    if (!user) {
      return null;
    }
    return {
      username: user,
    };
  },
});
