import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import Events from "../pages/Events";
import Navbar from "../components/Navbar";
const Approutes = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/events" element={<Events />} />
      </Routes>
    </Router>
  );
};

export default Approutes;
