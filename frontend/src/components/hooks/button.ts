// import { useState } from "react";

// export function useColor(topic: string) {
//   const [description, setDescription] = useState(
//     "Build your knowledge and form your opinions and views about upcoming events in the world"
//   );

//   switch (topic) {
//     case "Samachar":
//       setDescription(
//         "Stay updated with the latest news from around the globe."
//       );
//       break;
//     case "Vichar":
//       setDescription(
//         "Explore diverse opinions and thought-provoking discussions."
//       );
//       break;
//     case "Upachar":
//       setDescription("Discover healing tips and well-being practices.");
//       break;
//     default:
//       setDescription(
//         "Build your knowledge and form your opinions and views about upcoming events in the world"
//       );
//       break;
//   }
//   return description;
// }

import { useState, useEffect } from "react";

// Hook to get description based on topic
export function useColor(topic: string) {
  const [description, setDescription] = useState(
    "Build your knowledge and form your opinions and views about upcoming events in the world"
  );
  const [heading, setHeading] = useState("Be in the know");

  // Update description based on topic
  useEffect(() => {
    switch (topic) {
      case "Samachar":
        setHeading("Be in the know");
        setDescription(
          "Stay updated with the latest news from around the globe.Build your knowledge and form your opinions and views about upcoming events in the world."
        );
        break;
      case "Vichar":
        setHeading("Use what you know");
        setDescription(
          "Build your knowledge and form your opinions and views about upcoming events in the world.Build your knowledge and form your opinions and views about upcoming events in the world."
        );
        break;
      case "Upachar":
        setHeading("Trade and grow");
        setDescription(
          "Discover healing tips and well-being practices.Build your knowledge and form your opinions and views about upcoming events in the world."
        );
        break;
      default:
        setDescription(
          "Build your knowledge and form your opinions and views about upcoming events in the world"
        );
    }
  }, [topic]); // Only runs when the topic changes

  return { description, heading };
}
