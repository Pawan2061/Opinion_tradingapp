import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Approutes from "./routes/index.route";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Approutes />
    </div>
  );
}
