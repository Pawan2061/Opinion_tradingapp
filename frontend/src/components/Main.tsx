import { vud } from "../assets";
import { useState } from "react";
import { useColor } from "./hooks/button";

export default function Main() {
  const [selectedTopic, setSelectedTopic] = useState("Samachar");
  const { description, heading } = useColor(selectedTopic);

  return (
    <section
      className="h-auto bg-[url('https://probo.in/assets/images/home/header/header-bg.svg')] bg-center  bg-no-repeat"
      style={{ backgroundSize: "100% 25%", backgroundPositionY: "35%" }}
    >
      <div className="flex flex-col lg:flex-row justify-around items-center">
        <div className="flex flex-col space-y-6 my-auto max-w-lg text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-work-sans">
            Invest in your point of view
          </h1>
          <h1 className="text-gray-600 text-lg md:text-xl">
            Sports, Entertainment and Finance
          </h1>
          <div className="flex justify-center lg:justify-start space-x-4">
            <button
              id="download_btn_navbar"
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
            >
              Download App
            </button>
            <button
              id="trade_online_btn_navbar"
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition"
            >
              Trade Online
            </button>
          </div>
        </div>
        <div className="max-w-xs md:max-w-md lg:max-w-lg">
          <img
            className="rounded-lg"
            src="https://probo.in/_next/image?url=https%3A%2F%2Fd39axbyagw7ipf.cloudfront.net%2Fimages%2Fhome%2Fheader%2Fheader.webp&w=1200&q=75"
            alt="Header image"
          />
        </div>
      </div>

      <div className="h-[500px] bg-[rgb(38,38,38)] flex flex-col lg:flex-row justify-start mx-auto p-4 lg:p-0">
        <div className="text-white flex flex-col justify-center flex-1 mx-4 md:mx-8 space-y-2 lg:space-y-4 text-center lg:text-left">
          <h1 className="text-[28px] md:text-[32px] lg:text-[42px]">
            <a
              className="cursor-pointer hover:text-gray-300"
              onClick={() => setSelectedTopic("Samachar")}
            >
              Samachar
            </a>{" "}
            <span className="text-gray-500">
              <a
                className="cursor-pointer hover:text-gray-300"
                onClick={() => setSelectedTopic("Vichar")}
              >
                Vichar
              </a>
            </span>{" "}
            <a
              className="cursor-pointer hover:text-gray-300"
              onClick={() => setSelectedTopic("Upachar")}
            >
              <span className="text-gray-500">Upachar</span>
            </a>
          </h1>
          <h2 className="text-[20px] md:text-[24px] lg:text-[30px]">
            {heading}
          </h2>
          <p className="text-[14px] md:text-[16px] lg:text-[20px]">
            {description}
          </p>
        </div>
        <div className="flex justify-center items-center flex-1 mt-6 lg:mt-0">
          <div className="bg-white w-[180px] md:w-[200px] lg:w-[240px] h-[300px] md:h-[380px] rounded-3xl shadow-lg border-4 border-gray-700 overflow-hidden flex items-center justify-center">
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
