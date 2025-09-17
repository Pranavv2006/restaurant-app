import React from "react";
import CustomerNav from "../components/customer/CustomerNav";
import OrderHero from "../components/customer/OrderHero";

const CustomerOrder: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Navbar */}
      <CustomerNav />

      {/* Hero Section */}
      <OrderHero />
    </div>
  );
};

export default CustomerOrder;
