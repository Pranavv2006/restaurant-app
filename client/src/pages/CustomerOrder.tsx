import React from "react";
import CustomerNav from "../components/customer/CustomerNav";
import CustomerHero from "../components/customer/CustomerHero";

const CustomerHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Navbar */}
      <CustomerNav />

      {/* Hero Section */}
      <CustomerHero />
    </div>
  );
};

export default CustomerHome;
