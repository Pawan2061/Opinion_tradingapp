import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Learn() {
  const [showMore, setShowMore] = useState(false);

  const handleToggle = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Learn About Opinion Trading</h1>
      <p className="mb-4">
        Opinion trading is a form of trading where individuals buy and sell
        based on their beliefs and opinions about the future performance of an
        asset. Unlike traditional trading, which relies heavily on quantitative
        analysis and market data, opinion trading emphasizes the subjective
        views of traders.
      </p>
      <button
        onClick={handleToggle}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showMore ? "Show Less" : "Show More"}
      </button>
      {showMore && (
        <div>
          <p className="mb-4">
            This approach can lead to unique market dynamics, as traders may
            react to news, social media trends, or personal insights rather than
            just numerical indicators. Understanding the psychology behind
            opinion trading can help traders make more informed decisions and
            navigate the market effectively.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="https://medium.com/probo-headquarters/indias-journey-in-t20i-world-cup-2024-5a2e625ba22c"
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.div
            className="bg-white shadow-lg rounded-lg p-4 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="font-semibold">India's T20 World Cup Journey</h2>
            <p>
              Learn about India's thrilling victory in the 2024 T20 World Cup.
            </p>
          </motion.div>
        </Link>
        <Link
          to="https://medium.com/probo-headquarters/examining-the-funding-dynamics-for-indian-startups-in-2023-and-2024-3d643f3ad597"
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.div
            className="bg-white shadow-lg rounded-lg p-4 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="font-semibold">
              Funding Dynamics for Indian Startups
            </h2>
            <p>
              Explore the funding trends for Indian startups in 2023 and 2024.
            </p>
          </motion.div>
        </Link>
        <motion.div
          className="bg-white shadow-lg rounded-lg p-4 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="font-semibold">Card 3</h2>
          <p>Details about opinion trading concept 3.</p>
        </motion.div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Story of the Week</h2>
        <h3 className="font-semibold">
          How Information Markets Could Unlock the Secrets of India's Economic
          Future
        </h3>
        <p className="mb-4">
          While India braces for economic challenges in 2024, Probo's
          information markets offer a fresh, crowdsourced take on predicting
          what's next, providing a pulse on public perception that often beats
          traditional indicators to the punch.
        </p>
        <p className="text-gray-500">Published on Sep 27, 2024</p>
      </div>
    </div>
  );
}
