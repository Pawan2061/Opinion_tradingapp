// export default function Navbar() {
//   return (
//     <nav className="  top-0 border    ">
//       <div className="container h-16 flex items-center mx-auto justify-between ">
//         <div className="flex space-x-4">
//           <a href="/" className="flex items-center max-w-[112px]">
//             <img
//               src="https://probo.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.f2d033c9.webp&w=256&q=75"
//               alt="Probo"
//               className="h-10px w-full"
//             />
//           </a>

//           <div className="hidden md:flex space-x-4 text-[#262626] font-sans   text-sm">
//             <a href="/events" className="">
//               Trading
//             </a>
//             <a href="/team-11" className="">
//               Team 11
//             </a>
//             <a href="/read" className="">
//               Read
//             </a>
//             <a href="/read" className="">
//               Read
//             </a>
//             <a href="/read" className="">
//               Read
//             </a>
//           </div>
//         </div>

//         <div className="flex items-center space-x-6">
//           <h1 className="w-[80px] text-sm"> for people above 18 only</h1>

//           <button
//             id="download_btn_navbar"
//             className=" hover:bg-gray-[#FFFFFF] text-[#262626]  px-4 border rounded-sm"
//           >
//             Download App
//           </button>
//           <button
//             id="trade_online_btn_navbar"
//             className="bg-[#262626]  text-white  px-4 rounded"
//           >
//             Trade Online
//           </button>

//           <div className="flex items-center justify-center max-w-[20px]">
//             <img
//               src="/_next/static/media/translation.5ad894fb.png"
//               alt="Translation"
//               className="w-full h-auto"
//             />
//           </div>
//           {/*
//           <div className="md:hidden flex flex-col space-y-1 cursor-pointer">
//             <div className="w-6 h-0.5 bg-white"></div>
//             <div className="w-6 h-0.5 bg-white"></div>
//             <div className="w-6 h-0.5 bg-white"></div>
//           </div> */}
//         </div>
//       </div>
//     </nav>
//   );
// }

export default function Navbar() {
  return (
    <div>
      <nav className="bg-[rgb(245,245,245)]  text-[rgb(38,38,38)] h-[65px] mb-0 overflow-hidden box-border">
        <div className="container mx-auto flex items-center justify-between h-full ">
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
            <a
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
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden md:inline text-xs w-36  text-wrap  ">
              For 18 years and above only
            </span>

            <button
              id="download_btn_navbar"
              className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-4 rounded"
            >
              Download App
            </button>
            <button
              id="trade_online_btn_navbar"
              className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-4 rounded"
            >
              Trade Online
            </button>

            <div className="flex items-center justify-center max-w-[20px]">
              <img
                src="/_next/static/media/translation.5ad894fb.png"
                alt="Translation"
                className="w-full h-auto"
              />
            </div>

            {/* <div className="md:hidden flex flex-col space-y-1 cursor-pointer">
              <div className="w-6 h-0.5 bg-[rgb(38,38,38)]"></div>
              <div className="w-6 h-0.5 bg-[rgb(38,38,38)]"></div>
              <div className="w-6 h-0.5 bg-[rgb(38,38,38)]"></div>
            </div> */}
          </div>
        </div>
      </nav>
    </div>
  );
}
