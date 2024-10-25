export default function Main() {
  return (
    <section
      className="bg-[url('https://probo.in/assets/images/home/header/header-bg.svg')]  bg-center h-[640px] bg-no-repeat"
      style={{ backgroundSize: "100% 25%", backgroundPositionY: "70%" }}
    >
      <div className="flex justify-around">
        <div className="flex justify-start flex-col  space-y-10 my-auto flex-wrap-reverse  ">
          <h1 className="text-6xl font-work-sans max-w-[400px]">
            Invest in your point of view
          </h1>
          <h1 className="text-[#545454]">Sports, Entertainment and Finance</h1>
          <div className="flex space-x-4 ">
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
          </div>
        </div>
        <div className="max-w-[500px] ">
          <img
            src="https://probo.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fheader.19c7be25.webp&w=1200&q=75"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
