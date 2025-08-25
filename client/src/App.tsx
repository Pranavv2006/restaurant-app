import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Merchant from "./pages/Merchant";
import CreateRestaurant from "./pages/CreateRestaurant";
import MerchantProfile from "./components/merchant/MerchantProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/merchant" element={<Merchant />} />
        <Route path="/create-restaurant" element={<CreateRestaurant />} />
        <Route path="/merchant/profile" element={<MerchantProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
