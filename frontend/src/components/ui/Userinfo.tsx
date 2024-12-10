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
    <div className="">
      <button
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        aria-label="User menu"
      >
        <FaUserCircle className="w-8 h-8 text-gray-600 hover:text-gray-800" />
      </button>

      {isPopupOpen && (
        // <div
        //   ref={popupRef}
        //   className=" right-0 top-full mt-2 w-64 rounded-lg shadow-lg py-4 px-6  border border-gray-200"
        // >
        //   <div className="space-y-4">
        //     <div className="text-center">
        //       <h3 className="text-xl font-semibold text-gray-800">
        //         {mockUser.name}
        //       </h3>
        //     </div>

        //     <div className="rounded-lg p-4 bg-gray-400">
        //       <p className="text-sm text-gray-500">Total Balance</p>
        //       <p className="text-2xl font-bold text-gray-800">
        //         {mockUser.totalMoney}
        //       </p>
        //     </div>

        //     <button
        //       onClick={handleLogout}
        //       className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        //     >
        //       Logout
        //     </button>
        //   </div>
        // </div>
        <div className="relative group inline-block max-w-xs">
          <div className="flex items-center gap-x-3 p-1 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-400 ">
            <img
              className="w-9 h-9 rounded-full"
              src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80"
              alt="Avatar"
            />

            <div className="grow">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                Amanda Harvey
              </h4>
              <p className="text-sm text-gray-800 md:text-gray-500 dark:text-white md:dark:text-neutral-500">
                amanda@email.com
              </p>
            </div>
          </div>

          {/* <div className="absolute left-full top-1/2 -translate-y-1/2 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity z-10 w-[250px] bg-white border border-gray-100 rounded-xl shadow-md dark:bg-neutral-800 dark:border-neutral-700">
            <div className="py-3 px-4 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex items-center gap-x-3">
                <img
                  className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-neutral-900"
                  src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&&auto=format&fit=facearea&facepad=3&w=300&h=300&q=80"
                  alt="Avatar"
                />
                <div className="grow">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Amanda Harvey
                    <span className="ms-0.5 py-0.5 px-1.5 inline-flex items-center gap-x-1.5 text-[11px] font-medium rounded-md bg-gray-800 text-white dark:bg-white dark:text-neutral-800">
                      PRO
                    </span>
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-neutral-500">
                    Storyteller
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default UserInfo;
