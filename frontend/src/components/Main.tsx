import { useColor } from "./hooks/button";
import { vud } from "../assets";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState("Samachar");
  const { description, heading } = useColor(selectedTopic);

  const topics = ["Samachar", "Vichar", "Upachar"];

  return (
    <main className="min-h-screen bg-[url('https://probo.in/assets/images/home/header/header-bg.svg')] bg-center bg-no-repeat">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex flex-col space-y-8 max-w-xl text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-work-sans font-bold animate-fade-in">
              Invest in your{" "}
              <span className="text-blue-600">point of view</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl lg:text-2xl">
              Sports, Entertainment and Finance
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button id="download_btn_navbar" className="btn-primary">
                Download App
              </button>
              <button
                onClick={() => navigate("/events")}
                id="trade_online_btn_navbar"
                className="btn-secondary"
              >
                Trade Online
              </button>
            </div>
          </div>
          <div className="w-full max-w-md lg:max-w-xl">
            <img
              className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              src="https://probo.in/_next/image?url=https%3A%2F%2Fd39axbyagw7ipf.cloudfront.net%2Fimages%2Fhome%2Fheader%2Fheader.webp&w=1200&q=75"
              alt="Trading platform preview"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[rgb(38,38,38)] py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="text-white flex flex-col justify-center flex-1 space-y-8 text-center lg:text-left">
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-[32px] md:text-[42px] lg:text-[52px] font-bold">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    className={`cursor-pointer transition-colors duration-300 ${
                      selectedTopic === topic
                        ? "text-white"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                {heading}
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-300">
                {description}
              </p>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <div className="relative bg-white w-[280px] md:w-[320px] lg:w-[360px] h-[480px] lg:h-[520px] rounded-[2rem] shadow-2xl border-4 border-gray-700 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  loop
                  autoPlay
                  src={vud}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
