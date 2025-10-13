import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Landing from "./pages/Landing";
import Merchant from "./pages/Merchant";
import MerchantProfile from "./components/merchant/MerchantProfile";
import RestaurantPage from "./pages/RestaurantPage";
import RestaurantHome from "./pages/RestaurantHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/auth" element={<Landing />} />
        <Route path="/merchant" element={<Merchant />} />
        <Route path="/home" element={<RestaurantHome />} />
        <Route path="/merchant/profile" element={<MerchantProfile />} />
        <Route
          path="/customer/RestaurantPage/:restaurantId"
          element={<RestaurantPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
