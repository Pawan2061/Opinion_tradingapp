import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authSelector, authState } from "../recoil/atom";
import axios from "axios";
import { FaWallet, FaArrowUp, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/calc";

const Wallet = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const userdata = useRecoilValue(authSelector);
  const setAuthState = useSetRecoilState(authState);
  const navigate = useNavigate();

  const predefinedAmounts = [100, 500, 1000, 5000];

  const handleRampUser = async () => {
    if (!amount) {
      setError("Please enter an amount");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(API_BASE_URL + "/api/v1/onramp/inr", {
        userId: userdata?.user,
        amount: Number(amount),
      });
      console.log(response.data, "response data");

      if (response.data) {
        setAuthState((prevState) => ({
          ...prevState,
          balance: (prevState.balance || 0) + Number(amount),
        }));

        setSuccess("Successfully added funds to wallet!");
        setAmount("");
      } else {
        setError(response.data.message || "Failed to add funds");
      }
    } catch (err) {
      setError("Failed to process transaction");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <FaWallet className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Wallet</h2>
          <p className="mt-2 text-sm text-gray-600">
            Add funds to your trading account
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <p className="text-sm opacity-80">Available Balance</p>
            <h3 className="text-2xl font-bold">
              ₹{userdata?.balance?.toLocaleString() || "0.00"}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {predefinedAmounts.map((preAmount) => (
              <button
                key={preAmount}
                onClick={() => setAmount(preAmount.toString())}
                className={`p-3 text-sm font-medium rounded-lg transition-all duration-300 
                  ${
                    amount === preAmount.toString()
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                ₹{preAmount.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Enter Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRampUser}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FaArrowUp className="w-4 h-4" />
                    Add Funds
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/history")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              >
                <FaHistory className="w-4 h-4" />
                Transaction History
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    {success}
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
