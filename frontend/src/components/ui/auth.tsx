import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { handleSignin, hanldeAuth } from "../../utils/calc";
import { queryClient } from "../../main";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../../recoil/atom";

const SignupLoginPopover = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuthState] = useRecoilState(authState);
  console.log(auth);

  const [email, setEmail] = useState("");
  const signUpmutation = useMutation({
    mutationFn: hanldeAuth,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      setAuthState(data.user.username);
      navigate("/events");
    },
  });
  const loginMutation = useMutation({
    mutationFn: handleSignin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      setAuthState(data.user.username);
      navigate("/events");
    },
  });

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
        className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-4 rounded"
      >
        Join
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6">
            <div className="flex mb-4 border-b">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2 text-center ${
                  activeTab === "login"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2 text-center ${
                  activeTab === "signup"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Signup
              </button>
            </div>

            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Login
                </button>
              </form>
            )}

            {activeTab === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label
                    htmlFor="signup-username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="signup-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Choose username"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="signup-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Create password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={signUpmutation.isPending}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
                >
                  Signup
                </button>
              </form>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
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
