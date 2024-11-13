import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import Events from "../pages/Events";
import Navbar from "../components/Navbar";
import OrderBook from "../pages/Trade";
const Approutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/events" element={<Events />} />
        <Route path="/trade" element={<OrderBook wsData={null} />} />
      </Routes>
    </Router>
  );
};

export default Approutes;
