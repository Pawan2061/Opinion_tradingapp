import { useColor } from "./hooks/button";
import { vud } from "../assets";
import { useState } from "react";
// ... existing code ...
export default function Main() {
  const [selectedTopic, setSelectedTopic] = useState("Samachar");
  const { description, heading } = useColor(selectedTopic);

  return (
    <section className="min-h-screen bg-[url('https://probo.in/assets/images/home/header/header-bg.svg')] bg-center bg-no-repeat">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex flex-col space-y-8 max-w-xl text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-work-sans font-bold animate-fade-in">
              Invest in your{" "}
              <span className="text-blue-600">point of view</span>
            </h1>
            <h2 className="text-gray-600 text-xl md:text-2xl">
              Sports, Entertainment and Finance
            </h2>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button
                id="download_btn_navbar"
                className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Download App
              </button>
              <button
                id="trade_online_btn_navbar"
                className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Trade Online
              </button>
            </div>
          </div>
          <div className="max-w-md lg:max-w-xl transform hover:scale-105 transition-transform duration-300">
            <img
              className="rounded-2xl shadow-2xl"
              src="https://probo.in/_next/image?url=https%3A%2F%2Fd39axbyagw7ipf.cloudfront.net%2Fimages%2Fhome%2Fheader%2Fheader.webp&w=1200&q=75"
              alt="Header image"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[rgb(38,38,38)] py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="text-white flex flex-col justify-center flex-1 space-y-6 text-center lg:text-left">
              <div className="space-x-4 text-[32px] md:text-[42px] lg:text-[52px] font-bold">
                <a
                  className={`cursor-pointer transition-colors duration-300 ${
                    selectedTopic === "Samachar"
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  onClick={() => setSelectedTopic("Samachar")}
                >
                  Samachar
                </a>
                <a
                  className={`cursor-pointer transition-colors duration-300 ${
                    selectedTopic === "Vichar"
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  onClick={() => setSelectedTopic("Vichar")}
                >
                  Vichar
                </a>
                <a
                  className={`cursor-pointer transition-colors duration-300 ${
                    selectedTopic === "Upachar"
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  onClick={() => setSelectedTopic("Upachar")}
                >
                  Upachar
                </a>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                {heading}
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-300">
                {description}
              </p>
            </div>
            <div className="flex justify-center items-center flex-1">
              <div className="bg-white w-[220px] md:w-[280px] lg:w-[320px] h-[400px] md:h-[480px] rounded-[2rem] shadow-2xl border-4 border-gray-700 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <video
                  className="rounded-xl h-full w-full object-cover"
                  muted
                  loop
                  autoPlay
                  src={vud}
                ></video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
