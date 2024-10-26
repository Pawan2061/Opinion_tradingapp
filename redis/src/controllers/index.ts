import { ORDERBOOK, STOCK_BALANCES, user_with_balances } from "../data";
import { displayBook } from "../utils/sendbook";

export const buyYesOrder = async (payload: any) => {
  if (
    !payload.stockSymbol ||
    !payload.price ||
    !payload.quantity ||
    !payload.userId ||
    !payload.stockType
  ) {
    return {
      success: false,
      message: "insufficient credentials",
      data: {},
    };
  }
  if (!ORDERBOOK[payload.stockSymbol]) {
    return {
      success: false,
      message: "doesnt contain the stocksymbol",
      data: {},
    };
  }

  if (
    user_with_balances[payload.userId]!.balance <
    payload.price * payload.quantity
  ) {
    return {
      success: false,
      message: "insufficientbalance",
      data: {},
    };
  }

  user_with_balances[payload.userId].balance -=
    payload.price * payload.quantity;
  user_with_balances[payload.userId].locked += payload.price * payload.quantity;

  let availableYesQuantity = 0;
  let availableNoQuantity = 0;

  const stockOrderBook = ORDERBOOK[payload.stockSymbol];
  if (stockOrderBook?.yes[payload.price]) {
    availableYesQuantity = stockOrderBook.yes[payload.price].total;
    availableNoQuantity = stockOrderBook.no[1000 - payload.price]?.total || 0;
  }

  console.log("Available 'Yes' Quantity:", availableYesQuantity);
  console.log("Available 'No' Quantity:", availableNoQuantity);

  let remainingQuantity = payload.quantity;

  if (availableYesQuantity > 0) {
    for (const user in stockOrderBook.yes[payload.price].orders) {
      if (remainingQuantity <= 0) break;

      const userOrder = stockOrderBook.yes[payload.price].orders[user];
      const orderAvailableQty = userOrder.quantity;
      const quantityToMatch = Math.min(orderAvailableQty, remainingQuantity);

      userOrder.quantity -= quantityToMatch;
      stockOrderBook.yes[payload.price].total -= quantityToMatch;

      console.log("Remaining Quantity Before:", remainingQuantity);
      remainingQuantity -= quantityToMatch;
      console.log("Remaining Quantity After:", remainingQuantity);

      if (userOrder.type === "normal") {
        if (STOCK_BALANCES[user][payload.stockSymbol].yes) {
          STOCK_BALANCES[user][payload.stockSymbol].yes.locked -=
            quantityToMatch;
          user_with_balances[user].balance += quantityToMatch * payload.price;
        }
      } else if (userOrder.type === "inverse") {
        if (STOCK_BALANCES[user][payload.stockSymbol].no) {
          STOCK_BALANCES[user][payload.stockSymbol].no.quantity +=
            quantityToMatch;
          user_with_balances[user].locked -= quantityToMatch * payload.price;
        }
      }

      if (userOrder.quantity === 0) {
        delete stockOrderBook.yes[payload.price].orders[user];
      }
    }

    if (stockOrderBook.yes[payload.price].total === 0) {
      delete stockOrderBook.yes[payload.price];
    }
  }

  if (availableNoQuantity > 0 && stockOrderBook.no[10 - payload.price]) {
    for (const user in stockOrderBook.no[1000 - payload.price].orders) {
      if (remainingQuantity <= 0) break;

      const userOrder = stockOrderBook.no[1000 - payload.price].orders[user];
      const orderAvailableQty = userOrder.quantity;
      const quantityToMatch = Math.min(orderAvailableQty, remainingQuantity);

      userOrder.quantity -= quantityToMatch;
      stockOrderBook.no[1000 - payload.price].total -= quantityToMatch;

      console.log("Remaining Quantity Before in 'No':", remainingQuantity);
      remainingQuantity -= quantityToMatch;
      console.log("Remaining Quantity After in 'No':", remainingQuantity);

      if (userOrder.type === "normal") {
        if (STOCK_BALANCES[user][payload.stockSymbol].no) {
          STOCK_BALANCES[user][payload.stockSymbol].no.locked -=
            quantityToMatch;
          user_with_balances[user].balance +=
            quantityToMatch * (1000 - payload.price);
        }
      } else if (userOrder.type === "inverse") {
        if (STOCK_BALANCES[user][payload.stockSymbol].yes) {
          STOCK_BALANCES[user][payload.stockSymbol].yes.quantity +=
            quantityToMatch;
          user_with_balances[user].locked -=
            quantityToMatch * (1000 - payload.price);
        }
      }

      if (userOrder.quantity === 0) {
        delete stockOrderBook.no[1000 - payload.price].orders[user];
      }
    }

    if (stockOrderBook.no[1000 - payload.price].total === 0) {
      delete stockOrderBook.no[1000 - payload.price];
    }
  }

  if (remainingQuantity > 0) {
    const oppositePrice = 1000 - payload.price;

    if (!ORDERBOOK[payload.stockSymbol].no[oppositePrice]) {
      ORDERBOOK[payload.stockSymbol].no[oppositePrice] = {
        total: 0,
        orders: {},
      };
    }

    ORDERBOOK[payload.stockSymbol].no[oppositePrice].total += remainingQuantity;
    ORDERBOOK[payload.stockSymbol].no[oppositePrice].orders[payload.userId] = {
      type: "inverse",
      quantity:
        (ORDERBOOK[payload.stockSymbol].no[oppositePrice].orders[payload.userId]
          ?.quantity || 0) + remainingQuantity,
    };
  }

  if (!STOCK_BALANCES[payload.userId]) {
    STOCK_BALANCES[payload.userId] = {};
  }
  if (!STOCK_BALANCES[payload.userId][payload.stockSymbol]) {
    STOCK_BALANCES[payload.userId][payload.stockSymbol] = {
      yes: { quantity: 0, locked: 0 },
      no: { quantity: 0, locked: 0 },
    };
  }

  if (STOCK_BALANCES[payload.userId][payload.stockSymbol].yes) {
    STOCK_BALANCES[payload.userId][payload.stockSymbol].yes.quantity +=
      payload.quantity - remainingQuantity;
  }

  user_with_balances[payload.userId].locked -=
    (payload.quantity - remainingQuantity) * payload.price;

  await displayBook(payload.stockSymbol, ORDERBOOK[payload.stockSymbol]);

  return {
    success: true,
    message: "ORDERBOOK",
    data: ORDERBOOK[payload.stockSymbol],
  };
};

