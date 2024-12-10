import React from "react";

export interface PriceButtonProps {
  type: string;
  price?: string;
  isActive: boolean;
  onClick: () => void;
  variant?: "price" | "trade";
}

export const TradeButton: React.FC<PriceButtonProps> = ({
  type,
  price,
  isActive,
  onClick,
  variant = "price",
}) => {
  const baseClasses = "flex-1 py-2 rounded-full text-sm transition-colors";

  const activeClasses = isActive
    ? "bg-white shadow-sm"
    : "text-slate-500 hover:bg-white hover:text-opacity-70 hover:shadow-sm";

  const typeColorClasses = (() => {
    if (variant === "trade") {
      return type.toLowerCase() === "buy" || type.toLowerCase() === "yes"
        ? "text-green-500"
        : "text-red-500";
    }

    return type.toLowerCase() === "yes" ? "text-blue-500" : "text-red-400";
  })();

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses} ${typeColorClasses} ${
        isActive ? "font-semibold" : ""
      }`}
    >
      {type} {price && `₹${price}`}
    </button>
  );
};
