import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TradeButton } from "./ui/TradeButton";
import axios from "axios";
import { API_BASE_URL } from "../utils/calc";
import { useRecoilValue } from "recoil";
import { orderBookAtom } from "../recoil/atom";

type TradeAction = "buy" | "sell";
type TradeOutcome = "yes" | "no";

type TradeConfiguration = {
  action: TradeAction;
  outcome: TradeOutcome;
  text: string;
  priceDefault: number;
};

export const Trade = () => {
  const [selectedAction, setSelectedAction] = useState<TradeAction>("buy");
  const [selectedOutcome, setSelectedOutcome] = useState<TradeOutcome>("yes");
  const [price, setPrice] = useState<number>(150);
  const [quantity, setQuantity] = useState<number>(60);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const tradeConfigurations: TradeConfiguration[] = [
    {
      action: "buy",
      outcome: "yes",
      text: "Buy Yes",
      priceDefault: 2,
    },
    {
      action: "buy",
      outcome: "no",
      text: "Buy No",
      priceDefault: 3,
    },
    {
      action: "sell",
      outcome: "yes",
      text: "Sell Yes",
      priceDefault: 4,
    },
    {
      action: "sell",
      outcome: "no",
      text: "Sell No",
      priceDefault: 5,
    },
  ];

  const orderBook = useRecoilValue(orderBookAtom);

  const handleTradeSelection = (
    action: TradeAction,
    outcome: TradeOutcome,
    defaultPrice: number
  ) => {
    setSelectedAction(action);
    setSelectedOutcome(outcome);
    setPrice(defaultPrice);
  };

  const handlePlaceOrder = async () => {
    const currentOrder = getCurrentOrder();
    const orderPayload = {
      userId: "user1",
      stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
      quantity: quantity,
      price: currentOrder ? currentOrder.price : price,
      stockType: selectedOutcome,
      action: selectedAction,
    };

    try {
      setLoading(true);
      setError(null);

      const endpoint =
        selectedAction === "buy"
          ? API_BASE_URL + "/api/v1/order/buy"
          : API_BASE_URL + "/api/v1/order/sell";

      const response = await axios.post(endpoint, orderPayload);

      console.log("Order placed successfully:", response.data);
    } catch (err) {
      console.error("Error placing order:", err);
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentOrder = () => {
    const currentOrder = orderBook.find(
      (order) => order.name === "BTC_USDT_10_Oct_2024_9_30"
    );
    if (currentOrder) {
      const orders = currentOrder.orders[selectedOutcome];
      return orders.length > 0 ? orders[0] : null;
    }
    return null;
  };

  const currentOrder = getCurrentOrder();

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-2 gap-2 mb-4">
        {tradeConfigurations.map((config) => (
          <TradeButton
            key={`${config.action}-${config.outcome}`}
            type={config.text}
            onClick={() =>
              handleTradeSelection(
                config.action,
                config.outcome,
                config.priceDefault
              )
            }
            variant="trade"
            isActive={
              selectedAction === config.action &&
              selectedOutcome === config.outcome
            }
          />
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span>Price</span>
          <ChevronDown size={16} />
        </div>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-20 text-right border rounded px-2 py-1"
          step="0.1"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span>Quantity</span>
          <ChevronDown size={16} />
        </div>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-20 text-right border rounded px-2 py-1"
          step="1"
        />
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-sm text-gray-600">You</div>
          <div className="font-bold">
            ₹ {currentOrder ? quantity * currentOrder.price : 0}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">You get</div>
          <div className="font-bold">
            ₹{" "}
            {currentOrder
              ? selectedAction === "buy"
                ? quantity * currentOrder.price - 10
                : quantity * currentOrder.price + 10
              : 0}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          className={`w-full text-white py-2 rounded transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Trade;
