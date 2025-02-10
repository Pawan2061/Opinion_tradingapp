import { useNavigate } from "react-router-dom";
import { EventDescNav } from "./NavEventDesc";
import { useState } from "react";

export default function Eventbody() {
  const navigate = useNavigate();
  const [likedStories, setLikedStories] = useState<Set<number>>(new Set());

  const toggleLike = (storyId: number) => {
    setLikedStories((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(storyId)) {
        newLiked.delete(storyId);
      } else {
        newLiked.add(storyId);
      }
      return newLiked;
    });
  };

  const stories = [
    {
      id: 1,
      title: "Will India win the T20 World Cup 2024?",
      shortDesc:
        "Cricket's biggest tournament approaches with India as favorites",
      longDesc:
        "With a strong lineup and recent performances, India enters as top contenders. Place your predictions for the championship outcome.",
      image:
        "https://images.indianexpress.com/2024/02/India-vs-Afghanistan.jpg",
      yesPrice: 5,
      noPrice: 4,
      probability: 85,
      category: "Sports",
    },
    {
      id: 2,
      title: "Tesla Stock to hit $300 by Q2 2024",
      shortDesc:
        "Market predictions for Tesla's performance after recent updates",
      longDesc:
        "Following new product announcements and market expansion, analysts predict significant growth for Tesla stock.",
      image:
        "https://bsmedia.business-standard.com/_media/bs/img/article/2024-04/30/full/1714454526-2588.JPG?im=FeatureCrop,size=(826,465)",
      yesPrice: 3,
      noPrice: 6,
      probability: 65,
      category: "Finance",
    },
    {
      id: 3,
      title: "Oscars 2024: Oppenheimer to win Best Picture",
      shortDesc: "Academy Awards predictions heat up as ceremony approaches",
      longDesc:
        "Christopher Nolan's epic leads the nominations. Trade on whether it will secure the top prize at the 96th Academy Awards.",
      image:
        "https://variety.com/wp-content/uploads/2023/07/oppenheimer-movie.jpg",
      yesPrice: 7,
      noPrice: 2,
      probability: 92,
      category: "Entertainment",
    },
    {
      id: 4,
      title: "RBI to maintain current interest rates in next policy meet",
      shortDesc: "Central bank's monetary policy decision awaited",
      longDesc:
        "Amid stable inflation numbers, predict if RBI will hold rates steady in the upcoming monetary policy committee meeting.",
      image:
        "https://images.livemint.com/img/2023/02/08/600x338/RBI_1675840781156_1675840781428_1675840781428.jpg",
      yesPrice: 4,
      noPrice: 5,
      probability: 78,
      category: "Finance",
    },
  ];

  const featuredStories = [
    {
      id: 1,
      title: "IPL 2024 Winner Predictions",
      desc: "Place your bets on which team will lift the trophy this season",
      category: "Sports",
    },
    {
      id: 2,
      title: "Bitcoin Price Movement",
      desc: "Will Bitcoin cross $70,000 by end of March 2024?",
      category: "Crypto",
    },
    {
      id: 3,
      title: "Lok Sabha Elections 2024",
      desc: "Predict the outcome of the world's largest democratic exercise",
      category: "Politics",
    },
  ];

  return (
    <section className="container mx-auto px-4 mt-5 space-y-6">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-work-sans font-semibold text-gray-800">
            Top Stories
          </h2>

          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {story.category}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800 mt-2">
                      {story.title}
                    </h3>
                  </div>
                  <img
                    src={story.image}
                    alt=""
                    className="w-24 h-24 object-cover rounded-lg ml-4"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-gray-700 font-medium">{story.shortDesc}</p>
                  <p className="text-gray-600 text-sm">{story.longDesc}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleLike(story.id)}
                      className={`p-2 rounded-full transition-colors duration-300 ${
                        likedStories.has(story.id)
                          ? "text-red-500 bg-red-50"
                          : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-500">
                      {story.probability}% probability
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate("/trade")}
                      className="btn-yes"
                    >
                      Yes ₹{story.yesPrice}
                    </button>
                    <button
                      onClick={() => navigate("/trade")}
                      className="btn-no"
                    >
                      No ₹{story.noPrice}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 shadow-md">
            <div className="flex flex-col space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Get the full experience
              </h3>
              <p className="text-gray-600">
                Download our app for a better trading experience
              </p>
              <button className="btn-primary w-full">Download App</button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Featured Stories
            </h3>
            <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
              {featuredStories.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  onClick={() => navigate("/trade")}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <EventDescNav />
    </section>
  );
}
