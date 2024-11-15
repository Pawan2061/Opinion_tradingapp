import { useState, useEffect } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { balanceSelector, stockSelector } from "../recoil/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import Button from "./ui/Button";

// Parent container to display Trade and OrderBook side by side
// const Dashboard = () => {
//   return (
//     <div className="flex space-x-4 mx-auto max-w-6xl p-4">
//       <OrderBook /> {/* Assuming you have an OrderBook component */}
//       <Trade />
//     </div>
//   );
// };

export const Trade = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-3 space-y-4 max-w-md mx-auto h-[80vh]">
      <div className="flex gap-2 p-1 bg-slate-50 rounded-full">
        <Button /* props for "Buy" button */ />
        <Button /* props for "Sell" button */ />
      </div>

      <div className="flex gap-2 p-1 bg-slate-50 rounded-full">
        <Button /* props for "Yes" button */ />
        <Button /* props for "No" button */ />
      </div>

      <div className="space-y-3">
        <input
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Price"
          step={0.5}
          min={0.5}
          max={9.5}
        />
        <input
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Quantity"
          step={1}
          min={1}
          max={100}
        />
      </div>

      <div className="flex justify-between px-3 py-2 text-center">
        <div>
          <p className="text-lg font-medium">0 {/* Dynamic Total */}</p>
          <p className="text-slate-500">You</p>
        </div>
        <div>
          <p className="text-lg font-medium text-green-600">
            ₹{/* Dynamic Value */}
          </p>
          <p className="text-slate-500">You get</p>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 text-slate-500">
        Advanced Options
        <ChevronDown size={18} />
      </button>

      <button className="w-full py-3 rounded-lg bg-blue-500 text-white font-medium">
        Place Order
      </button>
    </div>
  );
};

// Main component export
export default Trade;
