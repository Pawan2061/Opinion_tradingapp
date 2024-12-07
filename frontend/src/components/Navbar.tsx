import { useRecoilValue } from "recoil";
import SignupLoginPopover from "./ui/auth";
import { authSelector } from "../recoil/atom";
import UserInfo from "./ui/Userinfo";

export default function Navbar() {
  const userdata = useRecoilValue(authSelector);
  console.log(userdata?.user, "user data is here");

  return (
    <div className="sticky top-0 z-10  mx-2">
      <nav className="bg-white  text-[rgb(38,38,38)] h-[65px] mb-0 overflow-hidden box-border ">
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
            {/* <a
              href="/team-11"
              className="text-xs font-work-sans hover:text-gray-600"
            >
              Team 11
            </a>
            <a
              href="/read"
              className="text-xs  font-work-sans hover:text-gray-600"
            >
              Read
            </a>
            <a
              href="/cares"
              className="text-xs font-work-sans hover:text-gray-600"
            >
              Cares
            </a>
            <a
              href="/careers"
              className="text-xs font-work-sans hover:text-gray-600"
            >
              Careers
            </a> */}
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden md:inline text-xs w-36  text-wrap  ">
              For 18 years and above only
            </span>

            {userdata?.user ? (
              // <>Welcome {userdata.user}</>
              <UserInfo />
            ) : (
              // <UserInfo />
              <SignupLoginPopover />
            )}

            {/* <button
              id="trade_online_btn_navbar"
              className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-4 rounded"
            >
              Trade Online
            </button> */}

            <div className="flex items-center justify-center max-w-[20px]">
              {/* <img
                src="/_next/static/media/translation.5ad894fb.png"
                alt="Translation"
                className="w-full h-auto"
              /> */}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
