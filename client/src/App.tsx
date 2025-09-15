import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Merchant from "./pages/Merchant";
import MerchantProfile from "./components/merchant/MerchantProfile";
import Customer from "./pages/Customer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/merchant" element={<Merchant />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/merchant/profile" element={<MerchantProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
