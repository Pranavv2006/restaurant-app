import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Merchant from "./pages/Merchant";
import MerchantProfile from "./components/merchant/MerchantProfile";
import Customer from "./pages/MerchantMain";
import RestaurantPage from "./pages/RestaurantPage";
import Main from "./pages/MerchantMain";
import MerchantMain from "./pages/MerchantMain";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/merchant" element={<Merchant />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/merchant/profile" element={<MerchantProfile />} />
        <Route path="/merchant/join" element={<MerchantMain/>} />
        <Route
          path="/customer/RestaurantPage/:restaurantId"
          element={<RestaurantPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
