import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Trade } from "../components/TradeDash";
import { useEffect, useState, useCallback } from "react";
import { transform } from "../utils/calc";

interface StockData {
  price: number;
  quantity: number;
}

interface WsData {
  yes?: StockData[];
  no?: StockData[];
  lastPrice?: number;
  volume?: number;
  change?: number;
}

interface OrderSectionProps {
  type: "YES" | "NO";
  orders: Array<StockData>;
  maxQuantity: number;
  onOrderSelect: (price: number, type: "YES" | "NO") => void;
}

const TableHeader = ({ title }: { title: string }) => (
  <div className="mb-3">
    <h2 className="text-sm font-medium text-slate-700 uppercase tracking-wider">
      {title}
    </h2>
    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-transparent mt-2 animate-shimmer"></div>
  </div>
);

const OrderSection = ({
  type,
  orders,
  maxQuantity,
  onOrderSelect,
}: OrderSectionProps) => (
  <div className="space-y-2">
    <div className="grid grid-cols-2 gap-4">
      <TableHeader title="Price" />
      <TableHeader title="Quantity" />
    </div>
    <div className="relative space-y-1.5 max-h-[400px] overflow-y-auto custom-scrollbar">
      {orders.map((order, index) => (
        <div
          key={index}
          onClick={() => onOrderSelect(order.price, type)}
          className="grid grid-cols-2 gap-4 py-2.5 px-4 hover:bg-slate-50/80 rounded-lg transition-all duration-300 group animate-fadeIn cursor-pointer"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <div className="flex items-center space-x-2">
            {type === "YES" ? (
              <div className="relative">
                <ArrowUpIcon className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300 animate-pulse"></div>
              </div>
            ) : (
              <div className="relative">
                <ArrowDownIcon className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-rose-400/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300 animate-pulse"></div>
              </div>
            )}
            <span
              className={`font-mono font-medium text-base ${
                type === "YES"
                  ? "text-emerald-600 group-hover:text-emerald-700"
                  : "text-rose-600 group-hover:text-rose-700"
              } transition-colors duration-300`}
            >
              ₹{order.price.toFixed(2)}
            </span>
          </div>
          <div className="relative">
            <div
              className={`absolute inset-0 ${
                type === "YES"
                  ? "bg-gradient-to-r from-emerald-200/40 to-emerald-100/40"
                  : "bg-gradient-to-r from-rose-200/40 to-rose-100/40"
              } rounded-lg transition-all duration-500 group-hover:opacity-100 opacity-75`}
              style={{
                width: `${Math.min(
                  (order.quantity / maxQuantity) * 100,
                  100
                )}%`,
                transform: "translateX(-100%)",
                animation: "slideRight 0.5s forwards",
                animationDelay: `${index * 50}ms`,
              }}
            />
            <span className="relative z-10 font-mono text-slate-700 font-medium group-hover:font-semibold transition-all duration-300">
              {order.quantity.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MarketStats = ({ data }: { data: WsData }) => (
  <div className="grid grid-cols-3 gap-4 mb-6">
    <div className="bg-white/60 p-4 rounded-lg">
      <h3 className="text-sm text-gray-500">Last Price</h3>
      <p className="text-lg font-semibold">
        ₹{data.lastPrice?.toFixed(2) || "0.00"}
      </p>
    </div>
    <div className="bg-white/60 p-4 rounded-lg">
      <h3 className="text-sm text-gray-500">24h Volume</h3>
      <p className="text-lg font-semibold">
        {data.volume?.toLocaleString() || "0"}
      </p>
    </div>
    <div className="bg-white/60 p-4 rounded-lg">
      <h3 className="text-sm text-gray-500">24h Change</h3>
      <p
        className={`text-lg font-semibold ${
          data.change && data.change > 0 ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {data.change
          ? `${data.change > 0 ? "+" : ""}${data.change.toFixed(2)}%`
          : "0.00%"}
      </p>
    </div>
  </div>
);

const OrderBook = () => {
  const [marketData, setMarketData] = useState<WsData>({
    yes: [],
    no: [],
    lastPrice: 0,
    volume: 0,
    change: 0,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWebSocket = useCallback(() => {
    try {
      const conn = new WebSocket("ws://localhost:8080");

      conn.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log("WebSocket connected");
        conn.send(
          JSON.stringify({
            stockSymbol: "BTC_USDT_10_Oct_2024_9_30",
            type: "subscribe",
          })
        );
      };

      conn.onmessage = (message) => {
        try {
          const res = JSON.parse(message.data);
          const transformedData = transform(res.message);
          setMarketData((prev) => ({
            ...prev,
            ...transformedData,
            lastPrice: transformedData.yes?.[0]?.price || prev.lastPrice,
            volume:
              (transformedData.yes?.reduce(
                (acc, curr) => acc + curr.quantity,
                0
              ) || 0) +
              (transformedData.no?.reduce(
                (acc, curr) => acc + curr.quantity,
                0
              ) || 0),
            change:
              (((transformedData.yes?.[0]?.price || 0) -
                (prev.lastPrice || 0)) /
                (prev.lastPrice || 1)) *
              100,
          }));
        } catch (err) {
          console.error("Error processing message:", err);
        }
      };

      conn.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("Connection error occurred");
        setIsConnected(false);
      };

      conn.onclose = () => {
        setIsConnected(false);
        setTimeout(connectWebSocket, 5000);
      };

      return () => {
        conn.close();
      };
    } catch (err) {
      setError("Failed to establish connection");
      console.error("Connection failed:", err);
    }
  }, []);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup;
  }, [connectWebSocket]);

  const handleOrderSelect = (price: number, type: "YES" | "NO") => {
    console.log(`Selected ${type} order at price: ${price}`);
  };

  const maxQuantity = Math.max(
    ...[...(marketData.yes || []), ...(marketData.no || [])].map(
      (o) => o.quantity
    )
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      <div className="bg-white/80 border border-slate-200 rounded-2xl shadow-xl md:w-2/3 h-auto p-6 backdrop-blur-md backdrop-filter hover:bg-white/90 transition-all duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800">Order Book</h1>
            <div className="relative">
              <span
                className={`text-sm px-3 py-1 rounded-full font-medium ${
                  isConnected
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100"
                }`}
              >
                {isConnected ? "Live" : "Connecting..."}
              </span>
              {isConnected && (
                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-md animate-ping"></div>
              )}
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>

        <MarketStats data={marketData} />

        <div className="grid grid-cols-2 gap-8 px-2">
          <OrderSection
            type="YES"
            orders={marketData.yes || []}
            maxQuantity={maxQuantity}
            onOrderSelect={handleOrderSelect}
          />
          <OrderSection
            type="NO"
            orders={marketData.no || []}
            maxQuantity={maxQuantity}
            onOrderSelect={handleOrderSelect}
          />
        </div>
      </div>

      <div className="md:w-1/3">
        <Trade />
      </div>
    </div>
  );
};

export default OrderBook;
