import { useRecoilValue } from "recoil";
import SignupLoginPopover from "./ui/auth";
import { authSelector } from "../recoil/atom";
import UserInfo from "./ui/Userinfo";

export default function Navbar() {
  const userdata = useRecoilValue(authSelector);
  console.log(userdata?.user, "user data is here");

  return (
    <div className="sticky top-0 z-10 mx-2">
      <nav className="bg-white text-[rgb(38,38,38)] h-[65px] mb-0 overflow-hidden box-border">
        <div className="container mx-auto flex items-center justify-between h-full border border-gray-200 border-t-0 border-l-0 border-r-0">
          <a href="/" className="flex items-center max-w-[112px]">
            <img
              src="https://probo.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.f2d033c9.webp&w=256&q=75"
              alt="Probo"
              className="h-auto w-full"
            />
          </a>

          <div className="flex space-x-4">
            <a
              href="/events"
              className="text-xs font-work-sans hover:text-gray-600"
            >
              Trading
            </a>
          </div>

          <div className="flex items-center space-x-2">
            {userdata?.user ? (
              <UserInfo />
            ) : (
              <div className="flex items-center">
                <span className="hidden md:inline text-xs w-36 text-wrap">
                  For 18 years and above only
                </span>
                <SignupLoginPopover />
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
