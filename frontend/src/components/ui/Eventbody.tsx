// export default function Eventbody() {
//   const description = {
//     yes: "probability of yes",
//     no: "probability of no",
//   };
//   return (
//     <section className="mx-6 mt-5 space-y-9">
//       <div className="flex justify-center gap-x-32 ">
//         <div className="flex flex-col justify-start  space-y-2 max-w-xl  ">
//           <h1 className="font-work-sans font-semibold ">Top stories</h1>

import ScrollCard from "./scrollCard";

//           <div className="max-w-5xl w-auto font-semibold bg-[#ffffff] shadow-2xl rounded-2xl p-4 flex justify-around lg:max-w-full lg:flex">
//             <div className="flex flex-col max-w-sm">
//               <h1 className="flex font-work-sans text-[18px] text-[#262626]">
//                 Tax refunds by us government to be increased by 10%{" "}
//                 <span>
//                   <img
//                     height="60px"
//                     width="60px"
//                     src="https://probo.in/_next/image?url=https%3A%2F%2Fgumlet-images-bucket.s3.ap-south-1.amazonaws.com%2Fprobo_product_images%2FIMAGE_f19f81af-fdf7-47da-b360-c990246b148f.png&w=128&q=75"
//                     alt=""
//                   />
//                 </span>
//               </h1>
//               <h1 className="text-[#545454] font-work-sans font-semibold  text-[14px] ">
//                 Tailwind doesn't include pre-designed card components out of the
//                 box, but they're easy to build using existing utilities.
//               </h1>
//               <h1 className="text-[#545454] font-work-sans font-normal  text-[10px]">
//                 Tailwind CSS is a highly customizable, low-level CSS framework
//                 that gives you all of the building blocks you need to build
//                 bespoke designs without any annoying opinionated styles you have
//                 to fight to override.
//               </h1>

//               <div className="flex justify-between mt-2">
//                 <h1>hi</h1>
//                 <div>
//                   <button
//                     type="button"
//                     className="text-white bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-100 dark:focus:ring-blue-300 font-medium rounded-md text-sm px-6 py-1 text-center me-2 mb-2"
//                   >
//                     Yes ₹ 2
//                   </button>

//                   <button
//                     type="button"
//                     className="text-white bg-gradient-to-r from-red-200 via-red-300 to-red-400 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-300 font-medium rounded-md text-sm px-6 py-1 text-center me-2 mb-2"
//                   >
//                     No ₹ 8
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col">
//               <div className="flex justify-between">
//                 <h1 className="text-blue-400 text-xs">
//                   90% <br />
//                   <span className="text-xs font-work-sans text-gray-400 font-normal">
//                     {description.yes}
//                   </span>
//                 </h1>
//                 <br />

//                 <button
//                   className="rounded-md bg-blue-600 p-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
//                   type="button"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                     className="w-4 h-4"
//                   >
//                     <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
//                   </svg>
//                 </button>
//               </div>

//               <img
//                 width="300px"
//                 src="https://probo.in/_next/image?url=%2Fassets%2Fimages%2Fevents%2Fimages%2Fdownload.png&w=256&q=75"
//                 alt=""
//               />
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col  justify-start items-center">
//           <div className="max-w-xs py-6 px-2  bg-[#EDEDED] p-3 flex justify-between border rounded-xl">
//             <h1 className=" text-[#262626]  text-xl font-normal font-work-sans max-w-xs">
//               Download for the better experience
//               <br />
//               <span className="">
//                 <button
//                   id="download_btn_navbar"
//                   className="bg-black hover:bg-gray-600 text-white py-0 px-2 rounded-sm"
//                 >
//                   Download App
//                 </button>
//               </span>
//             </h1>

//             <img
//               width="100px"
//               src="https://probo.in/_next/image?url=%2Fassets%2Fimages%2Fevents%2Fimages%2Fdownload.png&w=256&q=75"
//               alt=""
//             />
//           </div>
//           <h1>2</h1>
//         </div>
//       </div>
//       <div className="flex flex-col space-y-5 max-w-xl">
//         <h2 className="font-semibold font-work-sans  border-b-2">All Events</h2>
//         <div>2</div>
//       </div>
//     </section>
//   );
// }

