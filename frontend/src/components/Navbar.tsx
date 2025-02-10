import { useRecoilValue } from "recoil";
import SignupLoginPopover from "./ui/auth";
import { authSelector } from "../recoil/atom";
import UserInfo from "./ui/Userinfo";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const userdata = useRecoilValue(authSelector);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Trading", path: "/events" },
    // { name: "Markets", path: "/markets" },
    { name: "Learn", path: "/learn" },
  ];

  return (
    <div
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "backdrop-blur-md bg-white/90 shadow-md" : "bg-white"
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center transition-transform duration-300 hover:scale-105"
          >
            <img
              src="https://probo.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.f2d033c9.webp&w=256&q=75"
              alt="Probo"
              className="h-8 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 hover:text-blue-600 ${
                  location.pathname === link.path
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {!userdata?.user ? (
              <>
                <span className="hidden md:block text-xs text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full">
                  For 18+ only
                </span>
                <div className="flex items-center space-x-3">
                  <SignupLoginPopover />
                </div>
              </>
            ) : (
              <UserInfo />
            )}

            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
