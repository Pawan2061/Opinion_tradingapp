import React from "react";

export interface PriceButtonProps {
  type: string; // e.g., 'Buy', 'Sell', 'Yes', 'No'
  price?: string; // Price is optional, it may or may not be provided
  isActive: boolean; // Determines if the button is active
  onClick: () => void; // Function to handle the button click
  variant?: "price" | "trade"; // Optional variant for button styling
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
