import { useState, useEffect } from "react";

export function useColor(topic: string) {
  const [description, setDescription] = useState(
    "Build your knowledge and form your opinions and views about upcoming events in the world"
  );
  const [heading, setHeading] = useState("Be in the know");

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
  }, [topic]);

  return { description, heading };
}
