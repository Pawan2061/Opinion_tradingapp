import { useState, useRef, useEffect } from "react";
import {
  FaUserCircle,
  FaWallet,
  FaCog,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authSelector, authState } from "../../recoil/atom";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
  const userdata = useRecoilValue(authSelector);
  const setAuthState = useSetRecoilState(authState);
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // If no user data, don't render the component
  if (!userdata?.user) {
    return null;
  }

  const mockUser = {
    name: userdata.user,
    balance: userdata.balance?.toLocaleString() || "0.00",
    profit: "+₹250.00",
    trades: 28,
  };

  const menuItems = [
    { icon: FaWallet, label: "Wallet", action: () => navigate("/wallet") },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  const handleLogout = () => {
    setAuthState({
      user: null,
      token: null,
      balance: 0,
    });
    setIsPopupOpen(false);
    navigate("/");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:scale-105"
        aria-label="User menu"
      >
        <FaUserCircle className="w-8 h-8 text-gray-600 hover:text-blue-600" />
      </button>

      {isPopupOpen && (
        <div
          ref={popupRef}
          className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-300 ease-in-out"
        >
          {/* User Profile Section */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${mockUser.name}`}
                alt="Avatar"
              />
              <div>
                <h4 className="text-sm font-semibold text-gray-800">
                  {mockUser.name}
                </h4>
                <p className="text-xs text-gray-500">Active Trader</p>
              </div>
            </div>

            {/* Balance Section */}
            <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Balance</span>
                <span className="text-sm font-semibold">
                  {mockUser.balance}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">Today's Profit</span>
                <span className="text-xs font-medium text-green-500">
                  {mockUser.profit}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Total Trades: {mockUser.trades}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <item.icon className="w-4 h-4 text-gray-500" />
                {item.label}
              </button>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 mt-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