export default function Eventbody() {
  const description = {
    yes: "probability of yes",
    no: "probability of no",
  };

  return (
    <section className="mx-6 mt-5 space-y-9">
      <div className="flex flex-col lg:flex-row justify-center lg:gap-x-32 space-y-8 lg:space-y-0">
        {/* Top Stories Section */}
        <div className="flex flex-col max-w-xl space-y-2">
          <h1 className="font-work-sans font-semibold">Top Stories</h1>
          <div className="bg-white shadow-2xl rounded-2xl p-4 flex flex-col lg:flex-row justify-around">
            <div className="flex flex-col max-w-sm space-y-2">
              <h1 className="flex items-center text-[18px] text-[#262626] font-semibold font-work-sans">
                Tax refunds by US government to be increased by 10%{" "}
                <span className="ml-2">
                  <img
                    height="60"
                    width="60"
                    src="https://probo.in/_next/image?url=https%3A%2F%2Fgumlet-images-bucket.s3.ap-south-1.amazonaws.com%2Fprobo_product_images%2FIMAGE_f19f81af-fdf7-47da-b360-c990246b148f.png&w=128&q=75"
                    alt=""
                  />
                </span>
              </h1>
              <p className="text-[#545454] font-work-sans font-semibold text-[14px]">
                Tailwind doesn’t include pre-designed card components out of the
                box, but they’re easy to build using existing utilities.
              </p>
              <p className="text-[#545454] font-work-sans font-normal text-[10px]">
                Tailwind CSS is a highly customizable, low-level CSS framework
                that gives you all the building blocks to build bespoke designs
                without opinionated styles to override.
              </p>
              <div className="flex justify-between mt-2">
                <span>hi</span>
                <div>
                  <button
                    type="button"
                    className="text-white bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-100 dark:focus:ring-blue-300 font-medium rounded-md text-sm px-6 py-1 me-2 mb-2"
                  >
                    Yes ₹ 2
                  </button>
                  <button
                    type="button"
                    className="text-white bg-gradient-to-r from-red-200 via-red-300 to-red-400 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-300 font-medium rounded-md text-sm px-6 py-1 me-2 mb-2"
                  >
                    No ₹ 8
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-blue-400 text-xs">
                  90% <br />
                  <span className="text-xs text-gray-400 font-work-sans font-normal">
                    {description.yes}
                  </span>
                </span>
                <button
                  className="rounded-md bg-blue-600 p-2.5 text-white text-sm shadow-sm hover:shadow-lg focus:bg-blue-700 focus:shadow-none"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                </button>
              </div>
              <img
                width="300"
                src="https://probo.in/_next/image?url=%2Fassets%2Fimages%2Fevents%2Fimages%2Fdownload.png&w=256&q=75"
                alt=""
              />
            </div>
          </div>
        </div>

        {/* Download App Section */}
        <div className="flex flex-col items-center lg:items-start max-w-md">
          <div className="bg-[#EDEDED] p-3 flex flex-col lg:flex-row justify-between items-center border rounded-xl space-y-3 lg:space-y-0">
            <div className="text-center lg:text-left">
              <h1 className="text-[#262626] text-xl font-normal font-work-sans">
                Download for a better experience
              </h1>
              <button
                id="download_btn_navbar"
                className="bg-black hover:bg-gray-600 text-white py-1 px-4 mt-2 rounded-sm"
              >
                Download App
              </button>
            </div>
            <img
              width="100"
              src="https://probo.in/_next/image?url=%2Fassets%2Fimages%2Fevents%2Fimages%2Fdownload.png&w=256&q=75"
              alt=""
            />
          </div>
        </div>
      </div>

      {/* All Events Section */}
      <div className="max-w-xl">
        <h2 className="font-semibold font-work-sans border-b-2 pb-2">
          All Events
        </h2>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <ScrollCard />
          </div>
          <div>
            <ScrollCard />
          </div>
        </div>
      </div>
    </section>
  );
}
