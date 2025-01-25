import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import Events from "../pages/Events";
import Navbar from "../components/Navbar";
import OrderBook from "../pages/Trade";
import Wallet from "../pages/Wallet";

const Approutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/events" element={<Events />} />
        <Route path="/trade" element={<OrderBook />} />
        <Route path="/wallet" element={<Wallet />} />
        {/* <Route path="/trade" element={<Trade />} /> */}
      </Routes>
    </Router>
  );
};

export default Approutes;
