import ScrollCard from "./ui/scrollCard";

export default function Slider() {
  return (
    <div className="flex h-[600px] max-h-[650px] w-full overflow-hidden">
      <div className="flex items-center justify-start flex-grow flex-shrink-0 w-1/3">
        <h1 className="text-6xl max-w-[1/4] font-bold text-gray-800 text-center">
          Trade what you like ,{" "}
          <span className="text-4xl">on what you like</span>
        </h1>
      </div>

      <div className="relative flex-grow flex-shrink-0 overflow-y-auto z-10 w-1/3">
        <div className="overflow-y-auto h-[calc(100vh-2rem)]">
          <div className="hidden md:grid grid-cols-2 gap-4 p-4">
            <ScrollCard />
          </div>
        </div>
      </div>
    </div>
  );
}
