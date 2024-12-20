import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Trade } from "../components/TradeDash";
import { useEffect, useState } from "react";
import { transform } from "../utils/calc";

const TableHeader = ({ title }: { title: string }) => (
  <div className="mb-2">
    <h2 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
      {title}
    </h2>
    <div className="w-full h-px bg-slate-200 mt-1"></div>
  </div>
);

const OrderSection = ({
  type,
  orders,
}: {
  type: "YES" | "NO";
  orders: Array<{ price: number; quantity: number }>;
}) => (
  <div className="space-y-1">
    <div className="grid grid-cols-2 gap-2">
      <TableHeader title="Price" />
      <TableHeader title="Quantity" />
    </div>
    <div className="relative space-y-0.5">
      {orders.map((order, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-4 py-1.5 px-2 hover:bg-slate-50 rounded transition-colors"
        >
          <div className="flex items-center space-x-2">
            {type === "YES" ? (
              <ArrowUpIcon className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`font-mono ${
                type === "YES" ? "text-green-600" : "text-red-600"
              }`}
            >
              ${order.price.toFixed(2)}
            </span>
          </div>
          <div className="relative">
            <div
              className={`absolute inset-0 ${
                type === "YES" ? "bg-green-100" : "bg-red-100"
              } rounded`}
              style={{
                width: `${Math.min(
                  (order.quantity /
                    Math.max(...orders.map((o) => o.quantity))) *
                    100,
                  100
                )}%`,
              }}
            />
            <span className="relative z-10 font-mono text-slate-700">
              {order.quantity.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface StockData {
  price: number;
  quantity: number;
}

interface WsData {
  yes?: StockData[];
  no?: StockData[];
}

const OrderBook = () => {
  const [ansData, setAnsData] = useState<WsData | null>(null);
  useEffect(() => {
    const conn = new WebSocket("ws://localhost:8080");
    conn.onopen = () => {
      console.log("WebSocket connected");
      const data = JSON.stringify({
        stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
        type: "subscribe",
      });
      conn.send(data);
    };

    conn.onmessage = (message) => {
      const res = JSON.parse(message.data);
      console.log(res.message);

      const ws_transformed = transform(res.message);
      console.log("ans:", ws_transformed);
      setAnsData(ws_transformed);
    };
  }, []);
  const yesOrders_const = [
    { price: 6.5, quantity: 50 },
    { price: 7, quantity: 7 },
    { price: 8, quantity: 54 },
    { price: 8.5, quantity: 1 },
    { price: 9, quantity: 3 },
  ];

  const noOrders_const = [
    { price: 4, quantity: 1 },
    { price: 4.5, quantity: 5 },
    { price: 5.5, quantity: 1 },
    { price: 6, quantity: 3 },
    { price: 6.5, quantity: 1 },
  ];

  const yesOrders = ansData ? ansData.yes : yesOrders_const;
  console.log(yesOrders, "yes orders are here");

  const noOrders = ansData ? ansData.no : noOrders_const;
  console.log(noOrders, "no orders are here");

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg md:w-2/3 h-[28rem] p-6">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-800">Order Book</h1>
            <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Live
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Buy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Sell</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <OrderSection type="YES" orders={yesOrders!} />
          <OrderSection type="NO" orders={noOrders!} />
        </div>
      </div>

      <div className="md:w-1/3">
        <Trade />
      </div>
    </div>
  );
};

export default OrderBook;
