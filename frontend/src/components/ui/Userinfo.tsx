import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

const UserInfo = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const mockUser = {
    name: "John Doe",
    totalMoney: "$500.00",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        console.log("clicked");

        setIsPopupOpen(false);
      }
    };

    // Only add listener if popup is open
    if (isPopupOpen) {
      console.log("opened");

      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  const handleLogout = () => {
    console.log("User logged out");
    setIsPopupOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        aria-label="User menu"
      >
        <FaUserCircle className="w-8 h-8 text-gray-600 hover:text-gray-800" />
      </button>

      {isPopupOpen && (
        <div
          ref={popupRef}
          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg py-4 px-6 z- border border-gray-200"
        >
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {mockUser.name}
              </h3>
            </div>

            <div className="rounded-lg p-4 bg-gray-100">
              <p className="text-sm text-gray-500">Total Balance</p>
              <p className="text-2xl font-bold text-gray-800">
                {mockUser.totalMoney}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