export const buyNoOrder = async (payload: any) => {
  if (
    !payload.stockSymbol ||
    !payload.price ||
    !payload.quantity ||
    !payload.userId ||
    !payload.stockType
  ) {
    return {
      success: false,
      message: "insufficient credentials",
      data: {},
    };
  }
  if (!ORDERBOOK[payload.stockSymbol]) {
    return {
      success: false,
      message: "doesnt contain the stocksymbol",
      data: {},
    };
  }

  if (
    user_with_balances[payload.userId]!.balance <
    payload.price * payload.quantity
  ) {
    return {
      success: false,
      message: "insufficientbalance",
      data: {},
    };
  }

  user_with_balances[payload.userId].balance -=
    payload.price * payload.quantity;
  user_with_balances[payload.userId].locked += payload.price * payload.quantity;

  let availableYesQuantity = 0;
  let availableNoQuantity = 0;

  const stockOrderBook = ORDERBOOK[payload.stockSymbol];
  if (stockOrderBook?.no[payload.price]) {
    availableNoQuantity = stockOrderBook.no[payload.price].total;
    availableYesQuantity = stockOrderBook.yes[1000 - payload.price]?.total || 0;
  }

  console.log("Available 'Yes' Quantity:", availableYesQuantity);
  console.log("Available 'No' Quantity:", availableNoQuantity);

  let remainingQuantity = payload.quantity;

  if (availableNoQuantity > 0) {
    for (const user in stockOrderBook.no[payload.price].orders) {
      if (remainingQuantity <= 0) break;

      const userOrder = stockOrderBook.no[payload.price].orders[user];
      const orderAvailableQty = userOrder.quantity;
      const quantityToMatch = Math.min(orderAvailableQty, remainingQuantity);

      userOrder.quantity -= quantityToMatch;
      stockOrderBook.no[payload.price].total -= quantityToMatch;

      console.log("Remaining Quantity Before:", remainingQuantity);
      remainingQuantity -= quantityToMatch;
      console.log("Remaining Quantity After:", remainingQuantity);

      if (userOrder.type === "normal") {
        if (STOCK_BALANCES[user][payload.stockSymbol].no) {
          STOCK_BALANCES[user][payload.stockSymbol].no.locked -=
            quantityToMatch;
          user_with_balances[user].balance += quantityToMatch * payload.price;
        }
      } else if (userOrder.type === "inverse") {
        if (STOCK_BALANCES[user][payload.stockSymbol].yes) {
          STOCK_BALANCES[user][payload.stockSymbol].yes.quantity +=
            quantityToMatch;
          user_with_balances[user].locked -= quantityToMatch * payload.price;
        }
      }

      if (userOrder.quantity === 0) {
        delete stockOrderBook.no[payload.price].orders[user];
      }
    }

    if (stockOrderBook.no[payload.price].total === 0) {
      delete stockOrderBook.no[payload.price];
    }
  }

  if (availableYesQuantity > 0 && stockOrderBook.yes[1000 - payload.price]) {
    for (const user in stockOrderBook.yes[1000 - payload.price].orders) {
      if (remainingQuantity <= 0) break;

      const userOrder = stockOrderBook.yes[1000 - payload.price].orders[user];
      const orderAvailableQty = userOrder.quantity;
      const quantityToMatch = Math.min(orderAvailableQty, remainingQuantity);

      userOrder.quantity -= quantityToMatch;
      stockOrderBook.yes[1000 - payload.price].total -= quantityToMatch;

      console.log("Remaining Quantity Before in 'Yes':", remainingQuantity);
      remainingQuantity -= quantityToMatch;
      console.log("Remaining Quantity After in 'Yes':", remainingQuantity);

      if (userOrder.type === "normal") {
        if (STOCK_BALANCES[user][payload.stockSymbol].yes) {
          STOCK_BALANCES[user][payload.stockSymbol].yes.locked -=
            quantityToMatch;
          user_with_balances[user].balance +=
            quantityToMatch * (1000 - payload.price);
        }
      } else if (userOrder.type === "inverse") {
        if (STOCK_BALANCES[user][payload.stockSymbol].no) {
          STOCK_BALANCES[user][payload.stockSymbol].no.quantity +=
            quantityToMatch;
          user_with_balances[user].locked -=
            quantityToMatch * (1000 - payload.price);
        }
      }

      if (userOrder.quantity === 0) {
        delete stockOrderBook.yes[1000 - payload.price].orders[user];
      }
    }

    if (stockOrderBook.yes[1000 - payload.price].total === 0) {
      delete stockOrderBook.yes[1000 - payload.price];
    }
  }

  if (remainingQuantity > 0) {
    const oppositePrice = 1000 - payload.price;

    if (!ORDERBOOK[payload.stockSymbol].yes[oppositePrice]) {
      ORDERBOOK[payload.stockSymbol].yes[oppositePrice] = {
        total: 0,
        orders: {},
      };
    }

    ORDERBOOK[payload.stockSymbol].yes[oppositePrice].total +=
      remainingQuantity;
    ORDERBOOK[payload.stockSymbol].yes[oppositePrice].orders[payload.userId] = {
      type: "inverse",
      quantity:
        (ORDERBOOK[payload.stockSymbol].yes[oppositePrice].orders[
          payload.userId
        ]?.quantity || 0) + remainingQuantity,
    };
  }

  if (!STOCK_BALANCES[payload.userId]) {
    STOCK_BALANCES[payload.userId] = {};
  }
  if (!STOCK_BALANCES[payload.userId][payload.stockSymbol]) {
    STOCK_BALANCES[payload.userId][payload.stockSymbol] = {
      yes: { quantity: 0, locked: 0 },
      no: { quantity: 0, locked: 0 },
    };
  }

  if (STOCK_BALANCES[payload.userId][payload.stockSymbol].no) {
    STOCK_BALANCES[payload.userId][payload.stockSymbol].no.quantity +=
      payload.quantity - remainingQuantity;
  }

  user_with_balances[payload.userId].locked -=
    (payload.quantity - remainingQuantity) * payload.price;

  await displayBook(payload.stockSymbol, ORDERBOOK[payload.stockSymbol]);

  return {
    success: true,
    message: "ORDERBOOK",
    data: ORDERBOOK[payload.stockSymbol],
  };
};
