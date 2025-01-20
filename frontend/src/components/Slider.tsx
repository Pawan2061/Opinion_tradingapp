import ScrollCard from "./ui/scrollCard";
import { motion } from "framer-motion";

export default function Slider() {
  return (
    <div className="relative min-h-[600px] w-full bg-gradient-to-r from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Trade what you like
              <span className="block mt-2 text-2xl md:text-3xl lg:text-4xl text-blue-600">
                on what you like
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600">
              Discover endless trading possibilities with our intuitive platform
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 h-[500px] relative"
          >
            <div className="h-full overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                {[1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="transform hover:scale-105 transition-transform duration-300"
                  >
                    <ScrollCard />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
