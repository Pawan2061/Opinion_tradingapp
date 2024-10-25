import { vud } from "../assets";
import { useColor } from "./hooks/button";

export default function Main() {
  const color = useColor();
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

      <div className="h-[500px] bg-[rgb(38,38,38)] flex flex-col lg:flex-row justify-start mx-auto p-4 lg:p-0">
        <div className="text-white flex flex-col justify-center flex-1 mx-4 md:mx-8 space-y-2 lg:space-y-4">
          <h1 className="text-[32px] md:text-[42px]">
            <a href=""> Samachar</a>{" "}
            <span className="text-gray-500">
              {" "}
              <a href="">Vichar</a>
            </span>{" "}
            <a href="">
              {" "}
              <span className="text-gray-500">Upachar</span>
            </a>
          </h1>
          <h2 className="text-[24px] md:text-[30px]">Be in the know</h2>
          <p className="text-[16px] md:text-[20px]">
            Build your knowledge and form your opinions and views about upcoming
            events in the world
          </p>
        </div>
        <div className="flex justify-center items-center flex-1 mt-6 lg:mt-0">
          <div className="bg-white w-[200px] md:w-[240px] h-[400px] md:h-[380px] rounded-3xl shadow-lg border-4 border-gray-700 overflow-hidden flex items-center justify-center">
            <video
              className="rounded-xl"
              muted
              loop
              autoPlay
              height="100%"
              width="100%"
              src={vud}
            ></video>
          </div>
        </div>
      </div>
    </section>
  );
}
