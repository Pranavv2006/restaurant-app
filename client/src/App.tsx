import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Merchant from "./pages/Merchant";
import MerchantProfile from "./components/merchant/MerchantProfile";
import Customer from "./pages/Customer";
import CustomerOrder from "./pages/CustomerOrder";
import RestaurantPage from "./pages/RestaurantPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/merchant" element={<Merchant />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/merchant/profile" element={<MerchantProfile />} />
        <Route path="/order" element={<CustomerOrder />} />
        <Route
          path="/customer/RestaurantPage/:restaurantId"
          element={<RestaurantPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
