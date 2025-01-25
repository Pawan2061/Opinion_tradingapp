import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { handleSignin, hanldeAuth } from "../../utils/calc";
import { queryClient } from "../../main";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authState } from "../../recoil/atom";
import axios from "axios";

const SignupLoginPopover = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useRecoilState(authState);
  console.log(auth);

  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const setAuthState = useSetRecoilState(authState);

  const signUpmutation = useMutation({
    mutationFn: hanldeAuth,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      setAuthState({
        user: data.user.username,
        token: data.token,
        balance: data.user.balance || 0,
      });
      navigate("/events");
    },
  });
  const loginMutation = useMutation({
    mutationFn: handleSignin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      setAuthState({
        user: data.user.username,
        token: data.token,
        balance: data.user.balance || 0,
      });
      navigate("/events");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const response = await axios.post(
        `http://localhost:3000/api/v1${endpoint}`,
        {
          username,
          password,
          email,
        }
      );

      if (response.data) {
        setAuthState({
          user: response.data.user.username,
          token: response.data.token,
          balance: response.data.user.balance || 0,
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    console.log("Login attempt:", { username, password });
    setUsername("");
    setPassword("");
    setIsOpen(false);
    loginMutation.mutate({
      email,
      username,
      password,
    });
  };

  const handleSignup = (e: any) => {
    e.preventDefault();
    console.log("Signup attempt:", { username, email, password });
    setUsername("");
    setEmail("");
    setPassword("");
    setIsOpen(false);
    signUpmutation.mutate({
      email,
      username,
      password,
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-6 rounded-full font-semibold transition duration-300 shadow-md"
      >
        Sign In
      </button>

      {isOpen && (
        <div className="fixed inset-0   z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <div className="flex mb-6 gap-4">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2 text-center font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === "login"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2 text-center font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === "signup"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80"
                }`}
              >
                Signup
              </button>
            </div>

            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label
                    htmlFor="login-username"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Username
                  </label>
                  <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </button>
              </form>
            )}

            {activeTab === "signup" && (
              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label
                    htmlFor="signup-username"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Username
                  </label>
                  <input
                    id="signup-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Choose your username"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="signup-password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Create a password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={signUpmutation.isPending}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {signUpmutation.isPending
                    ? "Creating account..."
                    : "Create Account"}
                </button>
              </form>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition duration-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupLoginPopover;
