import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import { authSelector } from "../../recoil/atom";

const UserInfo = () => {
  const userdata = useRecoilValue(authSelector);

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

    if (isPopupOpen) {
      console.log("opened");

      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  // const handleLogout = () => {
  //   console.log("User logged out");
  //   setIsPopupOpen(false);
  // };

  return (
    <div className="">
      <button
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        aria-label="User menu"
      >
        <FaUserCircle className="w-8 h-8 text-gray-600 hover:text-gray-800" />
      </button>
      {isPopupOpen && (
        <div className="relative group inline-block max-w-xs">
          <div className="flex items-center gap-x-3 p-1 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-400 ">
            <img
              className="w-9 h-9 rounded-full"
              src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80"
              alt="Avatar"
            />

            <div className="grow">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                {userdata?.user}
              </h4>
              <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-neutral-500">
                {mockUser.totalMoney}
              </p>

              <button>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
